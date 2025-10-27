import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { MachiningTable } from "../../../components/production/machining-table"
import { auth } from "../../../lib/auth"
import { redirect } from "next/navigation"

export default async function MachiningPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!['SUPER_ADMIN', 'ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/dashboard')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Machining</h1>
          <p className="mt-1 text-sm text-gray-600">Track CNC machine production and shifts</p>
        </div>
        <MachiningTable />
      </div>
    </DashboardLayout>
  )
}

