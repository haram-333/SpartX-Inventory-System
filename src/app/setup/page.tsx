"use client"

import { useState } from "react"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSetup = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/setup-admin", {
        method: "POST"
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ ${data.message}\n\n📧 Email: ${data.email}\n🔑 Password: ${data.password}`)
      } else {
        setMessage("❌ Error: " + data.error)
      }
    } catch (error) {
      setMessage("❌ Failed to create admin user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Setup Admin User</h1>
          <p className="text-gray-600">
            Create the first admin user for the inventory system
          </p>
          
          <button
            onClick={handleSetup}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Creating admin..." : "Create Admin User"}
          </button>

          {message && (
            <div className={`p-4 rounded-md text-left whitespace-pre-line ${
              message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="text-left space-y-2 text-sm text-gray-500">
            <p><strong>After creating admin:</strong></p>
            <p>1. Go to <code className="bg-gray-100 px-1 rounded">/auth/signin</code></p>
            <p>2. Login with the credentials above</p>
            <p>3. You'll be redirected to dashboard</p>
          </div>
        </div>
      </div>
    </div>
  )
}
