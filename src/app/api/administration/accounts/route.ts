import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// GET - Fetch all account transactions
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'in', 'out', or null for all
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Build query filter
    const filter: Record<string, unknown> = {}
    
    if (type) {
      filter.type = type
    }
    
    if (startDate || endDate) {
      filter.date = {}
      if (startDate) {
        filter.date.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate)
      }
    }
    
    const transactions = await db.collection("account_transactions")
      .find(filter)
      .sort({ date: -1, createdAt: -1 })
      .toArray()
    
    // Calculate totals
    const balanceIn = transactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const balanceOut = transactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const netBalance = balanceIn - balanceOut
    
    return NextResponse.json({ 
      success: true, 
      transactions: transactions.map(t => ({
        id: t._id,
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description,
        date: t.date,
        paymentMethod: t.paymentMethod,
        reference: t.reference,
        createdBy: t.createdBy,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      })),
      summary: {
        balanceIn,
        balanceOut,
        netBalance
      }
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

// POST - Create new transaction
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { 
      type, 
      amount, 
      category, 
      description, 
      date, 
      paymentMethod, 
      reference,
      createdBy 
    } = body

    // Validate required fields
    if (!type || !amount || !category || !date) {
      return NextResponse.json(
        { success: false, error: "Type, amount, category, and date are required" },
        { status: 400 }
      )
    }

    // Validate type
    if (!['in', 'out'].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Type must be 'in' or 'out'" },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 }
      )
    }

    // Create transaction
    const transaction = {
      type,
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: new Date(date),
      paymentMethod: paymentMethod || 'cash',
      reference: reference || '',
      createdBy: createdBy || 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("account_transactions").insertOne(transaction)

    return NextResponse.json({ 
      success: true, 
      message: "Transaction created successfully",
      transaction: {
        id: result.insertedId,
        ...transaction
      }
    })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create transaction" },
      { status: 500 }
    )
  }
}

