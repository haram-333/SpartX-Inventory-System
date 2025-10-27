import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Find admin
    const admin = await db.collection("admins").findOne({
      email: email
    })

    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        error: "Admin not found",
        email: email
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password)

    return NextResponse.json({ 
      success: true, 
      message: "Login test successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive
      },
      passwordValid: isPasswordValid
    })
  } catch (error) {
    console.error("Login test error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error
      },
      { status: 500 }
    )
  }
}
