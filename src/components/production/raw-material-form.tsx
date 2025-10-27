"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, Save, X } from "lucide-react"

interface RawMaterialFormProps {
  initialData?: {
    id?: string
    agentId: string
    date: string
    materialType: string
    quantity: number
    unit: string
    rate: number
    amountPaid: number
    notes: string
  }
  isEdit?: boolean
}

export function RawMaterialForm({ initialData, isEdit = false }: RawMaterialFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [agents, setAgents] = useState<Array<{ id: string; name: string; phone: string; isActive: boolean }>>([])

  const [formData, setFormData] = useState({
    agentId: initialData?.agentId || '',
    date: initialData?.date 
      ? new Date(initialData.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    materialType: initialData?.materialType || '',
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || 'kg',
    rate: initialData?.rate || 0,
    amountPaid: initialData?.amountPaid || 0,
    notes: initialData?.notes || ''
  })

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/production/agents')
      const data = await response.json()
      
      if (data.success) {
        setAgents(data.agents.filter((agent: { isActive: boolean }) => agent.isActive))
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const url = isEdit 
        ? `/api/production/raw-materials/${initialData?.id}`
        : '/api/production/raw-materials'

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/production/raw-materials')
        router.refresh()
      } else {
        setError(data.error || 'Failed to save transaction')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const totalBill = (parseFloat(formData.quantity.toString()) || 0) * (parseFloat(formData.rate.toString()) || 0)
  const remainingAmount = totalBill - (parseFloat(formData.amountPaid.toString()) || 0)

  const materialTypes = [
    'Aluminum Scrap',
    'Steel Scrap',
    'Alloy Mix',
    'Pure Aluminum',
    'Recycled Metal',
    'Other'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <Package className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Raw Material Transaction' : 'Add New Transaction'}
          </h2>
        </div>

        {/* Agent Selection */}
        {!isEdit && (
          <div>
            <label htmlFor="agentId" className="block text-sm font-medium text-gray-700 mb-2">
              Agent *
            </label>
            <select
              id="agentId"
              name="agentId"
              required
              value={formData.agentId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.phone}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date and Material Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-2">
              Material Type *
            </label>
            <select
              id="materialType"
              name="materialType"
              required
              value={formData.materialType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select material type</option>
              {materialTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity, Unit, and Rate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              step="0.01"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="ton">Ton</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>

          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">
              Rate (PKR per unit) *
            </label>
            <input
              type="number"
              id="rate"
              name="rate"
              min="0"
              step="0.01"
              required
              value={formData.rate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Calculated Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bill</p>
              <p className="text-lg font-semibold text-blue-600">
                PKR {totalBill.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Amount Paid</p>
              <p className="text-lg font-semibold text-green-600">
                PKR {(parseFloat(formData.amountPaid.toString()) || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-lg font-semibold text-red-600">
                PKR {remainingAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Amount Paid */}
        <div>
          <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-2">
            Amount Paid (PKR)
          </label>
          <input
            type="number"
            id="amountPaid"
            name="amountPaid"
            min="0"
            step="0.01"
            value={formData.amountPaid}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0.00"
          />
          <p className="mt-1 text-sm text-gray-500">Leave 0 for full pending payment</p>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Additional notes..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Create Transaction'}
          </button>
        </div>
      </div>
    </form>
  )
}

