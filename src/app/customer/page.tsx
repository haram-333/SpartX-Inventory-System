import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CustomerTable } from "@/components/customer/customer-table"

export default async function CustomerPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to customer module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "SALES"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage customers, receipts, and payments</p>
        </div>

        {/* Customer Table */}
        <CustomerTable />
      </div>
    </DashboardLayout>
  )
}
