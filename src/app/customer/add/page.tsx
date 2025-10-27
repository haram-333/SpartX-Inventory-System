import { redirect } from "next/navigation"
import { auth } from "../../../lib/auth"
import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { CustomerForm } from "../../../components/customer/customer-form"

export default async function AddCustomerPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to customer module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "SALES"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
          <p className="text-gray-600">Create a new customer in the system</p>
        </div>

        {/* Customer Form */}
        <CustomerForm />
      </div>
    </DashboardLayout>
  )
}

