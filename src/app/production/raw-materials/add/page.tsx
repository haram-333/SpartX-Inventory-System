import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { RawMaterialForm } from "../../../components/production/raw-material-form"
import { auth } from "../../../lib/auth"
import { redirect } from "next/navigation"

export default async function AddRawMaterialPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCTION']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Add Raw Material Transaction</h1>
          <p className="mt-1 text-sm text-gray-600">
            Record a new scrap material purchase
          </p>
        </div>
        <RawMaterialForm />
      </div>
    </DashboardLayout>
  )
}

