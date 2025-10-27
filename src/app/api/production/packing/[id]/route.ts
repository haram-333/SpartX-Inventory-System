import { NextResponse } from "next/server"
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const record = await db.collection("packing_records").findOne({ _id: new ObjectId(params.id) })
    if (!record) return NextResponse.json({ success: false, error: "Packing record not found" }, { status: 404 })
    
    const item = await db.collection("items").findOne({ _id: record.itemId })
    return NextResponse.json({ success: true, packingRecord: { ...record, id: record._id, itemCode: item?.itemCode } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch packing record" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const body = await request.json()

    await db.collection("packing_records").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { date: new Date(body.date), quantity: parseInt(body.quantity), packingType: body.packingType, boxesCount: parseInt(body.boxesCount), status: body.status, notes: body.notes, updatedAt: new Date() }}
    )
    return NextResponse.json({ success: true, message: "Packing record updated successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update packing record" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    await db.collection("packing_records").deleteOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({ success: true, message: "Packing record deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete packing record" }, { status: 500 })
  }
}

