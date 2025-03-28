// app/admin/resources/page.js
import dbConnect from '@/lib/dbConnect'
import Resource from '@/models/Resource'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Trash2, Edit, Plus } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

async function getResources() {
  await dbConnect()
  const resources = await Resource.find().lean()
  return resources.map((resource) => ({
    ...resource,
    _id: resource._id.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  }))
}

export default async function ResourcesPage() {
  const resources = await getResources()
  const session = await getServerSession(authOptions)
  const isSuperadmin = session?.user?.adminRole === 'superadmin'

  return (
    <div className="space-y-8 p-6 min-h-screen">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl font-extrabold">Manage Resources</h1>
        {isSuperadmin && (
          <Link href="/admin/resources/create">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              Add Resource
            </Button>
          </Link>
        )}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Resources List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {resources.length === 0 ? (
            <p className="text-center">No resources available.</p>
          ) : (
            <div className="grid gap-6 overflow-x-hidden">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full overflow-hidden"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                    <Upload className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium truncate">{resource.title}</h3>
                      <p className="text-sm truncate">{resource.link.substring(0, 50)}...</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Badge variant="secondary">{resource.category}</Badge>
                      </div>
                    </div>
                  </div>
                  {isSuperadmin && (
                    <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                      <Link href={`/admin/resources/edit/${resource._id}`}>
                        <Button variant="outline" size="sm" className="hover:bg-gray-100">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={`/api/resources/${resource._id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <Button
                          variant="destructive"
                          size="sm"
                          type="submit"
                          className="hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}