import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RawMaterialsTable } from "@/components/production/raw-materials-table"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users } from "lucide-react"

export default async function RawMaterialsPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user has permission
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCTION']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Raw Materials</h1>
            <p className="mt-1 text-sm text-gray-600">
              Track scrap material purchases and agent payments
            </p>
          </div>
          <Link
            href="/production/raw-materials/agents"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Agents
          </Link>
        </div>
        <RawMaterialsTable />
      </div>
    </DashboardLayout>
  )
}

