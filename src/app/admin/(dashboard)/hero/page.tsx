'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, GripVertical, CheckCircle2, XCircle, Loader2, Save } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { LoadingSpinner } from '@/components/admin/LoadingSpinner'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { EmptyState } from '@/components/admin/EmptyState'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { SlideForm } from '@/components/admin/SlideForm'
import { HeroSection, Slide } from '@/types'
import toast from 'react-hot-toast'

export default function HeroSlidesPage() {
  const [hero, setHero] = useState<HeroSection | null>(null)
  const [slides, setSlides] = useState<Slide[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Hero form state
  const [heroForm, setHeroForm] = useState<Partial<HeroSection>>({})
  const [isSavingHero, setIsSavingHero] = useState(false)

  // Slides state
  const [isSlideFormOpen, setIsSlideFormOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [deleteSlideData, setDeleteSlideData] = useState<{ id: string, title: string } | null>(null)

  const fetchData = async () => {
    try {
      const [heroRes, slidesRes] = await Promise.all([
        fetch('/api/admin/hero'),
        fetch('/api/admin/slides')
      ])
      
      const heroJson = await heroRes.json()
      const slidesJson = await slidesRes.json()
      
      if (heroJson.success && heroJson.data.length > 0) {
        setHero(heroJson.data[0])
        setHeroForm(heroJson.data[0])
      }
      
      if (slidesJson.success) {
        setSlides(slidesJson.data)
      }
    } catch (error) {
      toast.error('Failed to load hero and slides data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveHero = async () => {
    if (!heroForm.heading || !heroForm.background_image) {
      toast.error('Heading and Image are required for Hero section')
      return
    }

    setIsSavingHero(true)
    try {
      const res = await fetch(`/api/admin/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroForm)
      })
      
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to update Hero section')
      
      toast.success('Hero section updated successfully')
      fetchData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSavingHero(false)
    }
  }

  const handleDeleteSlide = async () => {
    if (!deleteSlideData) return
    try {
      const res = await fetch(`/api/admin/slides/${deleteSlideData.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete slide')
      toast.success('Slide deleted')
      fetchData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setDeleteSlideData(null)
    }
  }

  const toggleSlideStatus = async (slide: Slide) => {
    try {
      const res = await fetch(`/api/admin/slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !slide.is_active })
      })
      if (!res.ok) throw new Error()
      fetchData()
      toast.success(`Slide is now ${!slide.is_active ? 'active' : 'hidden'}`)
    } catch {
      toast.error('Failed to toggle status')
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="Hero & Slides" 
        description="Manage the homepage landing area and promotional slides."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Hero Editor */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center justify-between">
            Hero Section Settings
            <Button 
              size="sm" 
              onClick={handleSaveHero} 
              disabled={isSavingHero}
              leftIcon={isSavingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            >
              {isSavingHero ? 'Saving...' : 'Save Changes'}
            </Button>
          </h3>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Background Image * (Landscape recommended)</label>
              <ImageUploader 
                value={heroForm.background_image || null} 
                onChange={(url) => setHeroForm({ ...heroForm, background_image: url })}
                oldImageUrl={hero?.background_image}
                aspectRatio="video"
              />
            </div>

            <Input
              label="Main Heading *"
              value={heroForm.heading || ''}
              onChange={(e) => setHeroForm({ ...heroForm, heading: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            
            <Input
              label="Subheading"
              value={heroForm.subheading || ''}
              onChange={(e) => setHeroForm({ ...heroForm, subheading: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="CTA Button Text"
                value={heroForm.cta_text || ''}
                onChange={(e) => setHeroForm({ ...heroForm, cta_text: e.target.value })}
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Slides Manager */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center justify-between">
            Promotional Slides
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => { setEditingSlide(null); setIsSlideFormOpen(true) }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Slide
            </Button>
          </h3>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
            {slides.length > 0 ? (
              slides.map((slide) => (
                <div key={slide.id} className="flex gap-4 p-3 border border-zinc-800 rounded-xl bg-zinc-950/50 hover:border-zinc-700 transition-colors group">
                  <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-100 truncate">{slide.title}</h4>
                      <p className="text-xs text-zinc-500 truncate">{slide.subtitle || 'No subtitle'}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <button 
                        onClick={() => toggleSlideStatus(slide)}
                        className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          slide.is_active 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        {slide.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {slide.is_active ? 'Active' : 'Hidden'}
                      </button>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingSlide(slide); setIsSlideFormOpen(true) }}
                          className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setDeleteSlideData({ id: slide.id, title: slide.title })}
                          className="p-1 rounded-md hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState 
                title="No slides added"
                description="Create promotional slides that will appear in the carousel."
              />
            )}
          </div>
        </div>

      </div>

      <SlideForm 
        isOpen={isSlideFormOpen} 
        onClose={() => setIsSlideFormOpen(false)} 
        onSuccess={fetchData} 
        slide={editingSlide} 
      />

      <ConfirmDialog 
        isOpen={!!deleteSlideData}
        title="Delete Slide"
        message={`Are you sure you want to delete "${deleteSlideData?.title}"?`}
        isDestructive
        confirmText="Delete"
        onConfirm={handleDeleteSlide}
        onCancel={() => setDeleteSlideData(null)}
      />
    </div>
  )
}
