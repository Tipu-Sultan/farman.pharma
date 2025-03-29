import dbConnect from '@/lib/dbConnect';
import Note from '@/models/Note';
import NotesClient from './NotesClient';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Adjust the import path based on your setup

async function fetchNotes() {
  await dbConnect();
  const notes = await Note.find({}).lean();
  return notes.map(note => ({
    id: note._id.toString(),
    title: note.title,
    description: note.description,
    type: note.type,
    subject: note.subject,
    fileUrl: note.fileUrl,
    createdAt: note.createdAt.toISOString(),
  }));
}

// A reusable Skeleton Loader component for the fallback
function NotesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-6 w-1/3" /> {/* Title */}
          <Skeleton className="h-4 w-2/3" /> {/* Description */}
          <Skeleton className="h-4 w-1/2" /> {/* Additional info */}
        </div>
      ))}
    </div>
  );
}

export default async function Notes() {
  const notes = await fetchNotes();

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Study Notes</h1>
        <Suspense fallback={<NotesSkeleton />}>
          <NotesClient initialNotes={notes} />
        </Suspense>
      </div>
    </div>
  );
}