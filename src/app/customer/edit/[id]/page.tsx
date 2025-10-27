import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CustomerForm } from "@/components/customer/customer-form"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface EditCustomerPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const resolvedParams = await params
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to customer module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "SALES"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  // Fetch customer data
  let customer = null
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const customerData = await db.collection("customers").findOne({
      _id: new ObjectId(resolvedParams.id)
    })

    if (customerData) {
      customer = {
        id: customerData._id.toString(),
        name: customerData.name,
        phone: customerData.phone,
        shopName: customerData.shopName,
        address: customerData.address,
        accountNumber: customerData.accountNumber
      }
    }
  } catch (error) {
    console.error("Error fetching customer:", error)
  }

  if (!customer) {
    redirect("/customer")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
          <p className="text-gray-600">Update customer information</p>
        </div>

        {/* Customer Form */}
        <CustomerForm initialData={customer} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}

