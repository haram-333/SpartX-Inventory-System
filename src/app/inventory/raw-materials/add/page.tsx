import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RawMaterialsForm } from "@/components/inventory/raw-materials-form"

export default async function AddRawMaterialPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to inventory module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "WAREHOUSE", "PRODUCTION"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Raw Material</h1>
          <p className="text-gray-600">Add a new raw material to the inventory</p>
        </div>

        {/* Raw Materials Form */}
        <RawMaterialsForm />
      </div>
    </DashboardLayout>
  )
}
