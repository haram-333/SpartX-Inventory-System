import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PaintTable } from "@/components/production/paint-table"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function PaintPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!['SUPER_ADMIN', 'ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/dashboard')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Paint</h1>
          <p className="mt-1 text-sm text-gray-600">Track painting process and color application</p>
        </div>
        <PaintTable />
      </div>
    </DashboardLayout>
  )
}

