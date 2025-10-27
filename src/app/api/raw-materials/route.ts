import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

// GET - Fetch all raw materials
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const rawMaterials = await db.collection("inventory_raw_materials").find({}).toArray()
    
    return NextResponse.json({ 
      success: true, 
      rawMaterials: rawMaterials.map(material => ({
        id: material._id,
        name: material.name,
        type: material.type,
        supplier: material.supplier,
        currentStock: material.currentStock,
        unit: material.unit,
        minStock: material.minStock,
        maxStock: material.maxStock,
        location: material.location,
        lastUpdated: material.lastUpdated,
        createdAt: material.createdAt
      }))
    })
  } catch (error) {
    console.error("Error fetching raw materials:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch raw materials" },
      { status: 500 }
    )
  }
}

// POST - Create new raw material
export async function POST(request: Request) {
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

    // Create raw material
    const rawMaterial = {
      name,
      type,
      supplier: supplier || "",
      currentStock: currentStock || 0,
      unit,
      minStock: minStock || 0,
      maxStock: maxStock || 1000,
      location: location || "",
      lastUpdated: new Date(),
      createdAt: new Date()
    }

    const result = await db.collection("inventory_raw_materials").insertOne(rawMaterial)

    return NextResponse.json({ 
      success: true, 
      message: "Raw material created successfully",
      rawMaterial: {
        id: result.insertedId,
        ...rawMaterial
      }
    })
  } catch (error) {
    console.error("Error creating raw material:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create raw material" },
      { status: 500 }
    )
  }
}
