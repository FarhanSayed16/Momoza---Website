import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, MessageCircle, MapPin, Loader2, Printer, Copy, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface OrderDetailProps {
  order: any | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export const OrderDetail = ({ order, isOpen, onClose, onUpdate }: OrderDetailProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!order) return null

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update status')
      toast.success(`Order marked as ${newStatus}`)
      onUpdate()
    } catch (error) {
      toast.error('Error updating order')
    } finally {
      setIsUpdating(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(order.customer_address || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Address copied')
  }

  const handlePrint = () => {
    // In a real app, you might generate a PDF or open a new window styled for printing
    window.print()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm print:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col print:relative print:w-full print:max-w-none print:border-none print:shadow-none print:bg-white print:text-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0 print:border-black print:pb-4">
              <div>
                <h2 className="text-xl font-bold text-white print:text-black flex items-center gap-3">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                  <span className="print:hidden"><StatusBadge status={order.status} /></span>
                </h2>
                <p className="text-sm text-zinc-400 print:text-black mt-1">
                  {format(new Date(order.created_at), 'PPP ')} at {format(new Date(order.created_at), 'p')}
                </p>
              </div>
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 print:p-0 print:space-y-4">
              
              {/* Customer Info */}
              <div className="space-y-4 border border-zinc-800 rounded-xl p-4 bg-zinc-950/50 print:border-black print:rounded-none">
                <h3 className="font-semibold text-white print:text-black uppercase text-xs tracking-wider">Customer Details</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-lg font-bold text-zinc-100 print:text-black">{order.customer_name}</div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-zinc-300 print:text-black">
                    <Phone className="h-4 w-4 text-zinc-500 print:hidden" />
                    <span>{order.customer_phone}</span>
                    <div className="flex gap-2 ml-auto print:hidden">
                      <a href={`tel:${order.customer_phone}`} className="p-1.5 bg-zinc-800 rounded-md text-brand-primary hover:bg-zinc-700">
                        <Phone className="h-4 w-4" />
                      </a>
                      <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${order.customer_phone.replace(/\D/g,'')}?text=Hi ${order.customer_name}, regarding your Momoza order...`} className="p-1.5 bg-green-500/10 rounded-md text-green-500 hover:bg-green-500/20">
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-zinc-300 print:text-black">
                    <MapPin className="h-4 w-4 text-zinc-500 mt-1 print:hidden" />
                    <span className="flex-1 text-sm">{order.customer_address}</span>
                    <button onClick={copyAddress} className="p-1.5 bg-zinc-800 rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-white print:hidden">
                      {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white print:text-black uppercase text-xs tracking-wider">Order Items</h3>
                <div className="border border-zinc-800 rounded-xl overflow-hidden print:border-black print:border-t print:border-b print:rounded-none">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-800/50 text-zinc-400 print:bg-transparent print:text-black print:border-b print:border-black">
                      <tr>
                        <th className="px-4 py-3 font-medium">Item</th>
                        <th className="px-4 py-3 font-medium text-center">Qty</th>
                        <th className="px-4 py-3 font-medium text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800 print:divide-black">
                      {order.items.map((item: any, idx: number) => (
                        <tr key={idx} className="text-zinc-200 print:text-black">
                          <td className="px-4 py-3">
                            <div className="font-medium">{item.name}</div>
                            {item.notes && <div className="text-xs text-brand-primary mt-0.5">{item.notes}</div>}
                          </td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-zinc-950 p-4 border-t border-zinc-800 print:bg-transparent print:border-black space-y-2">
                    <div className="flex justify-between text-zinc-400 print:text-black text-sm">
                      <span>Items Subtotal</span>
                      <span>{formatCurrency(order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0))}</span>
                    </div>
                    {order.order_type === 'Delivery' && (
                      <div className="flex justify-between text-zinc-400 print:text-black text-sm">
                        <span>Delivery Charge</span>
                        <span>{formatCurrency(order.total_amount - order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0))}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white print:text-black font-bold text-lg pt-2 border-t border-zinc-800 print:border-black">
                      <span>Total ({order.order_type})</span>
                      <span className="text-brand-primary print:text-black">{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Actions (Hidden on Print) */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-900 print:hidden flex flex-col gap-3">
              <h3 className="font-semibold text-white uppercase text-xs tracking-wider mb-2">Update Status</h3>
              
              {isUpdating ? (
                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {order.status === 'pending' && (
                    <Button onClick={() => handleStatusUpdate('confirmed')} className="bg-blue-600 hover:bg-blue-700">
                      Confirm Order
                    </Button>
                  )}
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <Button onClick={() => handleStatusUpdate('preparing')} className="bg-orange-600 hover:bg-orange-700">
                      Mark Preparing
                    </Button>
                  )}
                  {(order.status === 'preparing') && (
                    <Button onClick={() => handleStatusUpdate('delivered')} className="bg-green-600 hover:bg-green-700">
                      Mark Delivered
                    </Button>
                  )}
                  
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <Button variant="outline" onClick={() => handleStatusUpdate('cancelled')} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 border-red-500/50">
                      Cancel Order
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
