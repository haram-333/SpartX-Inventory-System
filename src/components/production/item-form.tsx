"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Boxes, Save, X } from "lucide-react"

interface ItemFormProps {
  initialData?: {
    id?: string
    itemCode: string
    marketCode: string
    design: string
    description: string
    size: string
    specifications: string
    isActive: boolean
  }
  isEdit?: boolean
}

export function ItemForm({ initialData, isEdit = false }: ItemFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    itemCode: initialData?.itemCode || '',
    marketCode: initialData?.marketCode || '',
    design: initialData?.design || '',
    description: initialData?.description || '',
    size: initialData?.size || '',
    specifications: initialData?.specifications || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const url = isEdit 
        ? `/api/production/items/${initialData?.id}`
        : '/api/production/items'

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/production/items')
        router.refresh()
      } else {
        setError(data.error || 'Failed to save item')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
          <Boxes className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Item' : 'Add New Item'}
          </h2>
        </div>

        {/* Item Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="itemCode" className="block text-sm font-medium text-gray-700 mb-2">
              Item Code *
            </label>
            <input
              type="text"
              id="itemCode"
              name="itemCode"
              required
              value={formData.itemCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ITEM-001"
            />
          </div>

          <div>
            <label htmlFor="marketCode" className="block text-sm font-medium text-gray-700 mb-2">
              Market Code
            </label>
            <input
              type="text"
              id="marketCode"
              name="marketCode"
              value={formData.marketCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="MKT-001"
            />
          </div>
        </div>

        {/* Design and Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="design" className="block text-sm font-medium text-gray-700 mb-2">
              Design Name *
            </label>
            <input
              type="text"
              id="design"
              name="design"
              required
              value={formData.design}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Sport Model A"
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="17 inch"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Detailed description of the design..."
          />
        </div>

        {/* Specifications */}
        <div>
          <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-2">
            Technical Specifications
          </label>
          <textarea
            id="specifications"
            name="specifications"
            rows={3}
            value={formData.specifications}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Technical specs, materials, dimensions..."
          />
        </div>

        {/* Status */}
        {isEdit && (
          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        )}

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
            {isLoading ? 'Saving...' : isEdit ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </div>
    </form>
  )
}

