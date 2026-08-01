'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuItem, MenuCategory } from '@/types'
import { MenuCard } from '@/components/public/MenuCard'
import { cn } from '@/lib/utils'

interface MenuGridProps {
  items: MenuItem[]
  categories: MenuCategory[]
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items, categories }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === activeCategory)

  return (
    <div>
      {/* Category Tabs */}
      <div className="sticky top-[72px] z-40 bg-background/90 backdrop-blur-md pt-4 pb-4 mb-8 border-b border-border shadow-sm -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-4 md:justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              "relative whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0",
              activeCategory === 'all' 
                ? "text-white" 
                : "text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800"
            )}
          >
            {activeCategory === 'all' && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-brand-primary rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            All Momos
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "relative whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors shrink-0",
                activeCategory === category.id 
                  ? "text-white" 
                  : "text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800"
              )}
            >
              {activeCategory === category.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-brand-primary rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4 text-2xl">
            🥟
          </div>
          <h3 className="text-xl font-bold mb-2">No items found</h3>
          <p className="text-foreground/60">We don't have any items in this category right now.</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <MenuCard item={item} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
