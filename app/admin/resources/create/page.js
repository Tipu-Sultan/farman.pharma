// app/admin/resources/create/page.js
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import dynamic from 'next/dynamic'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css' // Import Quill styles

export default function CreateResourcePage() {
  const [newResource, setNewResource] = useState({
    title: '',
    type: '',
    description: '', // For book, video, paper
  })
  const [metadata, setMetadata] = useState({}) // For type-specific fields
  const [file, setFile] = useState(null) // For file uploads
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.type) {
      alert('Please fill in all required fields.')
      return
    }

    if (['book', 'video', 'paper'].includes(newResource.type)) {
      if (!file || !newResource.description) {
        alert('Please upload a file and provide a description.')
        return
      }
    }

    if (newResource.type === 'blog' && (!metadata.content || metadata.content.trim() === '')) {
      alert('Please enter blog content.')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('title', newResource.title)
    formData.append('type', newResource.type)

    if (['book', 'video', 'paper'].includes(newResource.type)) {
      formData.append('file', file)
      formData.append('description', newResource.description)
    }

    if (Object.keys(metadata).length > 0) {
      formData.append('metadata', JSON.stringify(metadata))
    }

    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setNewResource({ title: '', type: '', description: '' })
        setMetadata({})
        setFile(null)
        router.push('/admin/resources')
        router.refresh()
      } else {
        const errorData = await res.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating resource:', error)
      alert('An unexpected error occurred.')
    } finally {
      setUploading(false)
    }
  }

  const renderDynamicField = () => {
    switch (newResource.type) {
      case 'book':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter book description"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Enter author name"
                value={metadata.author || ''}
                onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.epub"
              />
            </div>
          </>
        )
      case 'video':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter video description"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Video File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".mp4,.mov"
              />
            </div>
          </>
        )
      case 'paper':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter paper description"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="journal">Journal</Label>
              <Input
                id="journal"
                placeholder="Enter journal name"
                value={metadata.journal || ''}
                onChange={(e) => setMetadata({ ...metadata, journal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf"
              />
            </div>
          </>
        )
      case 'blog':
        return (
          <div className="space-y-2">
            <Label htmlFor="content">Blog Content</Label>
            <ReactQuill
              id="content"
              value={metadata.content || ''}
              onChange={(value) => setMetadata({ ...metadata, content: value })}
              placeholder="Write your blog content here..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              className="h-64" // Adjust height as needed
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8 p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold">Create New Resource</h1>
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Resource Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter resource title"
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={newResource.type}
              onValueChange={(value) => {
                setNewResource({ ...newResource, type: value, description: '' })
                setMetadata({})
                setFile(null)
              }}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="paper">Paper</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderDynamicField()}
          <Button
            onClick={handleAddResource}
            className="w-full"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}