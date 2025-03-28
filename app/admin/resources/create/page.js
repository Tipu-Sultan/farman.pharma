// app/admin/resources/create/page.js
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateResourcePage() {
  const [newResource, setNewResource] = useState({
    title: '',
    type: '',
    link: '',
    category: '',
  })
  const router = useRouter()

  const handleAddResource = async () => {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResource),
    })
    if (res.ok) {
      setNewResource({ title: '', type: '', link: '', category: '' })
      router.push('/admin/resources')
    } else {
      const errorData = await res.json()
      alert(`Error: ${errorData.error}`)
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
            <Input
              id="type"
              placeholder="e.g., Book, Video, Paper"
              value={newResource.type}
              onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              placeholder="Enter resource URL"
              value={newResource.link}
              onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., books, videos, papers"
              value={newResource.category}
              onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
            />
          </div>
          <Button onClick={handleAddResource} className="w-full">
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}