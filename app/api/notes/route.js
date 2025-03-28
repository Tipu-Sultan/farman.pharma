// app/api/notes/route.js
import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import cloudinary from '@/lib/cloudinary'

export async function POST(request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const type = formData.get('type')
  const date = formData.get('date')
  const subject = formData.get('subject')
  const file = formData.get('file')

  if (!title || !description || !type || !date || !subject || !file) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Upload file to Cloudinary as raw resource, let Cloudinary generate public_id
  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'farman-pharma' }, // Omit public_id to let Cloudinary generate it
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

  return new Response(JSON.stringify(serializedNote), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}