// app/admin/resources/page.js
import dbConnect from '@/lib/dbConnect'
import Resource from '@/models/Resource'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import ResourcesClient from './ResourcesClient'

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
      <ResourcesClient initialResources={resources} isSuperadmin={isSuperadmin} />
    </div>
  )
}