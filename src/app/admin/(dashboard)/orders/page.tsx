'use client'

import React, { useEffect, useState } from 'react'
import { Search, Loader2, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { LoadingSpinner } from '@/components/admin/LoadingSpinner'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { OrderDetail } from '@/components/admin/OrderDetail'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { Download, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Bulk Delete
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const fetchOrders = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin/orders')
      const json = await res.json()
      if (json.success) {
        setOrders(json.data)
        
        // Update selected order if it's currently open
        if (selectedOrder) {
          const updated = json.data.find((o: any) => o.id === selectedOrder.id)
          if (updated) setSelectedOrder(updated)
        }
      }
    } catch (error) {
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    // Auto refresh every 30 seconds
    const interval = setInterval(() => fetchOrders(false), 30000)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export')
      return
    }

    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Type', 'Status', 'Total Amount', 'Notes']
    
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => {
        return [
          order.id,
          new Date(order.created_at).toLocaleString().replace(/,/g, ''),
          `"${order.customer_name}"`,
          order.customer_phone,
          `"${order.customer_address || ''}"`,
          order.order_type,
          order.status,
          order.total_amount,
          `"${order.notes || ''}"`
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `momoza_orders_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported ${filteredOrders.length} orders`)
  }

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true)
    try {
      // Calculate 30 days ago
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const res = await fetch(`/api/admin/orders/bulk-delete?before=${thirtyDaysAgo.toISOString()}`, {
        method: 'DELETE'
      })
      const json = await res.json()
      
      if (json.success) {
        toast.success(json.message || 'Old orders deleted')
        fetchOrders(true)
      } else {
        throw new Error(json.error)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete old orders')
    } finally {
      setIsBulkDeleting(false)
      setIsBulkDeleteOpen(false)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6 pb-12 h-[calc(100vh-120px)] flex flex-col">
      <PageHeader 
        title="Orders" 
        description="Manage incoming orders and update their statuses."
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={() => fetchOrders(true)}
              disabled={isRefreshing}
              leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>
        }
      />

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col flex-1 min-h-0 overflow-hidden shadow-sm">
        
        {/* Filters Bar */}
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between bg-zinc-950/50">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['all', 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  statusFilter === status 
                    ? 'bg-brand-primary text-white' 
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-xl bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-500 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => { setSelectedOrder(order); setIsDetailOpen(true) }}
                    className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-300 group-hover:text-brand-primary transition-colors">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-200 font-medium">{order.customer_name}</div>
                      <div className="text-xs">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${order.order_type === 'Delivery' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'}`}>
                        {order.order_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-200 text-right">
                      {formatCurrency(order.total_amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>No orders found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetail 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
        onUpdate={() => fetchOrders(false)}
      />

      <div className="flex justify-end pt-4">
        <Button 
          variant="outline" 
          onClick={() => setIsBulkDeleteOpen(true)}
          className="text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          leftIcon={<Trash2 className="h-4 w-4" />}
        >
          Delete Orders Older Than 30 Days
        </Button>
      </div>

      <ConfirmDialog 
        isOpen={isBulkDeleteOpen}
        title="Delete Old Orders"
        message="Are you sure you want to delete all orders older than 30 days? This action cannot be undone."
        isDestructive
        confirmText={isBulkDeleting ? "Deleting..." : "Delete Old Orders"}
        onConfirm={handleBulkDelete}
        onCancel={() => setIsBulkDeleteOpen(false)}
      />
    </div>
  )
}
