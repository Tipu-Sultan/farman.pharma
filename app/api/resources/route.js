// app/api/resources/route.js
import dbConnect from '@/lib/dbConnect'
import Resource from '@/models/Resource'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

export async function GET() {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const resources = await Resource.find().lean()
  const serializedResources = resources.map((resource) => ({
    ...resource,
    _id: resource._id.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  }))

  return new Response(JSON.stringify(serializedResources), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(request) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || session.user.adminRole !== 'superadmin') {
    return new Response(JSON.stringify({ error: 'Forbidden: Only superadmin can create resources' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json()
  const resource = await Resource.create(body)
  const serializedResource = {
    ...resource.toObject(),
    _id: resource._id.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  }

  return new Response(JSON.stringify(serializedResource), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}