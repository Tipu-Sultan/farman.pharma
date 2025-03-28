'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Book, FileText, Search, Download, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function NotesClient({ initialNotes }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [previewFile, setPreviewFile] = useState(null)

  const filteredNotes = initialNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Search notes by title or subject..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {note.type === 'PDF' ? (
                  <FileText className="h-5 w-5 text-red-500" />
                ) : note.type === 'DOC' ? (
                  <FileText className="h-5 w-5 text-blue-500" />
                ) : (
                  <FileText className="h-5 w-5 text-orange-500" /> // PPT
                )}
                {note.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-2">{note.description}</p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                  {note.subject}
                </span>
                <span className="text-muted-foreground">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
              {note.fileUrl && (
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <a href={note.fileUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setPreviewFile(note.fileUrl)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl w-full">
                      <DialogHeader>
                        <DialogTitle>Preview: {note.title}</DialogTitle>
                      </DialogHeader>
                      <iframe
                        src={`https://docs.google.com/gview?url=${previewFile}&embedded=true`}
                        width="100%"
                        height="500px"
                      ></iframe>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
