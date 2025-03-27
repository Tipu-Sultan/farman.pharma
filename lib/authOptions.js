// lib/authOptions.js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect()

      let existingUser = await User.findOne({ googleId: account.providerAccountId })

      if (!existingUser) {
        existingUser = new User({
          googleId: account.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image,
          lastLogin: new Date(), // Set on first login
        })
        await existingUser.save()
      } else {
        existingUser.name = user.name
        existingUser.image = user.image
        existingUser.lastLogin = new Date() // Update last login
        await existingUser.save()
      }

      return true
    },
    async session({ session, token }) {
      await dbConnect()
      const user = await User.findOne({ googleId: token.sub })
      if (user) {
        session.user.id = user._id.toString()
        session.user.googleId = user.googleId
        session.user.isAdmin = user.isAdmin // Add admin status to session
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.googleId
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
}

export default NextAuth(authOptions)