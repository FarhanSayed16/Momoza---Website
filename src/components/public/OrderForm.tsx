'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useCart } from '@/contexts/CartContext'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { formatCurrency } from '@/lib/utils'
import { buildOrderMessage, getWhatsAppUrl } from '@/lib/whatsapp'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

interface OrderFormProps {
  onSuccess?: () => void
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSuccess }) => {
  const { items, getTotal, clearCart } = useCart()
  const { settings } = useSiteSettings()

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    notes: '',
  })

  // Load saved customer info
  useEffect(() => {
    const savedInfo = localStorage.getItem('momoza-customer')
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo)
        setFormData(prev => ({
          ...prev,
          customerName: parsed.name || '',
          customerPhone: parsed.phone || '',
          deliveryAddress: parsed.address || '',
        }))
      } catch (e) {}
    }
  }, [])

  const subtotal = getTotal()
  const deliveryCharge = orderType === 'delivery' ? (settings?.delivery_charge || 0) : 0
  const totalAmount = subtotal + deliveryCharge
  const minOrder = settings?.min_order_amount || 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Restrict phone to numbers only
    if (name === 'customerPhone') {
      const numericValue = value.replace(/\D/g, '')
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.customerPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }
    if (orderType === 'delivery' && !formData.deliveryAddress.trim()) {
      toast.error('Please enter your delivery address')
      return
    }
    if (subtotal < minOrder) {
      toast.error(`Minimum order amount is ${formatCurrency(minOrder)}`)
      return
    }

    setIsSubmitting(true)

    try {
      // Save customer info
      localStorage.setItem('momoza-customer', JSON.stringify({
        name: formData.customerName,
        phone: formData.customerPhone,
        address: formData.deliveryAddress,
      }))

      // Prepare order payload
      const orderPayload = {
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        order_type: orderType,
        customer_address: orderType === 'delivery' ? formData.deliveryAddress : null,
        total_amount: totalAmount,
        status: 'pending',
        notes: formData.notes,
        items: items.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      }

      // POST to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      })

      if (!response.ok) {
        throw new Error('Failed to submit order')
      }

      const { data: orderData } = await response.json()

      // Save order ID for tracking
      localStorage.setItem('momoza-last-order', orderData.id)

      // Celebrate!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E63946', '#FFB703', '#2ECC71']
      })

      toast.success('Order placed successfully!')

      // Build WhatsApp message
      const customerInfo = {
        name: formData.customerName,
        phone: formData.customerPhone,
        address: orderType === 'delivery' ? formData.deliveryAddress : '',
        order_type: orderType === 'delivery' ? 'Delivery' as const : 'Pickup' as const
      }
      
      const baseUrl = window.location.origin
      const message = buildOrderMessage(
        items, 
        customerInfo, 
        totalAmount, 
        deliveryCharge, 
        `ORD-${orderData.id.slice(0, 5).toUpperCase()}`,
        orderData.id,
        baseUrl
      )
      const whatsappUrl = getWhatsAppUrl(settings?.whatsapp_number || '+919324826414', message)

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank')

      // Clear cart & close drawer
      clearCart()
      if (onSuccess) onSuccess()

      // Redirect to tracking page
      window.location.href = `/track/${orderData.id}`

    } catch (error) {
      console.error('Order error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Order Type Toggle */}
      <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => setOrderType('delivery')}
          className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
            orderType === 'delivery'
              ? 'bg-white text-brand-primary shadow-sm dark:bg-zinc-950'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          Delivery
        </button>
        <button
          type="button"
          onClick={() => setOrderType('pickup')}
          className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
            orderType === 'pickup'
              ? 'bg-white text-brand-primary shadow-sm dark:bg-zinc-950'
              : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          Pickup
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Your Name *"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
            placeholder="John Doe"
          />
          <Input
            label="Phone Number *"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            required
            placeholder="9876543210"
            maxLength={10}
            type="tel"
          />
        </div>

        <AnimatePresence>
          {orderType === 'delivery' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Textarea
                label="Delivery Address *"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                required={orderType === 'delivery'}
                placeholder="Full address with landmark"
                rows={3}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Textarea
          label="Order Notes (Optional)"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="e.g., Make it extra spicy!"
          rows={2}
        />
      </div>

      {/* Order Summary Box */}
      <div className="rounded-xl border border-border bg-gray-50 p-4 dark:bg-zinc-900/50">
        <h4 className="mb-3 font-bold text-foreground">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/70">Subtotal ({items.length} items)</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          {orderType === 'delivery' && (
            <div className="flex justify-between">
              <span className="text-foreground/70">Delivery Charge</span>
              <span className="font-semibold">{formatCurrency(deliveryCharge)}</span>
            </div>
          )}
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-bold">
            <span>Total to Pay</span>
            <span className="text-brand-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {subtotal < minOrder && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
          ⚠️ Minimum order amount is {formatCurrency(minOrder)}. Please add more items.
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={subtotal < minOrder || isSubmitting}
        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-6 text-lg rounded-full shadow-lg shadow-[#25D366]/30 border-none"
        leftIcon={isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
      >
        {isSubmitting ? 'Processing...' : 'Send Order via WhatsApp'}
      </Button>
    </form>
  )
}
