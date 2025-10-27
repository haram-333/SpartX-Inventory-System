import { DashboardLayout } from "../../../../../../../components/layout/dashboard-layout"
import { AgentForm } from "../../../../../../../components/production/agent-form"
import { auth } from "../../../../../../../lib/auth"
import { redirect } from "next/navigation"

async function getAgent(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/production/agents/${id}`,
      {
        cache: 'no-store'
      }
    )
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.agent : null
  } catch (error) {
    console.error('Error fetching agent:', error)
    return null
  }
}

export default async function EditAgentPage({ 
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

  const agent = await getAgent(params.id)

  if (!agent) {
    redirect('/production/raw-materials/agents')
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Agent</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update agent details
          </p>
        </div>
        <AgentForm initialData={agent} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}

