"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
  Home, 
  Factory, 
  Users, 
  Package, 
  UserCheck,
  LogOut,
  Menu,
  X
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION", "WAREHOUSE", "SALES", "ACCOUNTS"]
  },
  {
    name: "Production Line",
    href: "/production",
    icon: Factory,
    roles: ["SUPER_ADMIN", "ADMIN", "PRODUCTION"]
  },
  {
    name: "Administration",
    href: "/administration",
    icon: UserCheck,
    roles: ["SUPER_ADMIN", "ADMIN", "ACCOUNTS"]
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["SUPER_ADMIN", "ADMIN", "WAREHOUSE", "PRODUCTION"]
  },
  {
    name: "Customer",
    href: "/customer",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN", "SALES"]
  }
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Always show sidebar, but with different content based on session
  const filteredNavigation = session?.user 
    ? navigation.filter(item => item.roles.includes(session.user.role))
    : []

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
            <h1 className="text-xl font-bold">Alloy Rim Factory</h1>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          {session?.user && (
            <div className="px-4 py-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {session.user.role.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          {session?.user && (
            <div className="px-4 py-4 border-t border-gray-700">
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
