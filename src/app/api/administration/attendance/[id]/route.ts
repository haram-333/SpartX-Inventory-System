import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single attendance record
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const attendance = await db.collection("attendance_records").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (!attendance) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      )
    }

    // Get employee details
    const employee = await db.collection("employees").findOne({
      _id: attendance.employeeId
    })

    return NextResponse.json({ 
      success: true, 
      attendance: {
        id: attendance._id,
        employeeId: attendance.employeeId,
        employeeName: employee?.name || 'Unknown',
        employeeCode: employee?.employeeCode || 'N/A',
        date: attendance.date,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status,
        notes: attendance.notes,
        createdAt: attendance.createdAt,
        updatedAt: attendance.updatedAt
      }
    })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance record" },
      { status: 500 }
    )
  }
}

// PUT - Update attendance record
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { 
      checkIn,
      checkOut,
      status,
      notes
    } = body

    // Validate required fields
    if (!checkIn || !status) {
      return NextResponse.json(
        { success: false, error: "Check-in time and status are required" },
        { status: 400 }
      )
    }

    // Check if attendance exists
    const existingAttendance = await db.collection("attendance_records").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (!existingAttendance) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {
      checkIn,
      checkOut: checkOut || null,
      status,
      notes: notes || '',
      updatedAt: new Date()
    }

    await db.collection("attendance_records").updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Attendance record updated successfully"
    })
  } catch (error) {
    console.error("Error updating attendance:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update attendance record" },
      { status: 500 }
    )
  }
}

// DELETE - Delete attendance record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const result = await db.collection("attendance_records").deleteOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Attendance record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Attendance record deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting attendance:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete attendance record" },
      { status: 500 }
    )
  }
}

