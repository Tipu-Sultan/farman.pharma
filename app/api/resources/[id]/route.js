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
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
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

  const body = await request.json()
  const resource = await Resource.findByIdAndUpdate(
    params.id,
    { ...body, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean()

  if (!resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }

  const serializedResource = {
    ...resource,
    _id: resource._id.toString(),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
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