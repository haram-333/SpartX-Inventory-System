import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { AccountForm } from "../../../../components/administration/account-form"
import { auth } from "../../../../lib/auth"
import { redirect } from "next/navigation"

export default async function AddAccountPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user has permission
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTS']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Add Transaction</h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a new account transaction record
          </p>
        </div>
        <AccountForm />
      </div>
    </DashboardLayout>
  )
}

