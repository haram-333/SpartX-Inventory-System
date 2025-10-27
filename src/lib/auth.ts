import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import clientPromise from "./mongodb"
import bcrypt from "bcryptjs"
import { getAllEmployeeCollections } from "./user-collections"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: "your-super-secret-key-here-make-it-long-and-random-123456789",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db("SpartX-Inventory-System")
          
          // Check all employee collections for the user
          const collections = getAllEmployeeCollections()
          let user = null
          
          for (const collectionName of collections) {
            user = await db.collection(collectionName).findOne({
              email: credentials.email as string
            })
            
            if (user) {
              break
            }
          }

          if (!user || !user.isActive) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  debug: true
})
