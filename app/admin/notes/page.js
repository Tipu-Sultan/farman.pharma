// app/admin/notes/page.js
import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import NotesClient from './NotesClient'

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
    date: note.date.toISOString(),
  }))
}

export default async function NotesPage() {
  const notes = await getNotes()

  return (
    <div className="space-y-8 p-6 min-h-screen">
      <NotesClient initialNotes={notes} />
    </div>
  )
}