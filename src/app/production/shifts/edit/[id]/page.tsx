import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function EditShiftPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!['SUPER_ADMIN', 'ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/dashboard')

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Shift Schedule</h1>
          <p className="mt-1 text-sm text-gray-600">Update shift schedule details</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">Edit form for schedule ID: {params.id}</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

