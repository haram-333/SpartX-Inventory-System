import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QualityTable } from "@/components/production/quality-table"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function QualityPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!['SUPER_ADMIN', 'ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/dashboard')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quality Control</h1>
          <p className="mt-1 text-sm text-gray-600">Inspect and verify product quality standards</p>
        </div>
        <QualityTable />
      </div>
    </DashboardLayout>
  )
}

