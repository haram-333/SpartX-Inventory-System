import { NextResponse } from "next/server"
import clientPromise from "../../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single raw material transaction
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const rawMaterial = await db.collection("raw_materials").findOne({
      _id: new ObjectId(params.id)
    })

    if (!rawMaterial) {
      return NextResponse.json(
        { success: false, error: "Raw material transaction not found" },
        { status: 404 }
      )
    }

    // Get agent details
    const agent = await db.collection("agents").findOne({
      _id: rawMaterial.agentId
    })

    return NextResponse.json({ 
      success: true, 
      rawMaterial: {
        id: rawMaterial._id,
        agentId: rawMaterial.agentId,
        agentName: agent?.name || 'Unknown',
        date: rawMaterial.date,
        materialType: rawMaterial.materialType,
        quantity: rawMaterial.quantity,
        unit: rawMaterial.unit,
        rate: rawMaterial.rate,
        totalBill: rawMaterial.totalBill,
        amountPaid: rawMaterial.amountPaid,
        remainingAmount: rawMaterial.remainingAmount,
        paymentStatus: rawMaterial.paymentStatus,
        notes: rawMaterial.notes,
        createdAt: rawMaterial.createdAt,
        updatedAt: rawMaterial.updatedAt
      }
    })
  } catch (error) {
    console.error("Error fetching raw material:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch raw material transaction" },
      { status: 500 }
    )
  }
}

// PUT - Update raw material transaction
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { 
      date,
      materialType,
      quantity,
      unit,
      rate,
      amountPaid,
      notes
    } = body

    // Validate required fields
    if (!date || !materialType || !quantity || !rate) {
      return NextResponse.json(
        { success: false, error: "Date, material type, quantity, and rate are required" },
        { status: 400 }
      )
    }

    // Check if raw material exists
    const existingMaterial = await db.collection("raw_materials").findOne({
      _id: new ObjectId(params.id)
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { success: false, error: "Raw material transaction not found" },
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

    // Prepare update data
    const updateData = {
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
      updatedAt: new Date()
    }

    await db.collection("raw_materials").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Raw material transaction updated successfully"
    })
  } catch (error) {
    console.error("Error updating raw material:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update raw material transaction" },
      { status: 500 }
    )
  }
}

// DELETE - Delete raw material transaction
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const result = await db.collection("raw_materials").deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Raw material transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Raw material transaction deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting raw material:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete raw material transaction" },
      { status: 500 }
    )
  }
}

