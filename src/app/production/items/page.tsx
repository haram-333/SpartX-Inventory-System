import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ItemsTable } from "@/components/production/items-table"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ItemsPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCTION']
  if (!allowedRoles.includes(session.user.role)) redirect('/dashboard')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Items & Designs</h1>
          <p className="mt-1 text-sm text-gray-600">Manage alloy rim designs and product catalog</p>
        </div>
        <ItemsTable />
      </div>
    </DashboardLayout>
  )
}

