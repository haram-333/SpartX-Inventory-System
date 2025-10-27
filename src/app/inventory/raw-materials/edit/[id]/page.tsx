import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RawMaterialsForm } from "@/components/inventory/raw-materials-form"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface EditRawMaterialPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditRawMaterialPage({ params }: EditRawMaterialPageProps) {
  const resolvedParams = await params
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to inventory module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "WAREHOUSE", "PRODUCTION"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  // Fetch raw material data
  let rawMaterial = null
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const materialData = await db.collection("inventory_raw_materials").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (materialData) {
      rawMaterial = {
        id: materialData._id.toString(),
        name: materialData.name,
        type: materialData.type,
        supplier: materialData.supplier,
        currentStock: materialData.currentStock,
        unit: materialData.unit,
        minStock: materialData.minStock,
        maxStock: materialData.maxStock,
        location: materialData.location
      }
    }
  } catch (error) {
    console.error("Error fetching raw material:", error)
  }

  if (!rawMaterial) {
    redirect("/inventory/raw-materials")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Raw Material</h1>
          <p className="text-gray-600">Update raw material information</p>
        </div>

        {/* Raw Materials Form */}
        <RawMaterialsForm initialData={rawMaterial} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}
