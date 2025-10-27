import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const schedule = await db.collection("shift_schedules").findOne({ _id: new ObjectId(resolvedParams.id) })
    if (!schedule) return NextResponse.json({ success: false, error: "Shift schedule not found" }, { status: 404 })
    return NextResponse.json({ success: true, shiftSchedule: { ...schedule, id: schedule._id } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch shift schedule" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const body = await request.json()

    await db.collection("shift_schedules").updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      { $set: { date: new Date(body.date), shift: body.shift, supervisorName: body.supervisorName, totalWorkers: parseInt(body.totalWorkers), notes: body.notes, updatedAt: new Date() }}
    )
    return NextResponse.json({ success: true, message: "Shift schedule updated successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update shift schedule" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    await db.collection("shift_schedules").deleteOne({ _id: new ObjectId(resolvedParams.id) })
    return NextResponse.json({ success: true, message: "Shift schedule deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete shift schedule" }, { status: 500 })
  }
}

