// app/api/resources/[id]/route.js
import dbConnect from '@/lib/dbConnect'
import Resource from '@/models/Resource'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resource = await Resource.findById(params.id).lean()
  if (!resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }

  const serializedResource = {
    ...resource,
    _id: resource._id.toString(),
    ownerId: resource.ownerId?.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
    metadata: resource.metadata instanceof Map ? Object.fromEntries(resource.metadata) : resource.metadata,
  }

  return NextResponse.json(serializedResource, { status: 200 })
}

export async function PUT(request, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || session.user.adminRole !== 'superadmin') {
    return NextResponse.json(
      { error: 'Forbidden: Only superadmin can edit resources' },
      { status: 403 }
    )
  }

  const formData = await request.formData()
  const title = formData.get('title')
  const type = formData.get('type')
  const link = formData.get('link')
  const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata')) : undefined // Optional update

  if (!title || !type || !link) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const resource = await Resource.findByIdAndUpdate(
    params.id,
    {
      title,
      type,
      link,
      ...(metadata && { metadata }), // Only update metadata if provided
    },
    { new: true, runValidators: true, timestamps: true } // Ensure timestamps update
  ).lean()

  if (!resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }

  const serializedResource = {
    ...resource,
    _id: resource._id.toString(),
    ownerId: resource.ownerId?.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
    metadata: resource.metadata instanceof Map ? Object.fromEntries(resource.metadata) : resource.metadata,
  }

  return NextResponse.json(serializedResource, { status: 200 })
}

export async function DELETE(request, { params }) {
  await dbConnect()
  const session = await getServerSession(authOptions)
  if (!session || session.user.adminRole !== 'superadmin') {
    return NextResponse.json(
      { error: 'Forbidden: Only superadmin can delete resources' },
      { status: 403 }
    )
  }

  const resource = await Resource.findByIdAndDelete(params.id)
  if (!resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }

  return NextResponse.json(
    { message: 'Resource deleted successfully' },
    { status: 200 }
  )
}