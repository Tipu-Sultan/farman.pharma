import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const { title, subject, content } = await req.json()
  const note = await Note.create({ title, subject, content, ownerId: session.user._id })
  return NextResponse.json(note, { status: 201 })
}