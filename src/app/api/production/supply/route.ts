import { NextResponse } from "next/server"
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const records = await db.collection("supply_records").find({}).sort({ date: -1 }).toArray()
    
    const recordsWithItems = await Promise.all(
      records.map(async (record) => {
        const item = await db.collection("items").findOne({ _id: record.itemId })
        return {
          id: record._id,
          itemId: record.itemId,
          itemCode: item?.itemCode || 'N/A',
          itemDesign: item?.design || 'Unknown',
          date: record.date,
          quantity: record.quantity,
          destination: record.destination,
          vehicleNumber: record.vehicleNumber,
          driverName: record.driverName,
          status: record.status,
          notes: record.notes,
          createdAt: record.createdAt
        }
      })
    )
    
    return NextResponse.json({ success: true, supplyRecords: recordsWithItems })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch supply records" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const body = await request.json()

    const record = {
      itemId: new ObjectId(body.itemId),
      date: new Date(body.date),
      quantity: parseInt(body.quantity),
      destination: body.destination,
      vehicleNumber: body.vehicleNumber || '',
      driverName: body.driverName || '',
      status: body.status || 'dispatched',
      notes: body.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("supply_records").insertOne(record)
    return NextResponse.json({ success: true, message: "Supply record created successfully", record: { id: result.insertedId, ...record } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create supply record" }, { status: 500 })
  }
}

