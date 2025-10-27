import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Insert test data
    const result = await db.collection("test_connections").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      timestamp: Date.now()
    })
    
    return NextResponse.json({ 
      success: true, 
      message: "Data inserted successfully!",
      id: result.insertedId
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to connect to database" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Test connection by getting all test data
    const data = await db.collection("test_connections").find({}).toArray()
    
    return NextResponse.json({ 
      success: true, 
      message: "Connection successful!",
      data: data
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to connect to database" },
      { status: 500 }
    )
  }
}
