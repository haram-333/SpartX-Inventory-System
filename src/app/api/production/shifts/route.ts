import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"

export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    const filter: any = {}
    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)
      filter.date = { $gte: searchDate, $lt: nextDay }
    }
    
    const schedules = await db.collection("shift_schedules").find(filter).sort({ date: -1 }).toArray()
    
    return NextResponse.json({ 
      success: true, 
      shiftSchedules: schedules.map(s => ({
        id: s._id,
        date: s.date,
        shift: s.shift,
        supervisorName: s.supervisorName,
        totalWorkers: s.totalWorkers,
        notes: s.notes,
        createdAt: s.createdAt
      }))
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch shift schedules" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    const body = await request.json()

    const schedule = {
      date: new Date(body.date),
      shift: body.shift,
      supervisorName: body.supervisorName || '',
      totalWorkers: parseInt(body.totalWorkers || 0),
      notes: body.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("shift_schedules").insertOne(schedule)
    return NextResponse.json({ success: true, message: "Shift schedule created successfully", schedule: { id: result.insertedId, ...schedule } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create shift schedule" }, { status: 500 })
  }
}

