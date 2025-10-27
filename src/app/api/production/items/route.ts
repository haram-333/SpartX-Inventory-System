import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"

// GET - Fetch all items
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const items = await db.collection("items")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ 
      success: true, 
      items: items.map(item => ({
        id: item._id,
        itemCode: item.itemCode,
        marketCode: item.marketCode,
        design: item.design,
        description: item.description,
        size: item.size,
        specifications: item.specifications,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    })
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    )
  }
}

// POST - Create new item
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { itemCode, marketCode, design, description, size, specifications } = body

    // Validate required fields
    if (!itemCode || !design) {
      return NextResponse.json(
        { success: false, error: "Item code and design are required" },
        { status: 400 }
      )
    }

    // Check if item code already exists
    const existingItem = await db.collection("items").findOne({
      itemCode: itemCode
    })

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: "Item code already exists" },
        { status: 400 }
      )
    }

    // Check if market code already exists (if provided)
    if (marketCode) {
      const existingMarketCode = await db.collection("items").findOne({
        marketCode: marketCode
      })

      if (existingMarketCode) {
        return NextResponse.json(
          { success: false, error: "Market code already exists" },
          { status: 400 }
        )
      }
    }

    // Create item
    const item = {
      itemCode,
      marketCode: marketCode || '',
      design,
      description: description || '',
      size: size || '',
      specifications: specifications || '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("items").insertOne(item)

    return NextResponse.json({ 
      success: true, 
      message: "Item created successfully",
      item: {
        id: result.insertedId,
        ...item
      }
    })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    )
  }
}

