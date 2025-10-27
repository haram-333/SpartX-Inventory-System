import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RawMaterialsTable } from "@/components/inventory/raw-materials-table"

export default async function InventoryPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage raw materials, finished products, and stock movements</p>
        </div>

        {/* Raw Materials Table */}
        <RawMaterialsTable />
      </div>
    </DashboardLayout>
  )
}
