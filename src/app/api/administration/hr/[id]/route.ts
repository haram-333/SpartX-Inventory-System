import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single employee
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const employee = await db.collection("employees").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (!employee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      employee: {
        id: employee._id,
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        salary: employee.salary,
        status: employee.status,
        address: employee.address,
        emergencyContact: employee.emergencyContact,
        documents: employee.documents,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt
      }
    })
  } catch (error) {
    console.error("Error fetching employee:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch employee" },
      { status: 500 }
    )
  }
}

// PUT - Update employee
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const body = await request.json()
    const { 
      name,
      email,
      phone,
      department,
      designation,
      joiningDate,
      salary,
      status,
      address,
      emergencyContact,
      documents
    } = body

    // Validate required fields
    if (!name || !phone || !department || !designation || !joiningDate) {
      return NextResponse.json(
        { success: false, error: "Name, phone, department, designation, and joining date are required" },
        { status: 400 }
      )
    }

    // Check if employee exists
    const existingEmployee = await db.collection("employees").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {
      name,
      email: email || '',
      phone,
      department,
      designation,
      joiningDate: new Date(joiningDate),
      salary: salary ? parseFloat(salary) : 0,
      status: status || 'active',
      address: address || '',
      emergencyContact: emergencyContact || '',
      documents: documents || [],
      updatedAt: new Date()
    }

    await db.collection("employees").updateOne(
      { _id: new ObjectId(resolvedParams.id) },
      { $set: updateData }
    )

    return NextResponse.json({ 
      success: true, 
      message: "Employee updated successfully"
    })
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update employee" },
      { status: 500 }
    )
  }
}

// DELETE - Delete employee
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const result = await db.collection("employees").deleteOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Employee not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Employee deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete employee" },
      { status: 500 }
    )
  }
}

