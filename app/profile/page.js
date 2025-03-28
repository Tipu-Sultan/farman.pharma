import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Note from '@/models/Note'
import Resource from '@/models/Resource'
import ProfileClient from './ProfileClient'

async function getProfileData() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')

  await dbConnect()

  // Fetch user data
  const user = await User.findOne({ googleId: session.user.googleId }).lean()
  if (!user) throw new Error('User not found')

  // Fetch counts of notes and resources uploaded by this user
  const notesCount = await Note.countDocuments({ ownerId: user._id })
  const resourcesCount = await Resource.countDocuments({ ownerId: user._id })

  return {
    user: {
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      adminRole: user.adminRole,
      permissions: user.permissions,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
    stats: {
      notesCount,
      resourcesCount,
    },
  }
}

export default async function ProfilePage() {
  let profileData
  try {
    profileData = await getProfileData()
  } catch (error) {
    return <div className="text-center py-20">Error: {error.message}</div>
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        <ProfileClient profileData={profileData}/>
      </div>
    </section>
  )
}