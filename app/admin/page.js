'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Plus, Upload } from 'lucide-react'

export default function AdminDashboard() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Chemistry Notes', subject: 'Chemistry', date: '2024-03-15' },
    { id: 2, title: 'Pharmacology Notes', subject: 'Pharmacology', date: '2024-03-14' }
  ])

  const [resources, setResources] = useState([
    { id: 1, title: 'Textbook PDF', type: 'Book', uploadDate: '2024-03-15' },
    { id: 2, title: 'Lecture Video', type: 'Video', uploadDate: '2024-03-14' }
  ])

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="notes">Manage Notes</TabsTrigger>
            <TabsTrigger value="resources">Manage Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Study Notes</span>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Note
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-medium">{note.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {note.subject} • {note.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Learning Resources</span>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="font-medium">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {resource.type} • {resource.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}