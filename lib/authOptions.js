// lib/authOptions.js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export const authOptions = {
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Required for JWT encryption
  pages: {
    signIn: '/login', // Custom sign-in page
  },
  callbacks: {
    // Handle sign-in and user creation/update
    async signIn({ user, account }) {
      await dbConnect()

      let existingUser = await User.findOne({ googleId: account.providerAccountId })

      if (!existingUser) {
        // Create new user if they don’t exist
        existingUser = await User.create({
          googleId: account.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image,
          lastLogin: new Date(),
          // Admin fields use schema defaults: isAdmin: false, adminRole: null, permissions: []
        })
      } else {
        // Update existing user details
        existingUser.name = user.name
        existingUser.email = user.email
        existingUser.image = user.image
        existingUser.lastLogin = new Date()
        await existingUser.save()
      }

      return true // Allow sign-in
    },
    // Customize the JWT token
    async jwt({ token, account, trigger, session }) {
      // Initial sign-in
      if (account?.provider === 'google') {
        try {
          await dbConnect()
          const dbUser = await User.findOne({ googleId: account.providerAccountId })

          if (dbUser) {
            token.id = dbUser._id.toString()
            token.googleId = dbUser.googleId
            token.name = dbUser.name
            token.email = dbUser.email
            token.image = dbUser.image
            token.isAdmin = dbUser.isAdmin
            token.adminRole = dbUser.adminRole
            token.permissions = dbUser.permissions
          }
        } catch (error) {
          console.error('JWT callback error:', error)
        }
      }

      // Update token from client (e.g., if admin status changes)
      if (trigger === 'update' && session?.user) {
        token.isAdmin = session.user.isAdmin
        token.adminRole = session.user.adminRole
        token.permissions = session.user.permissions
      }

      return token
    },
    // Customize the session object
    async session({ session, token }) {
      // Populate session.user with all fields from the token
      if (token.id) {
        session.user = {
          id: token.id,
          googleId: token.googleId,
          name: token.name,
          email: token.email,
          image: token.image,
          isAdmin: token.isAdmin,
          adminRole: token.adminRole,
          permissions: token.permissions,
        }
      }
      return session
    },
  },
  debug: true, // Enable debug logs for troubleshooting
}

export default NextAuth(authOptions)