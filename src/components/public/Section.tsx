'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  subtitle?: string
  children: React.ReactNode
  containerClass?: string
  noPadding?: boolean
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, title, subtitle, children, containerClass, noPadding = false, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(noPadding ? '' : 'py-16 md:py-24', className)}
        {...props}
      >
        <div className={cn('container mx-auto px-4 md:px-6', containerClass)}>
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center md:mb-16"
            >
              {title && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl font-sans">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
                  {subtitle}
                </p>
              )}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </section>
    )
  }
)

Section.displayName = 'Section'
