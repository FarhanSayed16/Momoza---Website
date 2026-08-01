'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { MessageCircle } from 'lucide-react'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { WHATSAPP_GREETING } from '@/constants'

export const CTABanner = () => {
  const { settings } = useSiteSettings()
  const whatsappUrl = getWhatsAppUrl(settings?.whatsapp_number || '+919324826414', WHATSAPP_GREETING)

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand-primary to-red-800 py-16 md:py-24">
      {/* Background Pattern/Overlay */}
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
      
      {/* Decorative Circles */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-brand-secondary/20 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
            Craving Momos? <br className="hidden md:block" /> Order Now! 🥟
          </h2>
          <p className="mb-10 text-lg text-white/90 md:text-xl drop-shadow-sm">
            Freshly steamed, authentic homemade momos are just a message away.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button 
                size="lg" 
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-xl shadow-[#25D366]/30 text-lg py-6 px-8 rounded-full"
                leftIcon={<MessageCircle className="h-6 w-6" />}
              >
                Order on WhatsApp
              </Button>
            </a>
            
            <Link href="/menu" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full text-white border-white/30 hover:bg-white/20 hover:border-white ring-white/50 text-lg py-6 px-8 rounded-full backdrop-blur-sm"
              >
                View Full Menu
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
