import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { HRTable } from "../../../components/administration/hr-table"
import { auth } from "../../../lib/auth"
import { redirect } from "next/navigation"

export default async function HRPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user has permission (SUPER_ADMIN or ADMIN)
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">HR Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage employee records and information
          </p>
        </div>
        <HRTable />
      </div>
    </DashboardLayout>
  )
}

