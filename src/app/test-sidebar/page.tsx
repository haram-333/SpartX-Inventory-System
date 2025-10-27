"use client"

import { useState } from "react"
import { Sidebar } from "../../components/layout/sidebar"
import { Menu, X } from "lucide-react"

export default function TestSidebarPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Test Sidebar</h1>
              <div className="w-10"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Sidebar Test</h2>
              <p className="text-gray-600 mb-4">
                Sidebar state: <strong>{sidebarOpen ? 'Open' : 'Closed'}</strong>
              </p>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
