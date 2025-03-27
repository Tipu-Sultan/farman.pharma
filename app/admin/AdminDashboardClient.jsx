'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { FileText, Plus, Upload, User, Trash2, Edit, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboardClient({ initialData }) {
  const [notes, setNotes] = useState(initialData.notes)
  const [resources, setResources] = useState(initialData.resources)
  const [users, setUsers] = useState(initialData.users)
  const [newNote, setNewNote] = useState({ title: '', subject: '', content: '' })
  const [newResource, setNewResource] = useState({ title: '', type: '', link: '', category: '' })
  const [editUser, setEditUser] = useState(null)

  // Add Note
  const handleAddNote = async () => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote),
    })
    if (res.ok) {
      const note = await res.json()
      setNotes([...notes, note])
      setNewNote({ title: '', subject: '', content: '' })
    }
  }

  // Add Resource
  const handleAddResource = async () => {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResource),
    })
    if (res.ok) {
      const resource = await res.json()
      setResources([...resources, resource])
      setNewResource({ title: '', type: '', link: '', category: '' })
    }
  }

  // Delete Item
  const handleDelete = async (type, id) => {
    const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' })
    if (res.ok) {
      if (type === 'notes') setNotes(notes.filter((n) => n._id !== id))
      if (type === 'resources') setResources(resources.filter((r) => r._id !== id))
      if (type === 'users') setUsers(users.filter((u) => u._id !== id))
    }
  }

  // Update User Permissions
  const handleUpdateUser = async () => {
    const res = await fetch(`/api/users/${editUser._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions: editUser.permissions, isAdmin: editUser.isAdmin }),
    })
    if (res.ok) {
      const updatedUser = await res.json()
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)))
      setEditUser(null)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="notes">Manage Notes</TabsTrigger>
          <TabsTrigger value="resources">Manage Resources</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Study Notes
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Note</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={newNote.title}
                          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Input
                          value={newNote.subject}
                          onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Content</Label>
                        <Input
                          value={newNote.content}
                          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddNote}>Submit</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">{note.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {note.subject} • {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('notes', note._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Learning Resources
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resource
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload New Resource</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={newResource.title}
                          onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Input
                          value={newResource.type}
                          onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                          placeholder="Book, Video, Paper"
                        />
                      </div>
                      <div>
                        <Label>Link</Label>
                        <Input
                          value={newResource.link}
                          onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={newResource.category}
                          onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                          placeholder="books, videos, papers"
                        />
                      </div>
                      <Button onClick={handleAddResource}>Submit</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div
                    key={resource._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {resource.type} • {new Date(resource.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('resources', resource._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <User className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.isAdmin && (
                          <Badge variant="secondary" className="mt-1">
                            {user.adminRole || 'Admin'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User: {editUser?.name}</DialogTitle>
                          </DialogHeader>
                          {editUser && (
                            <div className="space-y-4">
                              <div>
                                <Label>Admin Status</Label>
                                <Input
                                  type="checkbox"
                                  checked={editUser.isAdmin}
                                  onChange={(e) =>
                                    setEditUser({ ...editUser, isAdmin: e.target.checked })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Permissions (comma-separated)</Label>
                                <Input
                                  value={editUser.permissions.join(', ')}
                                  onChange={(e) =>
                                    setEditUser({
                                      ...editUser,
                                      permissions: e.target.value.split(', ').filter(Boolean),
                                    })
                                  }
                                />
                              </div>
                              <Button onClick={handleUpdateUser}>Save</Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('users', user._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}