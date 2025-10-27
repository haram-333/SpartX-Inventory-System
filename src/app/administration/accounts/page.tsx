import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { AccountsTable } from "../../../components/administration/accounts-table"
import { auth } from "../../../lib/auth"
import { redirect } from "next/navigation"

export default async function AccountsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user has permission (SUPER_ADMIN, ADMIN, or ACCOUNTS)
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTS']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Account Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track all financial transactions - balance in and balance out
          </p>
        </div>
        <AccountsTable />
      </div>
    </DashboardLayout>
  )
}

