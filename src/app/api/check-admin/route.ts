import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Check if admin exists
    const admin = await db.collection("admins").findOne({
      email: "admin@alloyrim.com"
    })

    if (admin) {
      return NextResponse.json({ 
        success: true, 
        message: "Admin user exists",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive
        }
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Admin user not found",
        admin: null
      })
    }
  } catch (error) {
    console.error("Check admin error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check admin" },
      { status: 500 }
    )
  }
}
