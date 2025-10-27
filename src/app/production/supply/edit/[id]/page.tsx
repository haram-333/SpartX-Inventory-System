import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function EditSupplyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!['SUPER_ADMIN', 'ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/dashboard')

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Supply Record</h1>
          <p className="mt-1 text-sm text-gray-600">Update supply/dispatch details</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">Edit form for record ID: {resolvedParams.id}</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

