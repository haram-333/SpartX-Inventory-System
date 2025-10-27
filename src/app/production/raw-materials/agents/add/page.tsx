import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AgentForm } from "@/components/production/agent-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AddAgentPage() {
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
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Add New Agent</h1>
          <p className="mt-1 text-sm text-gray-600">
            Register a new scrap material agent
          </p>
        </div>
        <AgentForm />
      </div>
    </DashboardLayout>
  )
}

