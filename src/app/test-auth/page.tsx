"use client"

import { useState } from "react"

export default function TestAuthPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testAuth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-auth")
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Auth Test</h1>
          
          <button
            onClick={testAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {isLoading ? "Testing..." : "Test Authentication"}
          </button>

          {result && (
            <div className={`p-4 rounded-md ${
              result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
              <h3 className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                {result.success ? "✅ Success!" : "❌ Error!"}
              </h3>
              <p className={`text-sm mt-1 ${result.success ? "text-green-700" : "text-red-700"}`}>
                {String(result.message || result.error || '')}
              </p>
              
              {result.session && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-green-800">Session Data:</p>
                  <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(result.session, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.details && (
                <details className="mt-3">
                  <summary className="text-sm font-medium cursor-pointer">Error Details</summary>
                  <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
