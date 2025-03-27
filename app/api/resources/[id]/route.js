import authOptions from "@/lib/authOptions"
import dbConnect from "@/lib/dbConnect"
import Resource from "@/models/Resource"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
    await dbConnect()
    await Resource.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  }