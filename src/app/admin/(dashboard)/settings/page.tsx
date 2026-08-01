'use client'

import React, { useEffect, useState } from 'react'
import { Save, Loader2, Info } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { LoadingSpinner } from '@/components/admin/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SiteSettings } from '@/types'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [formData, setFormData] = useState<Partial<SiteSettings> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const json = await res.json()
      if (json.success && json.data) {
        setFormData(json.data)
      }
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    if (!formData) return

    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to update settings')
      
      toast.success('Settings updated successfully')
      fetchSettings()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !formData) return <LoadingSpinner />

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <PageHeader 
        title="Store Settings" 
        description="Configure your brand details, operations, and social links."
        action={
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            leftIcon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        }
      />

      <div className="space-y-8">
        
        {/* Operations & Master Toggle */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">Store Operations</h3>
              <p className="text-zinc-400 text-sm mt-1">Manage delivery rules and your online status.</p>
            </div>
            
            <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-sm font-medium text-white">Accepting Orders</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.is_accepting_orders}
                  onChange={(e) => setFormData({ ...formData, is_accepting_orders: e.target.checked })}
                />
                <div className="w-14 h-7 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>

          {!formData.is_accepting_orders && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3 text-yellow-500 text-sm">
              <Info className="h-5 w-5 shrink-0" />
              <p>Your store is currently closed. Customers will see a banner and will not be able to place orders.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Operating Hours"
              value={formData.operating_hours || ''}
              onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
              placeholder="e.g., Mon-Sun: 11 AM - 11 PM"
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            <Input
              label="Delivery Radius Info"
              value={formData.delivery_radius || ''}
              onChange={(e) => setFormData({ ...formData, delivery_radius: e.target.value })}
              placeholder="e.g., Up to 5km from shop"
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            <Input
              label="Minimum Order Amount (₹)"
              type="number"
              value={formData.min_order_amount || 0}
              onChange={(e) => setFormData({ ...formData, min_order_amount: parseInt(e.target.value) || 0 })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            <Input
              label="Delivery Charge (₹)"
              type="number"
              value={formData.delivery_charge || 0}
              onChange={(e) => setFormData({ ...formData, delivery_charge: parseInt(e.target.value) || 0 })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>
        </section>

        {/* Brand Info */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-white">Brand Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Brand Name"
              value={formData.brand_name || ''}
              onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            <Input
              label="Tagline"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>
          <Textarea
            label="Meta Description (SEO)"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-zinc-950 border-zinc-800 text-white"
            rows={2}
          />
        </section>

        {/* Contact Information */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-white">Contact & Socials</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            <Input
              label="WhatsApp Number (With Country Code, No '+')"
              value={formData.whatsapp_number || ''}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              placeholder="e.g., 919876543210"
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            <Input
              label="Instagram URL"
              value={formData.instagram_url || ''}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <Textarea
            label="Physical Address"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="bg-zinc-950 border-zinc-800 text-white"
            rows={2}
          />

          <Input
            label="Google Maps Embed URL"
            value={formData.google_maps_url || ''}
            onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
            className="bg-zinc-950 border-zinc-800 text-white"
          />
        </section>

      </div>
    </div>
  )
}
