// app/admin/notes/page.js
import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import NotesClient from './NotesClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

async function getNotes() {
  await dbConnect()
  const notes = await Note.find().populate('ownerId', 'name').lean()
  return notes.map((note) => ({
    ...note,
    _id: note._id.toString(),
    ownerId: note.ownerId?._id.toString(),
    ownerName: note.ownerId?.name || 'Unknown',
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  }))
}

export default async function NotesPage() {
  const notes = await getNotes()
    const session = await getServerSession(authOptions)
    const isSuperadmin = session?.user?.adminRole === 'superadmin'

  return (
    <div className="min-h-screen">
      <NotesClient initialNotes={notes} adminSession={session} isSuperadmin={isSuperadmin} />
    </div>
  )
}