import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import { getAllEmployeeCollections, getCollectionByRole } from "@/lib/user-collections"

// GET - Fetch single user from any collection
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Search in all employee collections
    const collections = getAllEmployeeCollections()
    let user = null
    let foundCollection = null
    
    for (const collectionName of collections) {
      user = await db.collection(collectionName).findOne({
        _id: new ObjectId(params.id)
      })
      
      if (user) {
        foundCollection = collectionName
        break
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        collection: foundCollection
      }
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// PUT - Update user (handles role changes by moving to correct collection)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { name, email, password, role, isActive } = body

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: "Name, email, and role are required" },
        { status: 400 }
      )
    }

    // Find existing user in any collection
    const collections = getAllEmployeeCollections()
    let existingUser = null
    let oldCollection = null
    
    for (const collectionName of collections) {
      existingUser = await db.collection(collectionName).findOne({
        _id: new ObjectId(params.id)
      })
      
      if (existingUser) {
        oldCollection = collectionName
        break
      }
    }

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Check if email is taken by another user in ANY collection
    for (const collectionName of collections) {
      const duplicateEmail = await db.collection(collectionName).findOne({
        email: email,
        _id: { $ne: new ObjectId(params.id) }
      })
      
      if (duplicateEmail) {
        return NextResponse.json(
          { success: false, error: "Email already exists" },
          { status: 400 }
        )
      }
    }

    // Determine new collection based on role
    const newCollection = getCollectionByRole(role)

    // Prepare update data
    const updateData: Record<string, unknown> = {
      name,
      email,
      role,
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    }

    // Hash password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 12)
    } else {
      // Keep existing password
      updateData.password = existingUser.password
    }

    // If role changed, move user to new collection
    if (oldCollection !== newCollection) {
      // Add to new collection
      const userData = {
        ...existingUser,
        ...updateData,
        _id: new ObjectId(params.id) // Keep the same ID
      }
      
      await db.collection(newCollection).insertOne(userData)
      
      // Remove from old collection
      await db.collection(oldCollection).deleteOne({
        _id: new ObjectId(params.id)
      })

      return NextResponse.json({ 
        success: true, 
        message: `User updated and moved from ${oldCollection} to ${newCollection}`
      })
    } else {
      // Same role, just update in current collection
      await db.collection(oldCollection).updateOne(
        { _id: new ObjectId(params.id) },
        { $set: updateData }
      )

      return NextResponse.json({ 
        success: true, 
        message: "User updated successfully"
      })
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// DELETE - Delete user from any collection
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Search in all employee collections
    const collections = getAllEmployeeCollections()
    let deleted = false
    
    for (const collectionName of collections) {
      const result = await db.collection(collectionName).deleteOne({
        _id: new ObjectId(params.id)
      })
      
      if (result.deletedCount > 0) {
        deleted = true
        break
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "User deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    )
  }
}
