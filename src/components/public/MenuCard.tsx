'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MenuItem } from '@/types'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, Plus, Minus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

interface MenuCardProps {
  item: MenuItem
  index?: number
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, index = 0 }) => {
  const { items, addItem, updateQuantity } = useCart()
  const { settings } = useSiteSettings()
  const cartItem = items.find((i) => i.id === item.id)

  const isStoreOpen = settings?.is_accepting_orders !== false

  const imageUrl = getImageUrl(item.image_url) || '/images/placeholder-momo.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:bg-zinc-900 border border-border"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
        <img
          src={imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null
            target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%23f3f4f6"/></svg>'
          }}
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px] z-10">
            <span className="bg-black/80 text-white font-bold px-4 py-2 rounded-lg rotate-12 shadow-lg text-lg tracking-wider">
              SOLD OUT
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {item.is_bestseller && (
            <Badge variant="warning" className="shadow-sm">Bestseller</Badge>
          )}
          <Badge variant={item.is_vegetarian ? 'veg' : 'nonveg'} className="shadow-sm">
            {item.is_vegetarian ? 'Veg' : 'Non-Veg'}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
          <span className="text-lg font-bold text-brand-primary shrink-0">
            {formatCurrency(item.price)}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
          {item.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between mt-auto pt-4 border-t border-border">
          <span className="text-sm font-medium text-foreground/60 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
            {item.pieces} pieces
          </span>
          
          {cartItem && isStoreOpen ? (
            <div className="flex items-center gap-3 rounded-lg border border-border px-2 py-1 bg-gray-50 dark:bg-zinc-800">
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                className="text-foreground hover:text-brand-primary transition-colors p-1"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-4 text-center font-bold text-sm text-brand-primary">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                disabled={cartItem.quantity >= 20}
                className="text-foreground hover:text-brand-primary transition-colors disabled:opacity-50 p-1"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button 
              size="sm" 
              onClick={() => addItem(item)}
              leftIcon={<ShoppingBag className="h-4 w-4" />}
              disabled={!item.is_available || !isStoreOpen}
              variant={item.is_available && isStoreOpen ? 'primary' : 'ghost'}
              className="active:scale-[0.98] transition-transform"
            >
              {!isStoreOpen ? 'Paused' : item.is_available ? 'Add' : 'Sold Out'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
