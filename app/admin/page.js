import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Note from '@/models/Note'
import Resource from '@/models/Resource'
import AdminDashboardClient from './AdminDashboardClient'

// Helper function to convert ObjectId and dates to strings
function serializeData(data) {
  return data.map((item) => ({
    ...item,
    _id: item._id.toString(), // Convert ObjectId to string
    ownerId: item.ownerId?.toString(), // Convert ownerId to string (if exists)
    createdAt: item.createdAt.toISOString(), // Convert Date to ISO string
    updatedAt: item.updatedAt.toISOString(), // Convert Date to ISO string
    lastLogin: item.lastLogin?.toISOString(), // Convert Date to ISO string (if exists)
  }))
}

async function getAdminData() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user.isAdmin) throw new Error('Unauthorized')

  await dbConnect()

  const [notes, resources, users] = await Promise.all([
    Note.find().lean(),
    Resource.find().lean(),
    User.find().lean(),
  ])

  return {
    notes: serializeData(notes),
    resources: serializeData(resources),
    users: serializeData(users),
  }
}

export default async function AdminPage() {
  let adminData
  try {
    adminData = await getAdminData()
  } catch (error) {
    return <div className="text-center py-20">Error: {error.message}</div>
  }

  return (
    <section className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <AdminDashboardClient initialData={adminData} />
      </div>
    </section>
  )
}