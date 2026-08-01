'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, Clock, ChefHat, PackageCheck, XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'

interface TrackedOrder {
  id: string
  created_at: string
  status: OrderStatus
  total_amount: number
  order_type: 'Delivery' | 'Pickup'
  customer_name: string
  items: any[]
}

const steps: { status: OrderStatus; label: string; icon: any }[] = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { status: 'preparing', label: 'Preparing', icon: ChefHat },
  { status: 'delivered', label: 'Completed', icon: PackageCheck },
]

export default function TrackOrderPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`)
      const json = await res.json()
      if (json.success && json.data) {
        setOrder(json.data)
        setError(null)
        
        // If order is completed or cancelled, clear the memory so the Navbar button disappears
        if (json.data.status === 'delivered' || json.data.status === 'cancelled') {
          localStorage.removeItem('momoza-last-order')
        }
      } else {
        setError('Order not found')
      }
    } catch (err) {
      setError('Failed to fetch order status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
    const interval = setInterval(fetchOrder, 15000) // Poll every 15 seconds
    return () => clearInterval(interval)
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <p className="mt-4 text-foreground/70">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center px-4 text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Order Not Found</h2>
        <p className="mt-2 text-foreground/70">The order ID is invalid or the order has been removed.</p>
        <Link href="/menu" className="mt-8">
          <Button variant="primary">Return to Menu</Button>
        </Link>
      </div>
    )
  }

  const currentStepIndex = steps.findIndex(s => s.status === order.status)
  
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-white p-6 shadow-sm dark:bg-zinc-900 md:p-8"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground">Track Your Order</h1>
          <p className="mt-2 text-foreground/70">
            Order ID: <span className="font-mono text-brand-primary">ORD-{order.id.slice(0, 5).toUpperCase()}</span>
          </p>
        </div>

        {order.status === 'cancelled' ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-900/20 mb-10">
            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Order Cancelled</h3>
            <p className="text-red-600 dark:text-red-300 mt-1">Please contact us via WhatsApp if you need assistance.</p>
          </div>
        ) : (
          <div className="relative mb-12">
            {/* Progress Bar Background */}
            <div className="absolute left-[10%] right-[10%] top-6 h-1 bg-gray-200 dark:bg-zinc-800 hidden sm:block">
               <div 
                 className="h-full bg-brand-primary transition-all duration-1000 ease-in-out" 
                 style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }} 
               />
            </div>

            <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex
                const isActive = index === currentStepIndex
                const Icon = step.icon

                return (
                  <div key={step.status} className="flex sm:flex-col items-center gap-4 sm:gap-2 z-10 relative">
                    {/* Mobile vertical progress line */}
                    {index !== steps.length - 1 && (
                      <div className={`absolute left-6 top-12 bottom-[-24px] w-0.5 sm:hidden ${isCompleted ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-zinc-800'}`} />
                    )}

                    <div 
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-4 shrink-0 transition-colors duration-500 ${
                        isCompleted 
                          ? 'border-brand-primary bg-brand-primary text-white' 
                          : 'border-gray-100 bg-white text-gray-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600'
                      } ${isActive ? 'ring-4 ring-brand-primary/20 shadow-lg' : ''}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-semibold sm:text-center ${isActive ? 'text-brand-primary' : isCompleted ? 'text-foreground' : 'text-foreground/40'}`}>
                        {step.label}
                      </p>
                      {isActive && (
                         <p className="text-xs text-brand-primary sm:text-center mt-1 sm:mt-0 animate-pulse">
                           {step.status === 'pending' ? 'Waiting for restaurant...' : 
                            step.status === 'confirmed' ? 'Restaurant accepted!' :
                            step.status === 'preparing' ? 'Making your food...' : 
                            'Enjoy your meal!'}
                         </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-gray-50 p-6 dark:bg-zinc-950/50">
          <h3 className="mb-4 text-lg font-bold text-foreground">Order Details</h3>
          <div className="space-y-3">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-start text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold text-foreground">{item.quantity}x</span>
                  <span className="text-foreground/80">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            
            <div className="my-4 border-t border-border" />
            
            <div className="flex justify-between font-bold text-foreground text-lg">
              <span>Total</span>
              <span className="text-brand-primary">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <p className="text-sm text-foreground/50 text-center max-w-sm">
            This page updates automatically. We've also sent you a WhatsApp link with these details.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
