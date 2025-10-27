"use client"

import { useState } from "react"
import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { ArrowRight, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export default function MigrateUsersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleMigrate = async () => {
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/migrate-users", {
        method: "POST"
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.stats)
      } else {
        setError(data.error || "Migration failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Migrate Users to Role-Based Collections
        </h1>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  About this migration
                </h3>
                <div className="mt-2 text-sm text-blue-700 space-y-1">
                  <p>This will move users from the single <code className="bg-blue-100 px-1 rounded">admins</code> collection to role-specific collections:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>SUPER_ADMIN & ADMIN</strong> → <code className="bg-blue-100 px-1 rounded">admins</code></li>
                    <li><strong>PRODUCTION</strong> → <code className="bg-blue-100 px-1 rounded">production_employees</code></li>
                    <li><strong>WAREHOUSE</strong> → <code className="bg-blue-100 px-1 rounded">warehouse_employees</code></li>
                    <li><strong>SALES</strong> → <code className="bg-blue-100 px-1 rounded">sales_employees</code></li>
                    <li><strong>ACCOUNTS</strong> → <code className="bg-blue-100 px-1 rounded">accounts_employees</code></li>
                  </ul>
                  <p className="mt-2">This is a one-time operation and is safe to run multiple times.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleMigrate}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                  Migrating...
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Start Migration
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Migration completed successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700 space-y-1">
                    <p><strong>Total users processed:</strong> {result.total}</p>
                    <p><strong>Users migrated:</strong> {result.migrated}</p>
                    <p><strong>Users skipped:</strong> {result.skipped}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

