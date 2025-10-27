import { NextResponse } from "next/server"
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const item = await db.collection("items").findOne({
      _id: new ObjectId(params.id)
    })

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      item: {
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
      }
    })
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch item" },
      { status: 500 }
    )
  }
}

// PUT - Update item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { itemCode, marketCode, design, description, size, specifications, isActive } = body

    // Validate required fields
    if (!itemCode || !design) {
      return NextResponse.json(
        { success: false, error: "Item code and design are required" },
        { status: 400 }
      )
    }

    // Check if item exists
    const existingItem = await db.collection("items").findOne({
      _id: new ObjectId(params.id)
    })

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    // Check if item code is taken by another item
    const duplicateItemCode = await db.collection("items").findOne({
      itemCode: itemCode,
      _id: { $ne: new ObjectId(params.id) }
    })

    if (duplicateItemCode) {
      return NextResponse.json(
        { success: false, error: "Item code already exists" },
        { status: 400 }
      )
    }

    // Check if market code is taken by another item (if provided)
    if (marketCode) {
      const duplicateMarketCode = await db.collection("items").findOne({
        marketCode: marketCode,
        _id: { $ne: new ObjectId(params.id) }
      })

      if (duplicateMarketCode) {
        return NextResponse.json(
          { success: false, error: "Market code already exists" },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData = {
      itemCode,
      marketCode: marketCode || '',
      design,
      description: description || '',
      size: size || '',
      specifications: specifications || '',
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date()
    }

    await db.collection("items").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Item updated successfully"
    })
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update item" },
      { status: 500 }
    )
  }
}

// DELETE - Delete item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Check if item is used in any production records
    const hasRecords = await db.collection("machining_records").findOne({
      itemId: new ObjectId(params.id)
    })

    if (hasRecords) {
      return NextResponse.json(
        { success: false, error: "Cannot delete item with existing production records" },
        { status: 400 }
      )
    }

    const result = await db.collection("items").deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Item deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete item" },
      { status: 500 }
    )
  }
}

