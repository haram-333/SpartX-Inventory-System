import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { PackingTable } from "../../../components/production/remaining-tables"
import { auth } from "../../../lib/auth"
import { redirect } from "next/navigation"

export default async function PackingPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!['SUPER_ADMIN', 'ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/dashboard')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Packing</h1>
          <p className="mt-1 text-sm text-gray-600">Manage packing and boxing records</p>
        </div>
        <PackingTable />
      </div>
    </DashboardLayout>
  )
}

