import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    console.log("🔍 Setting up database collections...")
    
    // List of employee collections to preserve
    const employeeCollections = [
      'admins',
      'production_employees',
      'warehouse_employees', 
      'sales_employees',
      'accounts_employees'
    ]
    
    // Clear existing collections (skip system collections and employee collections)
    const collections = await db.listCollections().toArray()
    for (const collection of collections) {
      if (!collection.name.startsWith('system.') && !employeeCollections.includes(collection.name)) {
        try {
          await db.collection(collection.name).drop()
          console.log(`✅ Dropped collection: ${collection.name}`)
        } catch (error) {
          console.log(`⚠️ Could not drop collection: ${collection.name}`)
        }
      }
    }
    
    // ===========================================
    // PRODUCTION LINE MODULE (8 collections)
    // ===========================================
    
    // 1. Raw Material
    await db.createCollection('agents')
    await db.createCollection('raw_materials')
    
    // 2. Items
    await db.createCollection('items')
    
    // 3. Machining
    await db.createCollection('machining_records')
    
    // 4. Paint
    await db.createCollection('paint_records')
    
    // 5. Quality
    await db.createCollection('quality_inspections')
    
    // 6. Packing
    await db.createCollection('packing_records')
    
    // 7. Supply
    await db.createCollection('supply_records')
    
    // 8. Shift (day/night)
    await db.createCollection('shift_schedules')
    
    // ===========================================
    // ADMINISTRATION MODULE (Employee Collections + Other)
    // ===========================================
    
    // 1. Employee Collections (by role)
    await db.createCollection('admins')
    await db.createCollection('production_employees')
    await db.createCollection('warehouse_employees')
    await db.createCollection('sales_employees')
    await db.createCollection('accounts_employees')
    
    // 2. Account (balance in, balance out, all records)
    await db.createCollection('account_transactions')
    
    // 3. HR
    await db.createCollection('employees')
    
    // 4. Attendance
    await db.createCollection('attendance_records')
    
    // ===========================================
    // INVENTORY MODULE (4 collections)
    // ===========================================
    
    // 1. Raw Materials
    await db.createCollection('inventory_raw_materials')
    
    // 2. Total Stores
    await db.createCollection('stores')
    await db.createCollection('store_sections')
    await db.createCollection('stock_movements')
    
    // ===========================================
    // CUSTOMER MODULE (4 collections)
    // ===========================================
    
    // 1. Name, Phone, Shop Name, Address, Account Number
    await db.createCollection('customers')
    
    // 2. Billing (PDF receipts)
    await db.createCollection('receipts')
    await db.createCollection('receipt_items')
    await db.createCollection('payments')
    
    console.log("✅ Created all collections")
    
    // Create basic indexes for better performance
    await db.collection('admins').createIndex({ email: 1 }, { unique: true })
    await db.collection('production_employees').createIndex({ email: 1 }, { unique: true })
    await db.collection('warehouse_employees').createIndex({ email: 1 }, { unique: true })
    await db.collection('sales_employees').createIndex({ email: 1 }, { unique: true })
    await db.collection('accounts_employees').createIndex({ email: 1 }, { unique: true })
    await db.collection('customers').createIndex({ accountNumber: 1 }, { unique: true })
    await db.collection('items').createIndex({ itemCode: 1 }, { unique: true })
    await db.collection('items').createIndex({ marketCode: 1 }, { unique: true })
    await db.collection('receipts').createIndex({ receiptNumber: 1 }, { unique: true })
    await db.collection('employees').createIndex({ employeeCode: 1 }, { unique: true })
    await db.collection('stores').createIndex({ storeCode: 1 }, { unique: true })
    
    console.log("✅ Created database indexes")
    
    // Ensure admin user exists
    const existingAdmin = await db.collection("admins").findOne({
      email: "admin@alloyrim.com"
    })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 12)
      await db.collection("admins").insertOne({
        name: "Super Admin",
        email: "admin@alloyrim.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log("✅ Created admin user")
    } else {
      console.log("✅ Admin user already exists")
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Database collections created successfully!",
      collections: {
        production: 8,
        administration: 9, // Updated: 5 employee collections + 4 others
        inventory: 4,
        customer: 4,
        total: 25 // Updated total
      },
      adminUser: {
        email: "admin@alloyrim.com",
        password: "admin123"
      }
    })
  } catch (error) {
    console.error("❌ Error creating collections:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create collections" },
      { status: 500 }
    )
  }
}
