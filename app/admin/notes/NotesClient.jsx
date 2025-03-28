// app/admin/notes/NotesClient.jsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Trash2, Edit, Plus } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react' // For loading spinner

export default function NotesClient({ initialNotes }) {
  const [notes, setNotes] = useState(initialNotes)
  const [loadingStates, setLoadingStates] = useState({}) // Track loading for each note
  const router = useRouter()

  const handleDelete = async (id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { delete: true } }))
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setNotes(notes.filter((note) => note._id !== id)) // Update local state
      } else {
        throw new Error('Failed to delete note')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to delete note')
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: { delete: false } }))
    }
  }

  const handleEdit = (id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: { edit: true } }))
    router.push(`/admin/notes/edit/${id}`) 
  }

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold">Manage Notes</h1>
        <Link href="/admin/notes/create">
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add Note
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Notes List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {notes.length === 0 ? (
            <p className="text-center">No notes available.</p>
          ) : (
            <div className="grid gap-6 overflow-x-hidden">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full overflow-hidden"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium truncate">{note.title}</h3>
                      <p className="text-sm truncate">{note.subject}</p>
                      <p className="text-xs truncate">
                        {note.description.substring(0, 50)}...
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="outline">{note.type}</Badge>
                        <Badge variant="secondary">
                          {note.updatedAt
                            ? new Date(note.updatedAt).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })
                            : 'Never'}
                        </Badge>

                        <Badge variant="outline">By: {note.ownerName}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(note._id)}
                      disabled={loadingStates[note._id]?.edit || loadingStates[note._id]?.delete}
                    >
                      {loadingStates[note._id]?.edit ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover:bg-red-600"
                      onClick={() => handleDelete(note._id)}
                      disabled={loadingStates[note._id]?.edit || loadingStates[note._id]?.delete}
                    >
                      {loadingStates[note._id]?.delete ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}