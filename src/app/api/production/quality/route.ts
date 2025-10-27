import { NextResponse } from "next/server"
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const records = await db.collection("quality_inspections")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray()
    
    const recordsWithItems = await Promise.all(
      records.map(async (record) => {
        const item = await db.collection("items").findOne({ _id: record.itemId })
        
        return {
          id: record._id,
          itemId: record.itemId,
          itemCode: item?.itemCode || 'N/A',
          itemDesign: item?.design || 'Unknown',
          date: record.date,
          inspectorName: record.inspectorName,
          totalQuantity: record.totalQuantity,
          passedQuantity: record.passedQuantity,
          failedQuantity: record.failedQuantity,
          status: record.status,
          remarks: record.remarks,
          createdAt: record.createdAt
        }
      })
    )
    
    return NextResponse.json({ success: true, qualityInspections: recordsWithItems })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch quality inspections" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const body = await request.json()

    if (!body.itemId || !body.date || !body.totalQuantity) {
      return NextResponse.json({ success: false, error: "Item, date, and total quantity are required" }, { status: 400 })
    }

    const record = {
      itemId: new ObjectId(body.itemId),
      date: new Date(body.date),
      inspectorName: body.inspectorName || '',
      totalQuantity: parseInt(body.totalQuantity),
      passedQuantity: parseInt(body.passedQuantity || 0),
      failedQuantity: parseInt(body.failedQuantity || 0),
      status: body.status || 'pending',
      remarks: body.remarks || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("quality_inspections").insertOne(record)
    return NextResponse.json({ success: true, message: "Quality inspection created successfully", record: { id: result.insertedId, ...record } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create quality inspection" }, { status: 500 })
  }
}

