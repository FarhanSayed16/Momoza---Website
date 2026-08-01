'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { HeroSection as HeroSectionType } from '@/types'
import { getImageUrl } from '@/lib/utils'

interface HeroSectionProps {
  data: HeroSectionType | null
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const heading = data?.heading || 'Authentic Homemade Momos'
  const subheading = data?.subheading || 'Made fresh daily in our kitchen with love and the finest ingredients.'
  const ctaText = data?.cta_text || 'Order Now'
  const imageUrl = getImageUrl(data?.background_image || null, 'hero-images')

  return (
    <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden bg-brand-dark pt-[80px]">
      {/* Background Image & Overlay */}
      {imageUrl ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-brand-dark/90 z-10" />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            src={imageUrl} 
            alt="Momoza Hero" 
            className="absolute inset-0 h-full w-full object-cover"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary opacity-20 z-0" />
      )}
      
      <div className="container relative z-20 mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-block rounded-full bg-brand-primary/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md border border-brand-primary/30"
          >
            100% Authentic Homemade
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl font-sans drop-shadow-xl"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            {heading}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10 text-lg text-white/90 md:text-xl lg:text-2xl max-w-2xl mx-auto drop-shadow-md"
          >
            {subheading}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/menu">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-lg shadow-brand-primary/30">
                {ctaText}
              </Button>
            </Link>
            <Link href="/menu">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full text-white border-white/30 hover:bg-white/10 hover:border-white ring-white/50 backdrop-blur-sm">
                View Menu
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="h-8 w-8 text-white/70" />
        </motion.div>
      </motion.div>
    </section>
  )
}
