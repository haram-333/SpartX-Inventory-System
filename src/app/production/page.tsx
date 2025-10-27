import { redirect } from "next/navigation"
import { auth } from "../../lib/auth"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import Link from "next/link"
import { Package, Boxes, Cog, Palette, CheckCircle, PackageCheck, Truck, Clock } from "lucide-react"

export default async function ProductionPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has access to production module
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  const sections = [
    {
      title: "Raw Materials",
      description: "Manage scrap material agents and purchases",
      href: "/production/raw-materials",
      icon: Package,
      color: "green",
      roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
    },
    {
      title: "Items / Designs",
      description: "Manage rim designs with item and market codes",
      href: "/production/items",
      icon: Boxes,
      color: "blue",
      roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
    },
    {
      title: "Machining",
      description: "Track CNC machine production and shifts",
      href: "/production/machining",
      icon: Cog,
      color: "purple",
      roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
    },
    {
      title: "Paint",
      description: "Track painting process and colors",
      href: "/production/paint",
      icon: Palette,
      color: "pink",
      roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
    },
    {
      title: "Quality Control",
      description: "Inspect and verify product quality",
      href: "/production/quality",
      icon: CheckCircle,
      color: "yellow",
      roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
    },
    {
      title: "Packing",
      description: "Manage packing and boxing records",
      href: "/production/packing",
      icon: PackageCheck,
      color: "indigo",
      roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
    },
    {
      title: "Supply",
      description: "Track product dispatch and delivery",
      href: "/production/supply",
      icon: Truck,
      color: "orange",
      roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
    },
    {
      title: "Shift Management",
      description: "Manage day and night shift schedules",
      href: "/production/shifts",
      icon: Clock,
      color: "teal",
      roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
    }
  ]

  // Filter sections based on user role
  const visibleSections = sections.filter(section => 
    section.roles.includes(session.user.role)
  )

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 text-green-600 hover:bg-green-100'
      case 'blue':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-100'
      case 'purple':
        return 'bg-purple-50 text-purple-600 hover:bg-purple-100'
      case 'pink':
        return 'bg-pink-50 text-pink-600 hover:bg-pink-100'
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
      case 'indigo':
        return 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
      case 'orange':
        return 'bg-orange-50 text-orange-600 hover:bg-orange-100'
      case 'teal':
        return 'bg-teal-50 text-teal-600 hover:bg-teal-100'
      default:
        return 'bg-gray-50 text-gray-600 hover:bg-gray-100'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Production Line</h1>
          <p className="text-gray-600">Manage complete alloy rim production workflow</p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-lg ${getColorClasses(section.color)}`}>
                  <section.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Production Pipeline</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {visibleSections.map((section, index) => (
              <div key={section.title} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className={`h-10 w-10 rounded-full ${getColorClasses(section.color)} flex items-center justify-center`}>
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  {index < visibleSections.length - 1 && (
                    <div className="hidden lg:block w-8 h-0.5 bg-gray-300"></div>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-600">{section.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
