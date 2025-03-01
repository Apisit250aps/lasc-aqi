import NextAuth, { User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { users } from './models'
import argon2 from 'argon2'

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        name: { label: 'name', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { name, password } = credentials as {
            name: string
            password: string
          }
          if (!name || !password) {
            return null
          }
          // Check if user exists
          const user = await users.findOne({ name })
          if (!user) {
            return null
          }
          // Check if password is correct
          const valid = await argon2.verify(user.password as string, password)
          if (!valid) {
            return null
          }
          await users.updateOne(
            { _id: user._id },
            { $set: { lastLogin: new Date() } }
          )
          return {
            id: user._id.toString(),
            name: user.name,
            role: user.role
          } as User
        } catch (error) {
          console.error(error)
          return null
        }
      }
    })
  ]
})