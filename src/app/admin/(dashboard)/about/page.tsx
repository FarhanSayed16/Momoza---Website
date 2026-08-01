'use client'

import React, { useEffect, useState } from 'react'
import { Save, Loader2, Plus, Trash2, GripVertical } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { LoadingSpinner } from '@/components/admin/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { AboutSection } from '@/types'
import toast from 'react-hot-toast'

export default function AboutEditorPage() {
  const [formData, setFormData] = useState<Partial<AboutSection> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/about')
      const json = await res.json()
      if (json.success && json.data) {
        setFormData(json.data)
      }
    } catch (error) {
      toast.error('Failed to load about page data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async () => {
    if (!formData?.title || !formData?.story || !formData?.image_url) {
      toast.error('Title, Story, and Image are required')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to update About section')
      
      toast.success('About page updated successfully')
      fetchData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const addHighlight = () => {
    if (!formData) return
    const highlights = formData.highlights || []
    setFormData({
      ...formData,
      highlights: [...highlights, { title: '', description: '', icon: 'Star' }]
    })
  }

  const removeHighlight = (index: number) => {
    if (!formData || !formData.highlights) return
    const newHighlights = [...formData.highlights]
    newHighlights.splice(index, 1)
    setFormData({ ...formData, highlights: newHighlights })
  }

  const updateHighlight = (index: number, field: keyof AboutSection['highlights'][0], value: string) => {
    if (!formData || !formData.highlights) return
    const newHighlights = [...formData.highlights]
    newHighlights[index] = { ...newHighlights[index], [field]: value }
    setFormData({ ...formData, highlights: newHighlights })
  }

  if (isLoading || !formData) return <LoadingSpinner />

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      <PageHeader 
        title="About Page Editor" 
        description="Update your brand story, image, and key highlights."
        action={
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            leftIcon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Story & Content</h3>
            
            <Input
              label="Section Title *"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white font-semibold text-lg"
              placeholder="e.g., Why we make Momoza"
            />
            
            <Textarea
              label="Brand Story (Content) *"
              value={formData.story || ''}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white min-h-[300px]"
              placeholder="Write your amazing story here..."
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">USP Highlights</h3>
              <Button size="sm" variant="outline" onClick={addHighlight}>
                <Plus className="h-4 w-4 mr-2" /> Add Highlight
              </Button>
            </div>
            
            <div className="space-y-4">
              {(!formData.highlights || formData.highlights.length === 0) ? (
                <div className="text-center p-6 border border-dashed border-zinc-800 rounded-xl text-zinc-500">
                  No highlights added. Add some reasons why people should choose you!
                </div>
              ) : (
                formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-950/50">
                    <div className="mt-2 text-zinc-600">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Title"
                          value={highlight.title}
                          onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-white"
                          placeholder="e.g., Handcrafted"
                        />
                        <Input
                          label="Lucide Icon Name"
                          value={highlight.icon}
                          onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                          className="bg-zinc-900 border-zinc-800 text-white"
                          placeholder="e.g., Heart, Star, Shield"
                        />
                      </div>
                      <Textarea
                        label="Description"
                        value={highlight.description}
                        onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                        className="bg-zinc-900 border-zinc-800 text-white"
                        placeholder="Brief description..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <button 
                        onClick={() => removeHighlight(index)}
                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Image */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-2">Featured Image</h3>
            <p className="text-sm text-zinc-400 mb-4">
              This image will appear alongside your brand story on the About page.
            </p>
            <div className="space-y-2">
              <ImageUploader 
                value={formData.image_url || null} 
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                oldImageUrl={formData.image_url}
                aspectRatio="square"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
