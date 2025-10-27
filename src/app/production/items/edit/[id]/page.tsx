import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ItemForm } from "@/components/production/item-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getItem(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/production/items/${id}`, { cache: 'no-store' })
    if (!response.ok) return null
    const data = await response.json()
    return data.success ? data.item : null
  } catch (error) {
    return null
  }
}

export default async function EditItemPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect('/auth/signin')
  if (!['SUPER_ADMIN', 'ADMIN', 'PRODUCTION'].includes(session.user.role)) redirect('/dashboard')

  const item = await getItem(params.id)
  if (!item) redirect('/production/items')

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Item</h1>
          <p className="mt-1 text-sm text-gray-600">Update item details</p>
        </div>
        <ItemForm initialData={item} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}

