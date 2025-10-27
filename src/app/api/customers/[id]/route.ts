import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single customer
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const customer = await db.collection("customers").findOne({
      _id: new ObjectId(params.id)
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      customer: {
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        shopName: customer.shopName,
        address: customer.address,
        accountNumber: customer.accountNumber,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      }
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer" },
      { status: 500 }
    )
  }
}

// PUT - Update customer
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { name, phone, shopName, address, accountNumber } = body

    // Validate required fields
    if (!name || !phone || !accountNumber) {
      return NextResponse.json(
        { success: false, error: "Name, phone, and account number are required" },
        { status: 400 }
      )
    }

    // Check if customer exists
    const existingCustomer = await db.collection("customers").findOne({
      _id: new ObjectId(params.id)
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      )
    }

    // Check if account number is taken by another customer
    const duplicateAccount = await db.collection("customers").findOne({
      accountNumber: accountNumber,
      _id: { $ne: new ObjectId(params.id) }
    })

    if (duplicateAccount) {
      return NextResponse.json(
        { success: false, error: "Account number already exists" },
        { status: 400 }
      )
    }

    // Update customer
    const updateData = {
      name,
      phone,
      shopName: shopName || "",
      address: address || "",
      accountNumber,
      updatedAt: new Date()
    }

    await db.collection("customers").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Customer updated successfully"
    })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update customer" },
      { status: 500 }
    )
  }
}

// DELETE - Delete customer
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const result = await db.collection("customers").deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Customer deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete customer" },
      { status: 500 }
    )
  }
}

