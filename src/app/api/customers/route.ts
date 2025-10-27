import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET - Fetch all customers
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const customers = await db.collection("customers").find({}).toArray()
    
    return NextResponse.json({ 
      success: true, 
      customers: customers.map(customer => ({
        id: customer._id,
        name: customer.name,
        phone: customer.phone,
        shopName: customer.shopName,
        address: customer.address,
        accountNumber: customer.accountNumber,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      }))
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}

// POST - Create new customer
export async function POST(request: Request) {
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

    // Check if account number already exists
    const existingCustomer = await db.collection("customers").findOne({
      accountNumber: accountNumber
    })

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: "Account number already exists" },
        { status: 400 }
      )
    }

    // Create customer
    const customer = {
      name,
      phone,
      shopName: shopName || "",
      address: address || "",
      accountNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("customers").insertOne(customer)

    return NextResponse.json({ 
      success: true, 
      message: "Customer created successfully",
      customer: {
        id: result.insertedId,
        ...customer
      }
    })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create customer" },
      { status: 500 }
    )
  }
}

