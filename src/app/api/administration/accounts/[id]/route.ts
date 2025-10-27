import { NextResponse } from "next/server"
import clientPromise from "../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single transaction
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const transaction = await db.collection("account_transactions").findOne({
      _id: new ObjectId(params.id)
    })

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        paymentMethod: transaction.paymentMethod,
        reference: transaction.reference,
        createdBy: transaction.createdBy,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      }
    })
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch transaction" },
      { status: 500 }
    )
  }
}

// PUT - Update transaction
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      reference 
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

    // Check if transaction exists
    const existingTransaction = await db.collection("account_transactions").findOne({
      _id: new ObjectId(params.id)
    })

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {
      type,
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: new Date(date),
      paymentMethod: paymentMethod || 'cash',
      reference: reference || '',
      updatedAt: new Date()
    }

    await db.collection("account_transactions").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Transaction updated successfully"
    })
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update transaction" },
      { status: 500 }
    )
  }
}

// DELETE - Delete transaction
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const result = await db.collection("account_transactions").deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Transaction deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete transaction" },
      { status: 500 }
    )
  }
}

