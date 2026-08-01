'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MenuCategory } from '@/types'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  category: MenuCategory
  imageUrl?: string
  index?: number
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, imageUrl, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/menu#category-${category.id}`} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-zinc-900 border border-border">
          {imageUrl && (
            <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img
                src={imageUrl}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  // Minimal SVG fallback with category initial
                  target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="64" fill="%239ca3af">${category.name.charAt(0)}</text></svg>`
                }}
              />
            </div>
          )}
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
            {category.description && (
              <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                {category.description}
              </p>
            )}
            
            <div className="mt-4 flex items-center text-brand-primary font-medium text-sm">
              View Menu
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
