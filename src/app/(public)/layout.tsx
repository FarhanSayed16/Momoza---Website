import React from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { WhatsAppButton } from '@/components/public/WhatsAppButton'
import { ScrollToTop } from '@/components/public/ScrollToTop'
import { PageTransition } from '@/components/public/PageTransition'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'
import { CartProvider } from '@/contexts/CartContext'
import { CartDrawer } from '@/components/public/CartDrawer'
import { createClient } from '@/lib/supabase-server'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let settings = null
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .single()
    settings = data
  } catch (error) {
    console.error('Failed to fetch site settings in layout', error)
  }

  return (
    <SiteSettingsProvider settings={settings}>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <PageTransition>
            <main className="flex-1 flex flex-col">{children}</main>
          </PageTransition>
          <Footer />
          <WhatsAppButton phoneNumber={settings?.whatsapp_number || undefined} />
          <ScrollToTop />
          <CartDrawer />
        </div>
      </CartProvider>
    </SiteSettingsProvider>
  )
}
