// app/api/notes/[id]/route.js
import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import cloudinary from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

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
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const type = formData.get('type');
  const date = formData.get('date');
  const subject = formData.get('subject');
  const file = formData.get('file');

  if (!title || !description || !type || !subject) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const existingNote = await Note.findById(params.id);
  if (!existingNote) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  let fileUrl = existingNote.fileUrl;

  if (file && file.size > 0) {
    // **Delete the old file from Cloudinary using working logic from DELETE**
    if (fileUrl) {
      try {
        const urlParts = fileUrl.split('/');
        const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
        let publicId = urlParts.slice(versionIndex + 1).join('/');

        console.log('File URL:', fileUrl);
        console.log('Computed publicId:', publicId);

        let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

        if (result.result !== 'ok') {
          // Fallback: Try decoded public_id with spaces instead of underscores or %20
          const decodedPublicId = decodeURIComponent(publicId).replace(/_/g, ' ');
          console.log('Trying decoded publicId with spaces:', decodedPublicId);
          result = await cloudinary.uploader.destroy(decodedPublicId, { resource_type: 'raw' });

          if (result.result !== 'ok') {
            // Additional fallback for %20-encoded files
            const encodedPublicId = publicId.replace(/ /g, '%20');
            console.log('Trying %20-encoded publicId:', encodedPublicId);
            result = await cloudinary.uploader.destroy(encodedPublicId, { resource_type: 'raw' });

            if (result.result !== 'ok') {
              console.error('Cloudinary deletion failed:', result);
            }
          }
        }
        console.log('Cloudinary file deleted successfully:', publicId);
      } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
      }
    }

    // **Upload the new file**
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const originalFileName = file.name.replace(/\s+/g, '_'); // Replace spaces with underscores

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'farman-pharma', public_id: originalFileName },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    fileUrl = uploadResult.secure_url;
  }

  // **Update the note**
  const updatedNote = await Note.findByIdAndUpdate(
    params.id,
    { title, description, type, date, subject, fileUrl, updatedAt: Date.now() },
    { new: true }
  ).lean();

  if (!updatedNote) {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }

  const serializedNote = {
    ...updatedNote,
    _id: updatedNote._id.toString(),
    ownerId: updatedNote.ownerId?.toString(),
    createdAt: updatedNote.createdAt.toISOString(),
    updatedAt: updatedNote.updatedAt.toISOString(),
  };

  return NextResponse.json(serializedNote, { status: 200 });
}


export async function DELETE(request, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const note = await Note.findById(params.id)
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }

  // Delete the file from Cloudinary if it exists
  if (note.fileUrl) {
    try {
      const urlParts = note.fileUrl.split('/')
      const versionIndex = urlParts.findIndex(part => part.startsWith('v'))
      let publicId = urlParts.slice(versionIndex + 1).join('/')
      console.log('File URL:', note.fileUrl)
      console.log('Computed publicId:', publicId)

      let result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
      if (result.result !== 'ok') {
        // Fallback: Try decoded public_id with spaces instead of underscores or %20
        const decodedPublicId = decodeURIComponent(publicId).replace(/_/g, ' ')
        console.log('Trying decoded publicId with spaces:', decodedPublicId)
        result = await cloudinary.uploader.destroy(decodedPublicId, { resource_type: 'raw' })
        if (result.result !== 'ok') {
          // Additional fallback for %20-encoded files
          const encodedPublicId = publicId.replace(/ /g, '%20')
          console.log('Trying %20-encoded publicId:', encodedPublicId)
          result = await cloudinary.uploader.destroy(encodedPublicId, { resource_type: 'raw' })
          if (result.result !== 'ok') {
            console.error('Cloudinary deletion failed:', result)
            return NextResponse.json(
              { error: 'Failed to delete file from Cloudinary', details: result },
              { status: 500 }
            )
          }
        }
      }
      console.log('Cloudinary file deleted successfully:', publicId)
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error)
      return NextResponse.json(
        { error: 'Error deleting file from Cloudinary', details: error.message },
        { status: 500 }
      )
    }
  }

  await Note.findByIdAndDelete(params.id)
  return NextResponse.json(
    { message: 'Note and associated file deleted successfully' },
    { status: 200 }
  )
}