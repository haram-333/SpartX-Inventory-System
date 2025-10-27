import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UsersTable } from "@/components/administration/users-table"

export default async function UsersPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to administration module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "ACCOUNTS"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage admin users and their roles</p>
        </div>

        {/* Users Table */}
        <UsersTable />
      </div>
    </DashboardLayout>
  )
}
