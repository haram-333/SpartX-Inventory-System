import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all raw material transactions
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    
    // Build query filter
    const filter: any = {}
    
    if (agentId) {
      filter.agentId = new ObjectId(agentId)
    }
    
    const rawMaterials = await db.collection("raw_materials")
      .find(filter)
      .sort({ date: -1, createdAt: -1 })
      .toArray()
    
    // Populate agent details
    const materialsWithAgents = await Promise.all(
      rawMaterials.map(async (material) => {
        const agent = await db.collection("agents").findOne({
          _id: material.agentId
        })
        
        return {
          id: material._id,
          agentId: material.agentId,
          agentName: agent?.name || 'Unknown',
          agentPhone: agent?.phone || 'N/A',
          date: material.date,
          materialType: material.materialType,
          quantity: material.quantity,
          unit: material.unit,
          rate: material.rate,
          totalBill: material.totalBill,
          amountPaid: material.amountPaid,
          remainingAmount: material.remainingAmount,
          paymentStatus: material.paymentStatus,
          notes: material.notes,
          createdAt: material.createdAt,
          updatedAt: material.updatedAt
        }
      })
    )
    
    return NextResponse.json({ 
      success: true, 
      rawMaterials: materialsWithAgents
    })
  } catch (error) {
    console.error("Error fetching raw materials:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch raw materials" },
      { status: 500 }
    )
  }
}

// POST - Create new raw material transaction
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { 
      agentId,
      date,
      materialType,
      quantity,
      unit,
      rate,
      amountPaid,
      notes
    } = body

    // Validate required fields
    if (!agentId || !date || !materialType || !quantity || !rate) {
      return NextResponse.json(
        { success: false, error: "Agent, date, material type, quantity, and rate are required" },
        { status: 400 }
      )
    }

    // Check if agent exists
    const agent = await db.collection("agents").findOne({
      _id: new ObjectId(agentId)
    })

    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    // Calculate totals
    const totalBill = parseFloat(quantity) * parseFloat(rate)
    const paidAmount = amountPaid ? parseFloat(amountPaid) : 0
    const remainingAmount = totalBill - paidAmount

    // Determine payment status
    let paymentStatus = 'pending'
    if (paidAmount >= totalBill) {
      paymentStatus = 'paid'
    } else if (paidAmount > 0) {
      paymentStatus = 'partial'
    }

    // Create raw material transaction
    const rawMaterial = {
      agentId: new ObjectId(agentId),
      date: new Date(date),
      materialType,
      quantity: parseFloat(quantity),
      unit: unit || 'kg',
      rate: parseFloat(rate),
      totalBill,
      amountPaid: paidAmount,
      remainingAmount,
      paymentStatus,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("raw_materials").insertOne(rawMaterial)

    return NextResponse.json({ 
      success: true, 
      message: "Raw material transaction created successfully",
      rawMaterial: {
        id: result.insertedId,
        ...rawMaterial
      }
    })
  } catch (error) {
    console.error("Error creating raw material:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create raw material transaction" },
      { status: 500 }
    )
  }
}

