"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Palette, Save, X } from "lucide-react"

interface PaintFormProps {
  initialData?: {
    id?: string
    itemId: string
    date: string
    color: string
    paintType: string
    quantity: number
    status: string
    notes: string
  }
  isEdit?: boolean
}

interface Item {
  id: string
  itemCode: string
  design: string
}

export function PaintForm({ initialData, isEdit = false }: PaintFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [items, setItems] = useState<Item[]>([])

  const [formData, setFormData] = useState({
    itemId: initialData?.itemId || '',
    date: initialData?.date 
      ? new Date(initialData.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    color: initialData?.color || '',
    paintType: initialData?.paintType || 'standard',
    quantity: initialData?.quantity || 0,
    status: initialData?.status || 'in_progress',
    notes: initialData?.notes || ''
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
        ? `/api/production/paint/${initialData?.id}`
        : '/api/production/paint'

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/production/paint')
        router.refresh()
      } else {
        setError(data.error || 'Failed to save paint record')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const colors = [
    'Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 
    'Orange', 'Purple', 'Gold', 'Bronze', 'Chrome', 'Custom'
  ]

  const paintTypes = [
    'Standard', 'Premium', 'Matte', 'Glossy', 'Metallic', 'Pearl', 'Custom'
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
          <Palette className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Paint Record' : 'Add Paint Record'}
          </h2>
        </div>

        {/* Item Selection */}
        {!isEdit && (
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-2">
              Item to Paint *
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

        {/* Date and Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Paint Date *
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
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <select
              id="color"
              name="color"
              required
              value={formData.color}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select color</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Paint Type and Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="paintType" className="block text-sm font-medium text-gray-700 mb-2">
              Paint Type
            </label>
            <select
              id="paintType"
              name="paintType"
              value={formData.paintType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {paintTypes.map((type) => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Painted *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="drying">Drying</option>
            <option value="quality_check">Quality Check</option>
          </select>
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
            placeholder="Paint application notes, quality observations..."
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
            {isLoading ? 'Saving...' : isEdit ? 'Update Record' : 'Create Record'}
          </button>
        </div>
      </div>
    </form>
  )
}

