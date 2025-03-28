// app/admin/notes/edit/[id]/page.js
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function EditNotePage() {
  const [editNote, setEditNote] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch(`/api/notes/${id}`)
      if (res.ok) {
        const note = await res.json()
        setEditNote({
          ...note,
        })
      }
    }
    fetchNote()
  }, [id])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    const validTypes = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOC',
      'application/vnd.ms-powerpoint': 'PPT',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPT',
    }
    if (selectedFile && validTypes[selectedFile.type]) {
      setFile(selectedFile)
      setEditNote({ ...editNote, type: validTypes[selectedFile.type] })
    } else {
      alert('Please upload a PDF, DOC, or PPT file.')
    }
  }

  const handleEditNote = async () => {
    setUploading(true)
    const formData = new FormData()
    formData.append('title', editNote.title)
    formData.append('description', editNote.description)
    formData.append('type', editNote.type)
    formData.append('subject', editNote.subject)
    if (file) formData.append('file', file) // Only append file if a new one is selected

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        body: formData,
      })
      if (res.ok) {
        router.push('/admin/notes')
      } else {
        throw new Error('Failed to update note')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred while updating the note.')
    } finally {
      setUploading(false)
    }
  }

  if (!editNote) return <div className="text-center p-6">Loading...</div>

  return (
    <div className="space-y-8 p-6min-h-screen">
      <h1 className="text-4xl font-extrabold ">Edit Note</h1>
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold ">Note Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editNote.title}
              onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={editNote.subject}
              onChange={(e) => setEditNote({ ...editNote, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editNote.description}
              onChange={(e) => setEditNote({ ...editNote, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={editNote.type}
              onValueChange={(value) => setEditNote({ ...editNote, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOC">DOC</SelectItem>
                <SelectItem value="PPT">PPT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Upload New File (PDF, DOC, PPT) - Optional</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileChange}
            />
            {editNote.fileUrl && (
              <p className="text-sm text-muted-foreground">
                Current file: <a href={editNote.fileUrl} target="_blank" rel="noopener noreferrer">{editNote.fileUrl.split('/').pop()}</a>
              </p>
            )}
          </div>
          <Button
            onClick={handleEditNote}
            className="w-full"
            disabled={uploading}
          >
            {uploading ? 'Saving...' : 'Save'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}