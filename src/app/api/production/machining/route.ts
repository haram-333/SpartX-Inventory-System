import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all machining records
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const { searchParams } = new URL(request.url)
    const shift = searchParams.get('shift')
    const date = searchParams.get('date')
    
    const filter: any = {}
    
    if (shift) {
      filter.shift = shift
    }
    
    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      filter.date = {
        $gte: searchDate,
        $lt: nextDay
      }
    }
    
    const records = await db.collection("machining_records")
      .find(filter)
      .sort({ date: -1, createdAt: -1 })
      .toArray()
    
    // Populate item details
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
    )
    
    return NextResponse.json({ 
      success: true, 
      machiningRecords: recordsWithItems
    })
  } catch (error) {
    console.error("Error fetching machining records:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch machining records" },
      { status: 500 }
    )
  }
}

// POST - Create new machining record
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { 
      itemId,
      date,
      shift,
      cncMachineNumber,
      quantity,
      status,
      operatorName,
      notes
    } = body

    // Validate required fields
    if (!itemId || !date || !shift || !cncMachineNumber || !quantity) {
      return NextResponse.json(
        { success: false, error: "Item, date, shift, CNC machine, and quantity are required" },
        { status: 400 }
      )
    }

    // Check if item exists
    const item = await db.collection("items").findOne({
      _id: new ObjectId(itemId)
    })

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    // Create machining record
    const record = {
      itemId: new ObjectId(itemId),
      date: new Date(date),
      shift,
      cncMachineNumber,
      quantity: parseInt(quantity),
      status: status || 'in_progress',
      operatorName: operatorName || '',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("machining_records").insertOne(record)

    return NextResponse.json({ 
      success: true, 
      message: "Machining record created successfully",
      record: {
        id: result.insertedId,
        ...record
      }
    })
  } catch (error) {
    console.error("Error creating machining record:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create machining record" },
      { status: 500 }
    )
  }
}

