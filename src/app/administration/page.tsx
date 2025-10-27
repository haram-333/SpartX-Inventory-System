import { redirect } from "next/navigation"
import { auth } from "../../lib/auth"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import Link from "next/link"
import { Users, DollarSign, UserCheck, Calendar } from "lucide-react"

export default async function AdministrationPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to administration module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "ACCOUNTS"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  const sections = [
    {
      title: "User Management",
      description: "Manage admin users and employee roles",
      href: "/administration/users",
      icon: Users,
      color: "blue",
      roles: ["SUPER_ADMIN", "ADMIN"]
    },
    {
      title: "Account Management",
      description: "Track balance in, balance out, and transactions",
      href: "/administration/accounts",
      icon: DollarSign,
      color: "green",
      roles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTS"]
    },
    {
      title: "HR Management",
      description: "Manage employee records and information",
      href: "/administration/hr",
      icon: UserCheck,
      color: "purple",
      roles: ["SUPER_ADMIN", "ADMIN"]
    },
    {
      title: "Attendance",
      description: "Track and manage employee attendance",
      href: "/administration/attendance",
      icon: Calendar,
      color: "orange",
      roles: ["SUPER_ADMIN", "ADMIN"]
    }
  ]

  // Filter sections based on user role
  const visibleSections = sections.filter(section => 
    section.roles.includes(session.user.role)
  )

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-100'
      case 'green':
        return 'bg-green-50 text-green-600 hover:bg-green-100'
      case 'purple':
        return 'bg-purple-50 text-purple-600 hover:bg-purple-100'
      case 'orange':
        return 'bg-orange-50 text-orange-600 hover:bg-orange-100'
      default:
        return 'bg-gray-50 text-gray-600 hover:bg-gray-100'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600">Manage users, accounts, HR, and attendance</p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {visibleSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${getColorClasses(section.color)}`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {section.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
