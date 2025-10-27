import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AccountForm } from "@/components/administration/account-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getTransaction(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/administration/accounts/${id}`,
      {
        cache: 'no-store'
      }
    )
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.transaction : null
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return null
  }
}

export default async function EditAccountPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user has permission
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'ACCOUNTS']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  const transaction = await getTransaction(params.id)

  if (!transaction) {
    redirect('/administration/accounts')
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Transaction</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update transaction details
          </p>
        </div>
        <AccountForm initialData={transaction} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}

