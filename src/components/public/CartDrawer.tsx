'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { formatCurrency, getImageUrl } from '@/lib/utils'
import { OrderForm } from '@/components/public/OrderForm'
import Link from 'next/link'

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, getTotal } = useCart()
  const { settings } = useSiteSettings()
  const [showCheckout, setShowCheckout] = useState(false)

  // Reset view when closing
  const handleClose = () => {
    setIsCartOpen(false)
    setTimeout(() => setShowCheckout(false), 300)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-zinc-950"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-6">
              <div className="flex items-center gap-3">
                {showCheckout && (
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <h2 className="text-2xl font-bold font-sans flex items-center gap-2">
                  {!showCheckout && <ShoppingBag className="h-6 w-6 text-brand-primary" />}
                  {showCheckout ? 'Checkout' : 'Your Cart'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-zinc-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {showCheckout ? (
                <OrderForm onSuccess={handleClose} />
              ) : (
                <>
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary/10">
                        <ShoppingBag className="h-12 w-12 text-brand-primary/50" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold">Your cart is empty</h3>
                      <p className="mb-8 text-foreground/60">
                        Looks like you haven't added any momos yet!
                      </p>
                      <Link href="/menu" onClick={handleClose}>
                        <Button size="lg">Browse Menu</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b border-border pb-6 last:border-0 last:pb-0">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-900">
                            <img
                              src={getImageUrl(item.image_url) || '/images/placeholder-momo.jpg'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <h4 className="font-bold">{item.name}</h4>
                              <span className="font-bold text-brand-primary">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/60">
                              {formatCurrency(item.price)} each
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between pt-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3 rounded-lg border border-border px-2 py-1">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="text-foreground/60 hover:text-brand-primary transition-colors disabled:opacity-50"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-4 text-center font-semibold text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= 20}
                                  className="text-foreground/60 hover:text-brand-primary transition-colors disabled:opacity-50"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2"
                                title="Remove item"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer / Proceed to Checkout */}
            {!showCheckout && items.length > 0 && (
              <div className="border-t border-border bg-gray-50 p-6 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span className="text-brand-primary">{formatCurrency(getTotal())}</span>
                </div>
                <p className="mb-6 text-sm text-foreground/60">
                  Delivery charges will be calculated on WhatsApp.
                </p>
                <Button 
                  size="lg" 
                  className="w-full text-lg py-6"
                  onClick={() => setShowCheckout(true)}
                  disabled={settings?.is_accepting_orders === false}
                >
                  {settings?.is_accepting_orders === false ? 'Ordering Paused' : 'Proceed to Checkout'}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
