import { NextResponse } from "next/server"
import clientPromise from "../../../../../lib/mongodb"

// GET - Fetch all agents
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const agents = await db.collection("agents")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ 
      success: true, 
      agents: agents.map(agent => ({
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        address: agent.address,
        isActive: agent.isActive,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt
      }))
    })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch agents" },
      { status: 500 }
    )
  }
}

// POST - Create new agent
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { name, phone, email, address } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required" },
        { status: 400 }
      )
    }

    // Check if agent with same phone already exists
    const existingAgent = await db.collection("agents").findOne({
      phone: phone
    })

    if (existingAgent) {
      return NextResponse.json(
        { success: false, error: "Agent with this phone number already exists" },
        { status: 400 }
      )
    }

    // Create agent
    const agent = {
      name,
      phone,
      email: email || '',
      address: address || '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("agents").insertOne(agent)

    return NextResponse.json({ 
      success: true, 
      message: "Agent created successfully",
      agent: {
        id: result.insertedId,
        ...agent
      }
    })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create agent" },
      { status: 500 }
    )
  }
}

