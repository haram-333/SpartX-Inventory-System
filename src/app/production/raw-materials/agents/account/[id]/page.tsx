import { DashboardLayout } from "../../../../../../../components/layout/dashboard-layout"
import { AgentAccountView } from "../../../../../../../components/production/agent-account-view"
import { auth } from "../../../../../../../lib/auth"
import { redirect } from "next/navigation"

export default async function AgentAccountPage({ 
  params 
}: { 
  params: { id: string } 
}) {
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
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Agent Account</h1>
          <p className="mt-1 text-sm text-gray-600">
            View complete transaction history and account summary
          </p>
        </div>
        <AgentAccountView agentId={params.id} />
      </div>
    </DashboardLayout>
  )
}

