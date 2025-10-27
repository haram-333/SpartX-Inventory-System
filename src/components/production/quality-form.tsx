"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Save, X } from "lucide-react"

interface QualityFormProps {
  initialData?: {
    id?: string
    itemId: string
    date: string
    inspectorName: string
    totalQuantity: number
    passedQuantity: number
    failedQuantity: number
    status: string
    remarks: string
  }
  isEdit?: boolean
}

interface Item {
  id: string
  itemCode: string
  design: string
}

export function QualityForm({ initialData, isEdit = false }: QualityFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [items, setItems] = useState<Item[]>([])

  const [formData, setFormData] = useState({
    itemId: initialData?.itemId || '',
    date: initialData?.date 
      ? new Date(initialData.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    inspectorName: initialData?.inspectorName || '',
    totalQuantity: initialData?.totalQuantity || 0,
    passedQuantity: initialData?.passedQuantity || 0,
    failedQuantity: initialData?.failedQuantity || 0,
    status: initialData?.status || 'pending',
    remarks: initialData?.remarks || ''
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/production/items')
      const data = await response.json()
      if (data.success) {
        setItems(data.items.filter((item: { isActive: boolean }) => item.isActive))
      }
    } catch (error) {
      console.error('Error fetching items:', error)
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
        ? `/api/production/quality/${initialData?.id}`
        : '/api/production/quality'

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/production/quality')
        router.refresh()
      } else {
        setError(data.error || 'Failed to save inspection')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const totalQuantity = parseInt(formData.totalQuantity.toString()) || 0
  const passedQuantity = parseInt(formData.passedQuantity.toString()) || 0
  const failedQuantity = parseInt(formData.failedQuantity.toString()) || 0
  const calculatedTotal = passedQuantity + failedQuantity

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
          <CheckCircle className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Quality Inspection' : 'Add Quality Inspection'}
          </h2>
        </div>

        {/* Item Selection */}
        {!isEdit && (
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-2">
              Item to Inspect *
            </label>
            <select
              id="itemId"
              name="itemId"
              required
              value={formData.itemId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemCode} - {item.design}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date and Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Inspection Date *
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
            <label htmlFor="inspectorName" className="block text-sm font-medium text-gray-700 mb-2">
              Inspector Name
            </label>
            <input
              type="text"
              id="inspectorName"
              name="inspectorName"
              value={formData.inspectorName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Inspector name"
            />
          </div>
        </div>

        {/* Quantities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="totalQuantity" className="block text-sm font-medium text-gray-700 mb-2">
              Total Quantity *
            </label>
            <input
              type="number"
              id="totalQuantity"
              name="totalQuantity"
              min="0"
              required
              value={formData.totalQuantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="passedQuantity" className="block text-sm font-medium text-gray-700 mb-2">
              Passed Quantity
            </label>
            <input
              type="number"
              id="passedQuantity"
              name="passedQuantity"
              min="0"
              max={totalQuantity}
              value={formData.passedQuantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="failedQuantity" className="block text-sm font-medium text-gray-700 mb-2">
              Failed Quantity
            </label>
            <input
              type="number"
              id="failedQuantity"
              name="failedQuantity"
              min="0"
              max={totalQuantity}
              value={formData.failedQuantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Summary */}
        {calculatedTotal > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-lg font-semibold text-green-600">{passedQuantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-lg font-semibold text-red-600">{failedQuantity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Checked</p>
                <p className="text-lg font-semibold text-blue-600">{calculatedTotal}</p>
              </div>
            </div>
            {calculatedTotal !== totalQuantity && (
              <p className="mt-2 text-sm text-orange-600">
                ⚠️ Passed + Failed ({calculatedTotal}) doesn&apos;t match Total Quantity ({totalQuantity})
              </p>
            )}
          </div>
        )}

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Inspection Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
            Remarks
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows={3}
            value={formData.remarks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Inspection notes, defects found, recommendations..."
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
            {isLoading ? 'Saving...' : isEdit ? 'Update Inspection' : 'Create Inspection'}
          </button>
        </div>
      </div>
    </form>
  )
}

