import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Check if admin already exists
    const existingAdmin = await db.collection("admins").findOne({
      email: "admin@alloyrim.com"
    })

    if (existingAdmin) {
      return NextResponse.json({ 
        success: true, 
        message: "Admin user already exists!",
        email: "admin@alloyrim.com",
        password: "admin123"
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)
    
    const admin = await db.collection("admins").insertOne({
      name: "Super Admin",
      email: "admin@alloyrim.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({ 
      success: true, 
      message: "Admin user created successfully!",
      email: "admin@alloyrim.com",
      password: "admin123",
      id: admin.insertedId
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create admin user" },
      { status: 500 }
    )
  }
}
