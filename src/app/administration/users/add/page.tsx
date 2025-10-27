import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UsersForm } from "@/components/administration/users-form"

export default async function AddUserPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-600">Create a new admin user in the system</p>
        </div>

        {/* User Form */}
        <UsersForm />
      </div>
    </DashboardLayout>
  )
}
