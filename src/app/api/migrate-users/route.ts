import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import { getCollectionByRole } from "../../../lib/user-collections"

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    console.log("🔄 Starting user migration...")
    
    // Get all users from admins collection
    const adminsUsers = await db.collection("admins").find({}).toArray()
    
    console.log(`Found ${adminsUsers.length} users in admins collection`)
    
    let migratedCount = 0
    let skippedCount = 0
    
    for (const user of adminsUsers) {
      const targetCollection = getCollectionByRole(user.role)
      
      // If already in the correct collection (SUPER_ADMIN or ADMIN), skip
      if (targetCollection === 'admins') {
        console.log(`✅ User ${user.email} (${user.role}) already in correct collection`)
        skippedCount++
        continue
      }
      
      // Check if user already exists in target collection
      const existingUser = await db.collection(targetCollection).findOne({
        _id: user._id
      })
      
      if (existingUser) {
        console.log(`⚠️ User ${user.email} already exists in ${targetCollection}`)
        // Delete from admins collection
        await db.collection("admins").deleteOne({ _id: user._id })
        migratedCount++
        continue
      }
      
      // Move user to correct collection
      await db.collection(targetCollection).insertOne(user)
      await db.collection("admins").deleteOne({ _id: user._id })
      
      console.log(`✅ Migrated ${user.email} (${user.role}) to ${targetCollection}`)
      migratedCount++
    }
    
    console.log(`✅ Migration complete! Migrated: ${migratedCount}, Skipped: ${skippedCount}`)
    
    return NextResponse.json({
      success: true,
      message: "User migration completed successfully",
      stats: {
        total: adminsUsers.length,
        migrated: migratedCount,
        skipped: skippedCount
      }
    })
  } catch (error) {
    console.error("❌ Error migrating users:", error)
    return NextResponse.json(
      { success: false, error: "Failed to migrate users" },
      { status: 500 }
    )
  }
}

