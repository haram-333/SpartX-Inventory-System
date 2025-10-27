import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { getAllEmployeeCollections } from "@/lib/user-collections"

// GET - Fetch all users from all employee collections
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Fetch users from all employee collections
    const collections = getAllEmployeeCollections()
    const allUsers: Array<Record<string, unknown>> = []
    
    for (const collectionName of collections) {
      const users = await db.collection(collectionName).find({}).toArray()
      allUsers.push(...users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        collection: collectionName // For reference
      })))
    }
    
    return NextResponse.json({ 
      success: true, 
      users: allUsers
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// POST - Create new user in appropriate collection based on role
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Name, email, password, and role are required" },
        { status: 400 }
      )
    }

    // Determine which collection to use based on role
    const { getCollectionByRole } = await import("../../../../lib/user-collections")
    const collectionName = getCollectionByRole(role)

    // Check if email already exists in ANY employee collection
    const collections = getAllEmployeeCollections()
    for (const collection of collections) {
      const existingUser = await db.collection(collection).findOne({
        email: email
      })
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email already exists" },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = {
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection(collectionName).insertOne(user)

    return NextResponse.json({ 
      success: true, 
      message: `User created successfully in ${collectionName}`,
      user: {
        id: result.insertedId,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        collection: collectionName
      }
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    )
  }
}
