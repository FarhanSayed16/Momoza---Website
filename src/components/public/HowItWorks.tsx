'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Section } from '@/components/public/Section'
import { Search, MessageCircle, Utensils } from 'lucide-react'

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-brand-primary" />,
      title: 'Browse Menu',
      description: 'Explore our authentic homemade momos and combos.',
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-[#25D366]" />,
      title: 'Order on WhatsApp',
      description: 'Add to cart and send your order directly via WhatsApp.',
    },
    {
      icon: <Utensils className="h-8 w-8 text-brand-secondary" />,
      title: 'Enjoy Fresh Momos',
      description: 'Get hot, freshly steamed momos delivered to your door.',
    },
  ]

  return (
    <Section 
      title="How It Works" 
      subtitle="Getting your favorite momos is as easy as 1-2-3"
      className="bg-brand-bg dark:bg-zinc-900"
    >
      <div className="relative mt-8 md:mt-16">
        {/* Connecting Line (Desktop only) */}
        <div className="absolute top-12 left-[15%] right-[15%] hidden h-0.5 border-t-2 border-dashed border-border md:block" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl shadow-brand-primary/10 border-4 border-brand-bg">
                {/* Number Badge */}
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white shadow-md">
                  {index + 1}
                </div>
                {step.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="text-foreground/70">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
