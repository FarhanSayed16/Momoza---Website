'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { Slide } from '@/types'
import toast from 'react-hot-toast'

interface SlideFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  slide?: Slide | null
}

export const SlideForm = ({ isOpen, onClose, onSuccess, slide }: SlideFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    is_active: true,
    sort_order: 0
  })

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle || '',
        image_url: slide.image_url,
        link_url: slide.link_url || '',
        is_active: slide.is_active,
        sort_order: slide.sort_order
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        image_url: '',
        link_url: '',
        is_active: true,
        sort_order: 0
      })
    }
  }, [slide, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.image_url) {
      toast.error('Title and Image are required')
      return
    }

    setIsSubmitting(true)
    try {
      const url = slide 
        ? `/api/admin/slides/${slide.id}`
        : `/api/admin/slides`
      
      const method = slide ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save slide')

      toast.success(slide ? 'Slide updated' : 'Slide created')
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
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
              <h2 className="text-xl font-bold text-white">
                {slide ? 'Edit Slide' : 'Add Slide'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Slide Image * (16:9 Recommended)</label>
                <ImageUploader 
                  value={formData.image_url} 
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  oldImageUrl={slide?.image_url}
                  aspectRatio="video"
                />
              </div>

              <Input
                label="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Weekend Special"
                required
                className="bg-zinc-950 border-zinc-800 text-white"
              />

              <Input
                label="Subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g., Get 20% off on all items"
                className="bg-zinc-950 border-zinc-800 text-white"
              />

              <Input
                label="Link URL (Optional)"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="e.g., /menu"
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
                  disabled={isSubmitting || !formData.title || !formData.image_url}
                  leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                >
                  {isSubmitting ? 'Saving...' : 'Save Slide'}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
