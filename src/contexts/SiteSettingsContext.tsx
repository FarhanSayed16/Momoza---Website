'use client'

import React, { createContext, useContext } from 'react'
import { SiteSettings } from '@/types'

interface SiteSettingsContextType {
  settings: SiteSettings | null
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
})

export const useSiteSettings = () => useContext(SiteSettingsContext)

export const SiteSettingsProvider = ({
  settings,
  children,
}: {
  settings: SiteSettings | null
  children: React.ReactNode
}) => {
  return (
    <SiteSettingsContext.Provider value={{ settings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
