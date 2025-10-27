import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single raw material
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const rawMaterial = await db.collection("inventory_raw_materials").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (!rawMaterial) {
      return NextResponse.json(
        { success: false, error: "Raw material not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      rawMaterial: {
        id: rawMaterial._id,
        name: rawMaterial.name,
        type: rawMaterial.type,
        supplier: rawMaterial.supplier,
        currentStock: rawMaterial.currentStock,
        unit: rawMaterial.unit,
        minStock: rawMaterial.minStock,
        maxStock: rawMaterial.maxStock,
        location: rawMaterial.location,
        lastUpdated: rawMaterial.lastUpdated,
        createdAt: rawMaterial.createdAt
      }
    })
  } catch (error) {
    console.error("Error fetching raw material:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch raw material" },
      { status: 500 }
    )
  }
}

// PUT - Update raw material
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { name, type, supplier, currentStock, unit, minStock, maxStock, location } = body

    // Validate required fields
    if (!name || !type || !unit) {
      return NextResponse.json(
        { success: false, error: "Name, type, and unit are required" },
        { status: 400 }
      )
    }

    // Check if raw material exists
    const existingMaterial = await db.collection("inventory_raw_materials").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (!existingMaterial) {
      return NextResponse.json(
        { success: false, error: "Raw material not found" },
        { status: 404 }
      )
    }

    // Update raw material
    const updateData = {
      name,
      type,
      supplier: supplier || "",
      currentStock: currentStock || 0,
      unit,
      minStock: minStock || 0,
      maxStock: maxStock || 1000,
      location: location || "",
      lastUpdated: new Date()
    }

    await db.collection("inventory_raw_materials").updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Raw material updated successfully"
    })
  } catch (error) {
    console.error("Error updating raw material:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update raw material" },
      { status: 500 }
    )
  }
}

// DELETE - Delete raw material
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const result = await db.collection("inventory_raw_materials").deleteOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Raw material not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Raw material deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting raw material:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete raw material" },
      { status: 500 }
    )
  }
}
