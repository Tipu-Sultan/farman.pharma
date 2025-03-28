import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import cloudinary from "@/lib/cloudinary"; // Ensure correct import

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer and save temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = path.join(process.cwd(), "public", file.name);

    await writeFile(tempFilePath, buffer);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: "raw", // Supports PDFs, DOC, PPT
      folder: "documents",
    });

    // Delete the temporary file
    await unlink(tempFilePath);

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
