// app/admin/page.js
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, User, Upload } from 'lucide-react'
import dbConnect from '@/lib/dbConnect'
import Note from '@/models/Note'
import Resource from '@/models/Resource'
import UserModel from '@/models/User'
import Link from 'next/link'

async function getDashboardStats() {
  await dbConnect()
  const [noteCount, resourceCount, userCount] = await Promise.all([
    Note.countDocuments(),
    Resource.countDocuments(),
    UserModel.countDocuments(),
  ])
  return { noteCount, resourceCount, userCount }
}

export default async function AdminDashboard() {
  const { noteCount, resourceCount, userCount } = await getDashboardStats()

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notes</CardTitle>
            <FileText className="h-5 w-5" />
          </CardHeader>
          <Link href="/admin/notes">
            <CardContent className="cursor-pointer">
              <p className="text-4xl font-bold">{noteCount}</p>
              <p className="text-sm">Total Study Notes</p>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resources</CardTitle>
            <Upload className="h-5 w-5" />
          </CardHeader>
          <Link href="/admin/resources">
            <CardContent className="cursor-pointer">
              <p className="text-4xl font-bold">{resourceCount}</p>
              <p className="text-sm">Total Resources</p>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Users</CardTitle>
            <User className="h-5 w-5" />
          </CardHeader>
          <Link href="/admin/users">
            <CardContent className="cursor-pointer">
              <p className="text-4xl font-bold">{userCount}</p>
              <p className="text-sm">Total Users</p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}