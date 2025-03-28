'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EditResourcePage() {
  const [editResource, setEditResource] = useState(null)
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchResource = async () => {
      const res = await fetch(`/api/resources/${id}`)
      if (res.ok) {
        const resource = await res.json()
        setEditResource(resource)
      }
    }
    fetchResource()
  }, [id])

  const handleEditResource = async () => {
    const res = await fetch(`/api/resources/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editResource),
    })
    if (res.ok) {
      router.push('/admin/resources')
    } else {
      const errorData = await res.json()
      alert(`Error: ${errorData.error}`)
    }
  }

  if (!editResource) return <div className="text-center p-6">Loading...</div>

  return (
    <div className="space-y-8 p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold">Edit Resource</h1>
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Resource Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editResource.title}
              onChange={(e) => setEditResource({ ...editResource, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={editResource.type}
              onChange={(e) => setEditResource({ ...editResource, type: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={editResource.link}
              onChange={(e) => setEditResource({ ...editResource, link: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={editResource.category}
              onChange={(e) => setEditResource({ ...editResource, category: e.target.value })}
            />
          </div>
          <Button onClick={handleEditResource} className="w-full">
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}