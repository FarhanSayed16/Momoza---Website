'use client'

import React, { useEffect, useState } from 'react'
import { 
  ShoppingBag, 
  IndianRupee, 
  Users, 
  TrendingUp, 
  Clock,
  PackageCheck
} from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { LoadingSpinner } from '@/components/admin/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

// We will use Recharts for the revenue chart
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface DashboardData {
  todayOrders: number
  todayRevenue: number
  weekOrders: number
  weekRevenue: number
  monthOrders: number
  monthRevenue: number
  totalCustomers: number
  pendingOrdersCount: number
  averageOrderValue: number
  topItems: { count: number, name: string }[]
  recentOrders: any[]
  settings: { id: string, is_accepting_orders: boolean } | null
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      const json = await res.json()
      if (json.success) {
        setData(json.data)
      } else {
        toast.error('Failed to load dashboard stats')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error fetching dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading || !data) {
    return <LoadingSpinner />
  }

  const handleToggleStore = async () => {
    if (!data.settings) return
    setIsToggling(true)
    try {
      const newStatus = !data.settings.is_accepting_orders
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: data.settings.id,
          is_accepting_orders: newStatus
        })
      })
      
      const json = await res.json()
      if (json.success) {
        setData({
          ...data,
          settings: { ...data.settings, is_accepting_orders: newStatus }
        })
        toast.success(newStatus ? 'Store is now OPEN for orders' : 'Store is now CLOSED')
      } else {
        throw new Error(json.error)
      }
    } catch (error) {
      toast.error('Failed to toggle store status')
    } finally {
      setIsToggling(false)
    }
  }

  // Generate fake chart data based on weekly revenue for visual purposes 
  // (In a real app, the API would return daily aggregations)
  const chartData = [
    { name: 'Mon', revenue: Math.round(data.weekRevenue * 0.1) },
    { name: 'Tue', revenue: Math.round(data.weekRevenue * 0.15) },
    { name: 'Wed', revenue: Math.round(data.weekRevenue * 0.12) },
    { name: 'Thu', revenue: Math.round(data.weekRevenue * 0.18) },
    { name: 'Fri', revenue: Math.round(data.weekRevenue * 0.25) },
    { name: 'Sat', revenue: Math.round(data.weekRevenue * 0.1) },
    { name: 'Sun', revenue: data.todayRevenue },
  ]

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title={`${greeting()}, ${user?.email?.split('@')[0] || 'Admin'}!`}
        description="Here is what's happening with your store today."
        action={
          <div className="flex gap-3">
            <Link href="/admin/menu">
              <Button variant="outline">Manage Menu</Button>
            </Link>
            <Link href="/admin/orders">
              <Button>
                View Orders
                {data.pendingOrdersCount > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-primary">
                    {data.pendingOrdersCount}
                  </span>
                )}
              </Button>
            </Link>
            {data.settings && (
              <Button 
                variant={data.settings.is_accepting_orders ? "primary" : "danger"}
                onClick={handleToggleStore}
                disabled={isToggling}
                className={data.settings.is_accepting_orders ? "bg-green-600 hover:bg-green-700 text-white" : ""}
              >
                {isToggling ? "Updating..." : (data.settings.is_accepting_orders ? "Store Open" : "Store Closed")}
              </Button>
            )}
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Today's Revenue" 
          value={formatCurrency(data.todayRevenue)} 
          icon={<IndianRupee className="h-5 w-5" />}
          trend={12}
          trendLabel="vs yesterday"
        />
        <StatsCard 
          title="Today's Orders" 
          value={data.todayOrders} 
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={8}
          trendLabel="vs yesterday"
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={formatCurrency(data.monthRevenue)} 
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatsCard 
          title="Total Customers" 
          value={data.totalCustomers} 
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-white mb-6">Revenue This Week</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '12px' }}
                  itemStyle={{ color: '#EA580C' }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-brand-primary" />
            Top Selling Items
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {data.topItems.length > 0 ? (
              <div className="space-y-4">
                {data.topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b border-zinc-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                        {index + 1}
                      </div>
                      <span className="font-medium text-zinc-200">{item.name}</span>
                    </div>
                    <div className="text-brand-primary font-bold bg-brand-primary/10 px-3 py-1 rounded-full text-sm">
                      {item.count} sold
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500">
                No sales data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-primary" />
            Recent Orders
          </h3>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-300">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-zinc-200">{order.customer_name}</div>
                      <div className="text-xs">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4">{order.order_type}</td>
                    <td className="px-6 py-4 font-medium text-zinc-200">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
