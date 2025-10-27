import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { HRForm } from "@/components/administration/hr-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getEmployee(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/administration/hr/${id}`,
      {
        cache: 'no-store'
      }
    )
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.employee : null
  } catch (error) {
    console.error('Error fetching employee:', error)
    return null
  }
}

export default async function EditHRPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user has permission
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  const employee = await getEmployee(resolvedParams.id)

  if (!employee) {
    redirect('/administration/hr')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Employee</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update employee details
          </p>
        </div>
        <HRForm initialData={employee} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}

