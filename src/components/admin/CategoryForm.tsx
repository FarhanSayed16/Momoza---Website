'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { MenuCategory } from '@/types'
import toast from 'react-hot-toast'

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  category?: MenuCategory | null
}

export const CategoryForm = ({ isOpen, onClose, onSuccess, category }: CategoryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    sort_order: 0,
    is_active: true
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        image_url: category.image_url || '',
        sort_order: category.sort_order,
        is_active: category.is_active
      })
    } else {
      setFormData({
        name: '',
        description: '',
        image_url: '',
        sort_order: 0,
        is_active: true
      })
    }
  }, [category, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    setIsSubmitting(true)
    try {
      const url = category 
        ? `/api/admin/categories/${category.id}`
        : `/api/admin/categories`
      
      const method = category ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save category')

      toast.success(category ? 'Category updated' : 'Category created')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">
                {category ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Category Image</label>
                <ImageUploader 
                  value={formData.image_url} 
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  oldImageUrl={category?.image_url}
                  aspectRatio="video"
                />
              </div>

              <Input
                label="Category Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Steamed Momos"
                required
                className="bg-zinc-950 border-zinc-800 text-white"
              />

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description..."
                rows={3}
                className="bg-zinc-950 border-zinc-800 text-white"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Sort Order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
                
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-zinc-400 mb-2">Status</label>
                  <label className="relative inline-flex items-center cursor-pointer mt-2">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                    <span className="ml-3 text-sm font-medium text-zinc-300">
                      {formData.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-800 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isSubmitting || !formData.name}
                  leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
