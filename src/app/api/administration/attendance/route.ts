import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"

// GET - Fetch attendance records
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Build query filter
    const filter: any = {}
    
    if (employeeId) {
      filter.employeeId = employeeId
    }
    
    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      filter.date = {
        $gte: searchDate,
        $lt: nextDay
      }
    } else if (startDate || endDate) {
      filter.date = {}
      if (startDate) {
        filter.date.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate)
      }
    }
    
    const attendance = await db.collection("attendance_records")
      .find(filter)
      .sort({ date: -1, checkIn: -1 })
      .toArray()
    
    // Populate employee details
    const attendanceWithEmployees = await Promise.all(
      attendance.map(async (record) => {
        const employee = await db.collection("employees").findOne({
          _id: record.employeeId
        })
        
        return {
          id: record._id,
          employeeId: record.employeeId,
          employeeName: employee?.name || 'Unknown',
          employeeCode: employee?.employeeCode || 'N/A',
          department: employee?.department || 'N/A',
          date: record.date,
          checkIn: record.checkIn,
          checkOut: record.checkOut,
          status: record.status,
          notes: record.notes,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt
        }
      })
    )
    
    return NextResponse.json({ 
      success: true, 
      attendance: attendanceWithEmployees
    })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance records" },
      { status: 500 }
    )
  }
}

// POST - Create new attendance record
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { 
      employeeId,
      date,
      checkIn,
      checkOut,
      status,
      notes
    } = body

    // Validate required fields
    if (!employeeId || !date || !checkIn || !status) {
      return NextResponse.json(
        { success: false, error: "Employee, date, check-in time, and status are required" },
        { status: 400 }
      )
    }

    // Check if employee exists
    const { ObjectId } = await import('mongodb')
    const employee = await db.collection("employees").findOne({
      _id: new ObjectId(employeeId)
    })

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      )
    }

    // Check if attendance already exists for this date
    const existingAttendance = await db.collection("attendance_records").findOne({
      employeeId: new ObjectId(employeeId),
      date: new Date(date)
    })

    if (existingAttendance) {
      return NextResponse.json(
        { success: false, error: "Attendance record already exists for this date" },
        { status: 400 }
      )
    }

    // Create attendance record
    const attendance = {
      employeeId: new ObjectId(employeeId),
      date: new Date(date),
      checkIn: checkIn,
      checkOut: checkOut || null,
      status,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("attendance_records").insertOne(attendance)

    return NextResponse.json({ 
      success: true, 
      message: "Attendance record created successfully",
      attendance: {
        id: result.insertedId,
        ...attendance
      }
    })
  } catch (error) {
    console.error("Error creating attendance:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create attendance record" },
      { status: 500 }
    )
  }
}

