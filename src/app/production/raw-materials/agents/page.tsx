import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AgentsTable } from "@/components/production/agents-table"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AgentsPage() {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Scrap Material Agents</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage agents who collect and supply scrap materials
          </p>
        </div>
        <AgentsTable />
      </div>
    </DashboardLayout>
  )
}

