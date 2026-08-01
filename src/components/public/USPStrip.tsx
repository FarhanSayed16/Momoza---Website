'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Clock, DollarSign, Bike } from 'lucide-react'

export const USPStrip = () => {
  const usps = [
    { icon: <Heart className="h-6 w-6 text-brand-primary" />, text: 'Homemade' },
    { icon: <Clock className="h-6 w-6 text-brand-secondary" />, text: 'Fresh Daily' },
    { icon: <DollarSign className="h-6 w-6 text-green-600" />, text: '₹45 Onwards' },
    { icon: <Bike className="h-6 w-6 text-brand-primary" />, text: 'Free Delivery' },
  ]

  return (
    <div className="bg-brand-bg dark:bg-zinc-900 border-b border-border py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 divide-x-0 md:divide-x divide-border">
          {usps.map((usp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-center gap-3 py-2 md:py-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-border/50">
                {usp.icon}
              </div>
              <span className="font-semibold text-foreground md:text-lg">{usp.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
