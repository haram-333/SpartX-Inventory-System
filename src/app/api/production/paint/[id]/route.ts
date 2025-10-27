import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const record = await db.collection("paint_records").findOne({
      _id: new ObjectId(params.id)
    })

    if (!record) {
      return NextResponse.json({ success: false, error: "Paint record not found" }, { status: 404 })
    }

    const item = await db.collection("items").findOne({ _id: record.itemId })

    return NextResponse.json({ 
      success: true, 
      paintRecord: {
        id: record._id,
        itemId: record.itemId,
        itemCode: item?.itemCode || 'N/A',
        date: record.date,
        color: record.color,
        paintType: record.paintType,
        quantity: record.quantity,
        status: record.status,
        notes: record.notes,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch paint record" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const body = await request.json()

    const updateData = {
      date: new Date(body.date),
      color: body.color,
      paintType: body.paintType || 'standard',
      quantity: parseInt(body.quantity),
      status: body.status || 'in_progress',
      notes: body.notes || '',
      updatedAt: new Date()
    }

    await db.collection("paint_records").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    return NextResponse.json({ success: true, message: "Paint record updated successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update paint record" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const result = await db.collection("paint_records").deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Paint record not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Paint record deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete paint record" }, { status: 500 })
  }
}

