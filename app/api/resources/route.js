import authOptions from "@/lib/authOptions"
import dbConnect from "@/lib/dbConnect"
import Resource from "@/models/Resource"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(req) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
    await dbConnect()
    const { title, type, link, category } = await req.json()
    const resource = await Resource.create({ title, type, link, category, ownerId: session.user._id })
    return NextResponse.json(resource, { status: 201 })
  }