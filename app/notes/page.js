import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import NotesClient from './NotesClient'

async function fetchNotes() {
  await dbConnect()
  const notes = await Note.find({}).lean() 
  return notes.map(note => ({
    id: note._id.toString(),
    title: note.title,
    description: note.description,
    type: note.type,
    subject: note.subject,
    fileUrl: note.fileUrl,
    createdAt: note.createdAt.toISOString(),
  }))
}

export default async function Notes() {
  const notes = await fetchNotes()

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Study Notes</h1>
        <NotesClient initialNotes={notes} />
      </div>
    </div>
  )
}