import { NextResponse } from "next/server"
import clientPromise from "../../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const record = await db.collection("supply_records").findOne({ _id: new ObjectId(params.id) })
    if (!record) return NextResponse.json({ success: false, error: "Supply record not found" }, { status: 404 })
    
    const item = await db.collection("items").findOne({ _id: record.itemId })
    return NextResponse.json({ success: true, supplyRecord: { ...record, id: record._id, itemCode: item?.itemCode } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch supply record" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const body = await request.json()

    await db.collection("supply_records").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { date: new Date(body.date), quantity: parseInt(body.quantity), destination: body.destination, vehicleNumber: body.vehicleNumber, driverName: body.driverName, status: body.status, notes: body.notes, updatedAt: new Date() }}
    )
    return NextResponse.json({ success: true, message: "Supply record updated successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update supply record" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    await db.collection("supply_records").deleteOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({ success: true, message: "Supply record deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete supply record" }, { status: 500 })
  }
}

