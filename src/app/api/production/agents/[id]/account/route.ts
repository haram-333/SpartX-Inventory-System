import { NextResponse } from "next/server"
import clientPromise from "../../../../../../lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch agent account summary
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    // Get agent details
    const agent = await db.collection("agents").findOne({
      _id: new ObjectId(params.id)
    })

    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      )
    }

    // Get all transactions for this agent
    const transactions = await db.collection("raw_materials")
      .find({ agentId: new ObjectId(params.id) })
      .sort({ date: -1 })
      .toArray()

    // Calculate summary
    const totalBill = transactions.reduce((sum, t) => sum + (t.totalBill || 0), 0)
    const totalPaid = transactions.reduce((sum, t) => sum + (t.amountPaid || 0), 0)
    const totalRemaining = totalBill - totalPaid

    return NextResponse.json({ 
      success: true, 
      agent: {
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        address: agent.address,
        isActive: agent.isActive
      },
      summary: {
        totalTransactions: transactions.length,
        totalBill,
        totalPaid,
        totalRemaining
      },
      transactions: transactions.map(t => ({
        id: t._id,
        date: t.date,
        materialType: t.materialType,
        quantity: t.quantity,
        unit: t.unit,
        rate: t.rate,
        totalBill: t.totalBill,
        amountPaid: t.amountPaid,
        remainingAmount: t.remainingAmount,
        paymentStatus: t.paymentStatus,
        notes: t.notes
      }))
    })
  } catch (error) {
    console.error("Error fetching agent account:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent account" },
      { status: 500 }
    )
  }
}

