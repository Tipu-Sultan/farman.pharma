// scripts/seedNotes.js
import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'

const notesData = [
  {
    id: 1,
    title: 'Pharmaceutical Chemistry Notes',
    description: 'Complete notes on organic and inorganic pharmaceutical chemistry',
    type: 'PDF',
    date: '2024-03-15',
    subject: 'Chemistry',
  },
  {
    id: 2,
    title: 'Pharmacology Basics',
    description: 'Introduction to pharmacology and drug actions',
    type: 'PDF',
    date: '2024-03-14',
    subject: 'Pharmacology',
  },
  {
    id: 3,
    title: 'Human Anatomy Notes',
    description: 'Comprehensive study of human body systems',
    type: 'PDF',
    date: '2024-03-13',
    subject: 'Anatomy',
  },
]

async function seedNotes() {
  await dbConnect()

  const notes = notesData.map(note => ({
    ...note,
    date: new Date(note.date), // Convert string to Date object
  }))

  await Note.deleteMany({})
  await Note.insertMany(notes)
  console.log('Notes seeded successfully')
  process.exit()
}

seedNotes().catch(err => {
  console.error(err)
  process.exit(1)
})