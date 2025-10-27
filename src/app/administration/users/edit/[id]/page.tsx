import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { UsersForm } from "@/components/administration/users-form"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to administration module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "ACCOUNTS"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  // Fetch user data
  let user = null
  try {
    const client = await clientPromise
    const db = client.db("SpartX-Inventory-System")
    
    const userData = await db.collection("admins").findOne({
      _id: new ObjectId(params.id)
    })

    if (userData) {
      user = {
        id: userData._id.toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isActive: userData.isActive
      }
    }
  } catch (error) {
    console.error("Error fetching user:", error)
  }

  if (!user) {
    redirect("/administration/users")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Update user information and permissions</p>
        </div>

        {/* User Form */}
        <UsersForm initialData={user} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}
