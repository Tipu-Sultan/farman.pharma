// app/api/resources/route.js
import dbConnect from "@/lib/dbConnect";
import Resource from "@/models/Resource";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { adminRole, permissions = [] } = session.user;

  // Superadmin and Admin have full access
  const hasFullAccess = adminRole === "superadmin" || adminRole === "admin";

  // Content Manager needs CRUD-specific permissions
  const canCreate =
    adminRole === "content_manager" && permissions.includes("create_resource");

  if (!hasFullAccess && !canCreate) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to create resources" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const type = formData.get("type");
    const file = formData.get("file");
    const description = formData.get("description");
    const metadata = formData.get("metadata")
      ? JSON.parse(formData.get("metadata"))
      : {};

    if (!title || !type) {
      return NextResponse.json(
        { error: "Missing required fields (title or type)" },
        { status: 400 }
      );
    }

    let link = "";
    let fileSize = 0;

    if (["image", "book", "video", "paper"].includes(type)) {
      if (!file || !description) {
        return NextResponse.json(
          { error: "File and description are required for this resource type" },
          { status: 400 }
        );
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      fileSize = fileBuffer.length;

      const fileExt = file.name.split(".").pop();
      const originalFileName = file.name
        .replace(/\s+/g, "_")
        .replace(/\.(\w+)$/, "");

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: ["image", "video"].includes(type) ? type : "raw",
              folder: "farman-pharma",
              public_id: originalFileName,
              format: fileExt,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(fileBuffer);
      });

      link = uploadResult.secure_url;
      console.log("Cloudinary upload successful:", { link, fileSize });
    } else if (type === "blog") {
      if (!metadata.content) {
        return NextResponse.json(
          { error: "Blog content is required" },
          { status: 400 }
        );
      }
      link = `/blogs/${title.replace(/\s+/g, "-").toLowerCase()}`;
    } else {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    const resourceData = {
      title,
      type,
      link,
      ...(description && { description }),
      ...(fileSize > 0 && { fileSize }),
      metadata,
      ownerId: session.user.id,
    };

    const resource = await Resource.create(resourceData);

    return NextResponse.json(
      {
        ...resource.toObject(),
        _id: resource._id.toString(),
        ownerId: resource.ownerId.toString(),
        createdAt: resource.createdAt.toISOString(),
        updatedAt: resource.updatedAt.toISOString(),
        metadata: Object.fromEntries(resource.metadata),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/resources:", error);
    return NextResponse.json(
      { error: "Failed to create resource", details: error.message },
      { status: 500 }
    );
  }
}

// GET handler remains unchanged
export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resources = await Resource.find().lean();
  const serializedResources = resources.map((resource) => ({
    ...resource,
    _id: resource._id.toString(),
    ownerId: resource.ownerId?.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
    metadata:
      resource.metadata instanceof Map
        ? Object.fromEntries(resource.metadata)
        : resource.metadata,
  }));

  return NextResponse.json(serializedResources, { status: 200 });
}
