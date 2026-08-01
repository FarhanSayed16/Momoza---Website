'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { MenuItem, MenuCategory } from '@/types'
import toast from 'react-hot-toast'

interface MenuItemFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  item?: MenuItem | null
  categories: MenuCategory[]
}

export const MenuItemForm = ({ isOpen, onClose, onSuccess, item, categories }: MenuItemFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    pieces: 6,
    category_id: '',
    image_url: '',
    is_vegetarian: true,
    is_bestseller: false,
    is_available: true,
    sort_order: 0
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price,
        pieces: item.pieces,
        category_id: item.category_id,
        image_url: item.image_url || '',
        is_vegetarian: item.is_vegetarian,
        is_bestseller: item.is_bestseller,
        is_available: item.is_available,
        sort_order: item.sort_order
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        pieces: 6,
        category_id: categories.length > 0 ? categories[0].id : '',
        image_url: '',
        is_vegetarian: true,
        is_bestseller: false,
        is_available: true,
        sort_order: 0
      })
    }
  }, [item, isOpen, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || formData.price <= 0 || !formData.category_id) {
      toast.error('Please fill in all required fields properly')
      return
    }

    setIsSubmitting(true)
    try {
      const url = item 
        ? `/api/admin/menu/${item.id}`
        : `/api/admin/menu`
      
      const method = item ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save menu item')

      toast.success(item ? 'Item updated' : 'Item created')
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
            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
              <h2 className="text-xl font-bold text-white">
                {item ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Item Image</label>
                <ImageUploader 
                  value={formData.image_url} 
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  oldImageUrl={item?.image_url}
                  aspectRatio="square"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Item Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Paneer Tikka Momos"
                  required
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-zinc-400">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-zinc-800 rounded-lg bg-zinc-950 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="" disabled>Select category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Price (₹) *"
                  type="number"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  required
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
                <Input
                  label="Pieces"
                  type="number"
                  min="1"
                  value={formData.pieces || ''}
                  onChange={(e) => setFormData({ ...formData, pieces: parseInt(e.target.value) || 0 })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
                <Input
                  label="Sort Order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the item..."
                rows={2}
                className="bg-zinc-950 border-zinc-800 text-white"
              />

              <div className="grid grid-cols-3 gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-950">
                <Toggle
                  label="Available"
                  checked={formData.is_available}
                  onChange={(val) => setFormData({ ...formData, is_available: val })}
                />
                <Toggle
                  label="Vegetarian"
                  checked={formData.is_vegetarian}
                  onChange={(val) => setFormData({ ...formData, is_vegetarian: val })}
                />
                <Toggle
                  label="Bestseller"
                  checked={formData.is_bestseller}
                  onChange={(val) => setFormData({ ...formData, is_bestseller: val })}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800 flex gap-3 pb-6">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isSubmitting || !formData.name || !formData.price || !formData.category_id}
                  leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                >
                  {isSubmitting ? 'Saving...' : 'Save Item'}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
      </label>
    </div>
  )
}
