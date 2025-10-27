import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { ItemForm } from "../../../../components/production/item-form"
import { auth } from "../../../../lib/auth"
import { redirect } from "next/navigation"

export default async function AddItemPage() {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!['SUPER_ADMIN', 'ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/dashboard')

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Add New Item</h1>
          <p className="mt-1 text-sm text-gray-600">Create a new rim design</p>
        </div>
        <ItemForm />
      </div>
    </DashboardLayout>
  )
}

