import authOptions from "@/lib/authOptions"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions)
    console.log(session)
    if (!session || !session.user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
    await dbConnect()
    const { permissions, isAdmin } = await req.json()
    const user = await User.findByIdAndUpdate(
      params.id,
      { permissions, isAdmin, updatedAt: Date.now() },
      { new: true }
    ).lean()
    return NextResponse.json(user, { status: 200 })
  }
  
  export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
    await dbConnect()
    await User.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  }