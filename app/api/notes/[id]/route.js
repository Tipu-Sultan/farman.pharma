// app/api/notes/[id]/route.js
import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import cloudinary from '@/lib/cloudinary'

export async function GET(request, { params }) {
  await dbConnect()
  const note = await Note.findById(params.id).lean()
  if (!note) {
    return new Response(JSON.stringify({ error: 'Note not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const serializedNote = {
    ...note,
    _id: note._id.toString(),
    ownerId: note.ownerId?.toString(),
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    date: note.date.toISOString(),
  }
  return new Response(JSON.stringify(serializedNote), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function PUT(request, { params }) {
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
  const file = formData.get('file') // New file, if provided

  if (!title || !description || !type || !date || !subject) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const existingNote = await Note.findById(params.id)
  if (!existingNote) {
    return new Response(JSON.stringify({ error: 'Note not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let fileUrl = existingNote.fileUrl
  if (file && file.size > 0) { // Check if a new file is uploaded
    // Delete the old file from Cloudinary
    if (fileUrl) {
      const publicId = fileUrl.split('/').pop().split('.')[0] // Extract public_id (filename without extension)
      await cloudinary.uploader.destroy(`farman-pharma/${publicId}`, { resource_type: 'raw' })
    }

    // Upload the new file to Cloudinary
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'farman-pharma', public_id: file.name.replace(/\.[^/.]+$/, '') },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(fileBuffer)
    })
    fileUrl = uploadResult.secure_url
  }

  const updatedNote = await Note.findByIdAndUpdate(
    params.id,
    { title, description, type, date, subject, fileUrl },
    { new: true }
  ).lean()

  const serializedNote = {
    ...updatedNote,
    _id: updatedNote._id.toString(),
    ownerId: updatedNote.ownerId?.toString(),
    createdAt: updatedNote.createdAt.toISOString(),
    updatedAt: updatedNote.updatedAt.toISOString(),
    date: updatedNote.date.toISOString(),
  }

  return new Response(JSON.stringify(serializedNote), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function DELETE(request, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const note = await Note.findById(params.id)
  if (!note) {
    return new Response(JSON.stringify({ error: 'Note not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Delete the file from Cloudinary
  if (note.fileUrl) {
    try {
      // Extract public_id from URL (everything after version)
      const urlParts = note.fileUrl.split('/')
      const versionIndex = urlParts.findIndex(part => part.startsWith('v')) // e.g., v1743130580
      const publicId = urlParts.slice(versionIndex + 1).join('/') // e.g., farman-pharma/abc123xyz

      console.log('File URL:', note.fileUrl)
      console.log('Computed publicId:', publicId)

      const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
      if (result.result !== 'ok') {
        console.error('Cloudinary deletion failed:', result)
      } else {
        console.log('Cloudinary file deleted successfully:', publicId)
        return new Response(JSON.stringify({ error: 'Note not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error)
    }
  }

  await Note.findByIdAndDelete(params.id)
  return new Response(null, { status: 204 })
}