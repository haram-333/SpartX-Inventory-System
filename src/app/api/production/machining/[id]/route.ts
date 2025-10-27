import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single machining record
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const record = await db.collection("machining_records").findOne({
      _id: new ObjectId(params.id)
    })

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Machining record not found" },
        { status: 404 }
      )
    }

    const item = await db.collection("items").findOne({
      _id: record.itemId
    })

    return NextResponse.json({ 
      success: true, 
      machiningRecord: {
        id: record._id,
        itemId: record.itemId,
        itemCode: item?.itemCode || 'N/A',
        itemDesign: item?.design || 'Unknown',
        date: record.date,
        shift: record.shift,
        cncMachineNumber: record.cncMachineNumber,
        quantity: record.quantity,
        status: record.status,
        operatorName: record.operatorName,
        notes: record.notes,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      }
    })
  } catch (error) {
    console.error("Error fetching machining record:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch machining record" },
      { status: 500 }
    )
  }
}

// PUT - Update machining record
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
      shift,
      cncMachineNumber,
      quantity,
      status,
      operatorName,
      notes
    } = body

    if (!date || !shift || !cncMachineNumber || !quantity) {
      return NextResponse.json(
        { success: false, error: "Date, shift, CNC machine, and quantity are required" },
        { status: 400 }
      )
    }

    const existingRecord = await db.collection("machining_records").findOne({
      _id: new ObjectId(params.id)
    })

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, error: "Machining record not found" },
        { status: 404 }
      )
    }

    const updateData = {
      date: new Date(date),
      shift,
      cncMachineNumber,
      quantity: parseInt(quantity),
      status: status || 'in_progress',
      operatorName: operatorName || '',
      notes: notes || '',
      updatedAt: new Date()
    }

    await db.collection("machining_records").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Machining record updated successfully"
    })
  } catch (error) {
    console.error("Error updating machining record:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update machining record" },
      { status: 500 }
    )
  }
}

// DELETE - Delete machining record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const result = await db.collection("machining_records").deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Machining record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Machining record deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting machining record:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete machining record" },
      { status: 500 }
    )
  }
}

