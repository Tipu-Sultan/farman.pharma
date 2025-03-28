// app/admin/notes/create/page.js
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'

export default function CreateNotePage() {
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    type: 'PDF',
    date: new Date().toISOString().split('T')[0],
    subject: '',
  })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

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
      setNewNote({ ...newNote, type: validTypes[selectedFile.type] }) // Set type based on file
    } else {
      alert('Please upload a PDF, DOC, or PPT file.')
    }
  }

  const handleAddNote = async () => {
    if (!file) {
      alert('Please upload a file.')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('title', newNote.title)
    formData.append('description', newNote.description)
    formData.append('type', newNote.type)
    formData.append('date', newNote.date)
    formData.append('subject', newNote.subject)
    formData.append('file', file)

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setNewNote({
          title: '',
          description: '',
          type: 'PDF',
          date: new Date().toISOString().split('T')[0],
          subject: '',
        })
        setFile(null)
        router.push('/admin/notes')
      } else {
        throw new Error('Failed to create note')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred while creating the note.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8 p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold">Create New Note</h1>
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Note Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter note title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject"
              value={newNote.subject}
              onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              value={newNote.description}
              onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={newNote.type}
              onValueChange={(value) => setNewNote({ ...newNote, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="DOC">DOC</SelectItem>
                <SelectItem value="PPT">PPT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Upload File (PDF, DOC, PPT)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileChange}
            />
          </div>
          <Button
            onClick={handleAddNote}
            className="w-full"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}