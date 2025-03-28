import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

export async function PATCH(request, { params }) {
  await dbConnect()

  // Check session and admin status
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body = await request.json()
  const isSuperadmin = session.user.adminRole === 'superadmin'

  // Restrict updates based on role
  const updateFields = {
    updatedAt: new Date(),
  }

  // Normal admins can only update isAdmin and permissions
  if (body.isAdmin !== undefined) {
    updateFields.isAdmin = body.isAdmin
  }
  if (Array.isArray(body.permissions)) {
    updateFields.permissions = body.permissions
  }

  // Only superadmins can update adminRole, and normal admins are restricted to 'moderator' or 'content-manager'
  if (body.adminRole !== undefined) {
    const allowedRolesForNormalAdmin = ['moderator', 'content-manager', null]
    if (isSuperadmin) {
      // Superadmin can set any role (superadmin, moderator, content-manager, null)
      updateFields.adminRole = body.adminRole
    } else if (allowedRolesForNormalAdmin.includes(body.adminRole)) {
      // Normal admin can only set moderator, content-manager, or null
      updateFields.adminRole = body.adminRole
    } else {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Only superadmin can set this adminRole' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }

  const user = await User.findByIdAndUpdate(
    params.id,
    updateFields,
    { new: true, runValidators: true }
  ).lean()

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const serializedUser = {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLogin: user.lastLogin?.toISOString() || null,
  }

  return new Response(JSON.stringify(serializedUser), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function DELETE(request, { params }) {
  await dbConnect()

  // Check session and admin status
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.isAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Only superadmin can delete users
  if (session.user.adminRole !== 'superadmin') {
    return new Response(JSON.stringify({ error: 'Forbidden: Only superadmin can delete users' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const user = await User.findByIdAndDelete(params.id)
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(null, {
    status: 204,
  })
}