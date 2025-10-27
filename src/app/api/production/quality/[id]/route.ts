import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const record = await db.collection("quality_inspections").findOne({ _id: new ObjectId(params.id) })
    if (!record) return NextResponse.json({ success: false, error: "Quality inspection not found" }, { status: 404 })
    
    const item = await db.collection("items").findOne({ _id: record.itemId })
    return NextResponse.json({ 
      success: true, 
      qualityInspection: { ...record, id: record._id, itemCode: item?.itemCode }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch quality inspection" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const body = await request.json()

    await db.collection("quality_inspections").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { 
        date: new Date(body.date),
        inspectorName: body.inspectorName,
        totalQuantity: parseInt(body.totalQuantity),
        passedQuantity: parseInt(body.passedQuantity),
        failedQuantity: parseInt(body.failedQuantity),
        status: body.status,
        remarks: body.remarks,
        updatedAt: new Date()
      }}
    )
    return NextResponse.json({ success: true, message: "Quality inspection updated successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update quality inspection" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    await db.collection("quality_inspections").deleteOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({ success: true, message: "Quality inspection deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete quality inspection" }, { status: 500 })
  }
}

