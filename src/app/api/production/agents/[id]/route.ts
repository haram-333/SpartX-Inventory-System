import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single agent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const agent = await db.collection("agents").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      agent: {
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        address: agent.address,
        isActive: agent.isActive,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt
      }
    })
  } catch (error) {
    console.error("Error fetching agent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent" },
      { status: 500 }
    )
  }
}

// PUT - Update agent
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { name, phone, email, address, isActive } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required" },
        { status: 400 }
      )
    }

    // Check if agent exists
    const existingAgent = await db.collection("agents").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (!existingAgent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    // Check if phone is taken by another agent
    const duplicatePhone = await db.collection("agents").findOne({
      phone: phone,
      _id: { $ne: new ObjectId(resolvedParams.id) }
    })

    if (duplicatePhone) {
      return NextResponse.json(
        { success: false, error: "Phone number already exists" },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData = {
      name,
      phone,
      email: email || '',
      address: address || '',
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    }

    await db.collection("agents").updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Agent updated successfully"
    })
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update agent" },
      { status: 500 }
    )
  }
}

// DELETE - Delete agent
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Check if agent has any raw material transactions
    const hasTransactions = await db.collection("raw_materials").findOne({
      agentId: new ObjectId(resolvedParams.id)
    })

    if (hasTransactions) {
      return NextResponse.json(
        { success: false, error: "Cannot delete agent with existing transactions" },
        { status: 400 }
      )
    }

    const result = await db.collection("agents").deleteOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Agent deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete agent" },
      { status: 500 }
    )
  }
}

