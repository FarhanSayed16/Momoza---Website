'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

export const StoreClosedBanner = () => {
  const { settings } = useSiteSettings()

  if (!settings || settings.is_accepting_orders) return null

  return (
    <div className="bg-yellow-500 text-yellow-950 px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 sticky top-0 z-50">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>
        We are currently closed and not accepting new orders. Please check back later!
      </span>
    </div>
  )
}
