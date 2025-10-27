import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"

// GET - Fetch all employees
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    
    // Build query filter
    const filter: any = {}
    
    if (department) {
      filter.department = department
    }
    
    if (status) {
      filter.status = status
    }
    
    const employees = await db.collection("employees")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ 
      success: true, 
      employees: employees.map(emp => ({
        id: emp._id,
        employeeCode: emp.employeeCode,
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        department: emp.department,
        designation: emp.designation,
        joiningDate: emp.joiningDate,
        salary: emp.salary,
        status: emp.status,
        address: emp.address,
        emergencyContact: emp.emergencyContact,
        documents: emp.documents,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt
      }))
    })
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch employees" },
      { status: 500 }
    )
  }
}

// POST - Create new employee
export async function POST(request: Request) {
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

    // Generate employee code
    const lastEmployee = await db.collection("employees")
      .find({})
      .sort({ employeeCode: -1 })
      .limit(1)
      .toArray()
    
    let employeeCode = 'EMP-0001'
    if (lastEmployee.length > 0) {
      const lastCode = lastEmployee[0].employeeCode
      const lastNumber = parseInt(lastCode.split('-')[1])
      employeeCode = `EMP-${String(lastNumber + 1).padStart(4, '0')}`
    }

    // Check if employee code already exists (shouldn't happen but just in case)
    const existingEmployee = await db.collection("employees").findOne({
      employeeCode: employeeCode
    })

    if (existingEmployee) {
      return NextResponse.json(
        { success: false, error: "Employee code already exists" },
        { status: 400 }
      )
    }

    // Create employee
    const employee = {
      employeeCode,
      name,
      email: email || '',
      phone,
      department,
      designation,
      joiningDate: new Date(joiningDate),
      salary: salary ? parseFloat(salary) : 0,
      status: 'active',
      address: address || '',
      emergencyContact: emergencyContact || '',
      documents: documents || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection("employees").insertOne(employee)

    return NextResponse.json({ 
      success: true, 
      message: "Employee created successfully",
      employee: {
        id: result.insertedId,
        ...employee
      }
    })
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create employee" },
      { status: 500 }
    )
  }
}

