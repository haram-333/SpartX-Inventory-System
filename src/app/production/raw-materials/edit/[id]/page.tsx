import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { RawMaterialForm } from "@/components/production/raw-material-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getRawMaterial(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/production/raw-materials/${id}`,
      {
        cache: 'no-store'
      }
    )
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.rawMaterial : null
  } catch (error) {
    console.error('Error fetching raw material:', error)
    return null
  }
}

export default async function EditRawMaterialPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCTION']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  const rawMaterial = await getRawMaterial(resolvedParams.id)

  if (!rawMaterial) {
    redirect('/production/raw-materials')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Raw Material Transaction</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update transaction details
          </p>
        </div>
        <RawMaterialForm initialData={rawMaterial} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}

