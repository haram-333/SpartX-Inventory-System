import { NextResponse } from "next/server"
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all paint records
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const records = await db.collection("paint_records")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray()
    
    const recordsWithItems = await Promise.all(
      records.map(async (record) => {
        const item = await db.collection("items").findOne({
          _id: record.itemId
        })
        
        return {
          id: record._id,
          itemId: record.itemId,
          itemCode: item?.itemCode || 'N/A',
          itemDesign: item?.design || 'Unknown',
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
    )
    
    return NextResponse.json({ 
      success: true, 
      paintRecords: recordsWithItems
    })
  } catch (error) {
    console.error("Error fetching paint records:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch paint records" },
      { status: 500 }
    )
  }
}

// POST - Create new paint record
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { 
      itemId,
      date,
      color,
      paintType,
      quantity,
      status,
      notes
    } = body

    if (!itemId || !date || !color || !quantity) {
      return NextResponse.json(
        { success: false, error: "Item, date, color, and quantity are required" },
        { status: 400 }
      )
    }

    const item = await db.collection("items").findOne({
      _id: new ObjectId(itemId)
    })

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    const record = {
      itemId: new ObjectId(itemId),
      date: new Date(date),
      color,
      paintType: paintType || 'standard',
      quantity: parseInt(quantity),
      status: status || 'in_progress',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("paint_records").insertOne(record)

    return NextResponse.json({ 
      success: true, 
      message: "Paint record created successfully",
      record: {
        id: result.insertedId,
        ...record
      }
    })
  } catch (error) {
    console.error("Error creating paint record:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create paint record" },
      { status: 500 }
    )
  }
}

