import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import cloudinary from "@/lib/cloudinary";

async function deleteFileFromCloudinary(fileUrl, resourceType = "video") {
  if (!fileUrl) return console.error("No file URL provided");

  try {
    console.log("Original File URL:", fileUrl);

    // Extract only the relevant part (folder path + filename)
    const urlParts = fileUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return console.error("Invalid Cloudinary URL format");
    }

    // Extract everything after "upload/version", removing the extension
    let filePathWithExt = urlParts.slice(uploadIndex + 2).join("/");
    let publicId = filePathWithExt.replace(/\.[^.]+$/, ""); // Removes file extension

    console.log("Extracted publicId:", publicId); // Should be "farman-pharma/car"

    // Attempt deletion from Cloudinary
    let result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

    if (result.result !== "ok") {
      console.error("Cloudinary deletion failed:", result);
      return { error: "Failed to delete file from Cloudinary", details: result };
    }

    console.log("Cloudinary file deleted successfully:", publicId);
    return { success: true, publicId };
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return { error: "Cloudinary deletion error", details: error.message };
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { adminRole, permissions } = session.user;

  // Permission check: Superadmin can delete everything, content-manager needs "delete" permission
  if (
    adminRole !== "superadmin" &&
    !(adminRole === "content-manager" && permissions?.includes("delete"))
  ) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to delete this resource" },
      { status: 403 }
    );
  }

  // Find the resource
  const resource = await Resource.findById(params.id);
  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  // If it's a file (video, paper, book), delete from Cloudinary
  if (["video", "paper", "book"].includes(resource.type)) {
    const deleteResponse = await deleteFileFromCloudinary(resource.link);
    if (!deleteResponse.success) {
      return NextResponse.json(
        { error: "Cloudinary deletion failed", details: deleteResponse.details },
        { status: 500 }
      );
    }
  }

  // Delete from MongoDB after successful Cloudinary deletion
  await Resource.findByIdAndDelete(params.id);

  return NextResponse.json({ message: "Resource deleted successfully" }, { status: 200 });
}

export async function PUT(request, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { adminRole, permissions } = session.user;

  // Permission check: Superadmin can update everything, content-manager needs "write" permission
  if (
    adminRole !== "superadmin" &&
    !(adminRole === "content-manager" && permissions?.includes("write"))
  ) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to update this resource" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const type = formData.get("type");
    const link = formData.get("link");
    const metadata = formData.get("metadata")
      ? JSON.parse(formData.get("metadata"))
      : {};

    if (!title || !type || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingResource = await Resource.findById(params.id);
    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // If updating a file (video, paper, book), delete the old file from Cloudinary
    if (
      ["video", "paper", "book"].includes(existingResource.type) &&
      existingResource.link !== link &&
      adminRole === "superadmin"
    ) {
      const deleteResponse = await deleteFileFromCloudinary(existingResource.link);
      if (!deleteResponse.success) {
        return NextResponse.json(
          { error: "Failed to delete old file from Cloudinary" },
          { status: 500 }
        );
      }
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      params.id,
      { title, type, link, metadata },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedResource) {
      return NextResponse.json({ error: "Resource update failed" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Resource updated successfully", resource: updatedResource },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/resources:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
