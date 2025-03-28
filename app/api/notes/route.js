import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import cloudinary from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

export async function POST(request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const type = formData.get('type')
  const date = formData.get('date')
  const subject = formData.get('subject')
  const file = formData.get('file')

  if (!title || !description || !type || !date || !subject || !file) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Upload file to Cloudinary with sanitized filename (no spaces)
  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const originalFileName = file.name // e.g., "RHEUMATOID ARTHRITIS PPT NEW.pptx"
  const sanitizedFileName = originalFileName.replace(/\s+/g, '_') // e.g., "RHEUMATOID_ARTHRITIS_PPT_NEW.pptx"
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'farman-pharma', public_id: sanitizedFileName },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(fileBuffer)
  })
  const fileUrl = uploadResult.secure_url

  const note = await Note.create({
    title,
    description,
    type,
    date,
    subject,
    fileUrl,
    ownerId: session.user.id,
  })

  const serializedNote = {
    ...note.toObject(),
    _id: note._id.toString(),
    ownerId: note.ownerId.toString(),
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    date: note.date.toISOString(),
  }

  return NextResponse.json(serializedNote, { status: 201 })
}