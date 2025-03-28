// app/admin/users/page.js
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UserItem from './UserItem'

// Fetch users (Server Component)
async function getUsers() {
  await dbConnect()
  const users = await User.find().lean()
  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLogin: user.lastLogin?.toISOString() || null,
  }))
}

// Server Component (default export)
export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-8 p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold">Manage Users</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Users List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {users.length === 0 ? (
            <p className="text-center">No users available.</p>
          ) : (
            <div className="grid gap-6">
              {users.map((user) => (
                <UserItem key={user._id} user={user} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}