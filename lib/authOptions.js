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
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect()

      let existingUser = await User.findOne({ googleId: account.providerAccountId })

      if (!existingUser) {
        existingUser = await User.create({
          googleId: account.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image,
          lastLogin: new Date(),
        })
      } else {
        existingUser.name = user.name
        existingUser.email = user.email
        existingUser.image = user.image
        existingUser.lastLogin = new Date()
        await existingUser.save()
      }

      return true
    },
    async jwt({ token, account, trigger, session }) {
      // Initial sign-in: populate token with all user fields
      if (account?.provider === 'google') {
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
      }

      // Update token if session is updated from client
      if (trigger === 'update' && session?.user) {
        token.isAdmin = session.user.isAdmin
        token.adminRole = session.user.adminRole
        token.permissions = session.user.permissions
      }

      return token
    },
    async session({ session, token }) {
      // Always populate session.user with all fields from token
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
      return session
    },
  },
  debug: true,
}

export default NextAuth(authOptions)