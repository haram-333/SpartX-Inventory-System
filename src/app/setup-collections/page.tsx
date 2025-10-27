"use client"

import { useState } from "react"

export default function SetupCollectionsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSetup = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/setup-collections", {
        method: "POST"
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`✅ ${data.message}\n\n📊 Collections created:\n• Production: ${data.collections.production}\n• Administration: ${data.collections.administration}\n• Inventory: ${data.collections.inventory}\n• Customer: ${data.collections.customer}\n• Total: ${data.collections.total}`)
      } else {
        setMessage("❌ Error: " + data.error)
      }
    } catch (error) {
      setMessage("❌ Failed to create collections")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Setup Database Collections</h1>
          <p className="text-gray-600">
            Create all collections for the 4 main modules
          </p>
          
          <button
            onClick={handleSetup}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Creating collections..." : "Create Collections"}
          </button>

          {message && (
            <div className={`p-4 rounded-md text-left whitespace-pre-line ${
              message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="text-left space-y-2 text-sm text-gray-500">
            <p><strong>Collections to be created:</strong></p>
            <p>• Production: agents, raw_materials, items, machining_records, paint_records, quality_inspections, packing_records, supply_records, shift_schedules</p>
            <p>• Administration: admins, account_transactions, employees, attendance_records</p>
            <p>• Inventory: inventory_raw_materials, stores, store_sections, stock_movements</p>
            <p>• Customer: customers, receipts, receipt_items, payments</p>
          </div>
        </div>
      </div>
    </div>
  )
}
