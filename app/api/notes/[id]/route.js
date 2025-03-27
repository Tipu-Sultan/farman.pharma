import authOptions from "@/lib/authOptions"
import dbConnect from "@/lib/dbConnect"
import Note from "@/models/Note"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
    await dbConnect()
    await Note.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  }