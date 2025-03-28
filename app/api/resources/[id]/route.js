// app/api/resources/[id]/route.js
import dbConnect from '@/lib/dbConnect'
import Resource from '@/models/Resource'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

export async function GET(request, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const resource = await Resource.findById(params.id).lean()
  if (!resource) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const serializedResource = {
    ...resource,
    _id: resource._id.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  }

  return new Response(JSON.stringify(serializedResource), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function PUT(request, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || session.user.adminRole !== 'superadmin') {
    return new Response(JSON.stringify({ error: 'Forbidden: Only superadmin can edit resources' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json()
  const resource = await Resource.findByIdAndUpdate(
    params.id,
    { ...body, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean()

  if (!resource) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const serializedResource = {
    ...resource,
    _id: resource._id.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  }

  return new Response(JSON.stringify(serializedResource), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function DELETE(request, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || session.user.adminRole !== 'superadmin') {
    return new Response(JSON.stringify({ error: 'Forbidden: Only superadmin can delete resources' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const resource = await Resource.findByIdAndDelete(params.id)
  if (!resource) {
    return new Response(JSON.stringify({ error: 'Resource not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(null, {
    status: 204,
  })
}