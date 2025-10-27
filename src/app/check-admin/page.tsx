"use client"

import { useState } from "react"

export default function CheckAdminPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkAdmin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/check-admin")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: "Network error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Admin User</h1>
          
          <button
            onClick={checkAdmin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {isLoading ? "Checking..." : "Check Admin User"}
          </button>

          {result && (
            <div className={`p-4 rounded-md ${
              result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
              <h3 className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                {result.success ? "✅ Admin Found!" : "❌ Admin Not Found!"}
              </h3>
              <p className={`text-sm mt-1 ${result.success ? "text-green-700" : "text-red-700"}`}>
                {String(result.message || '')}
              </p>
              
              {result.admin !== undefined && result.admin !== null && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-green-800">Admin Details:</p>
                  <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(result.admin, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <a
              href="/setup"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Setup Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
