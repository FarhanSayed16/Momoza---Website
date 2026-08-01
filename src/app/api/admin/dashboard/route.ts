import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-response'
import { startOfDay, startOfWeek, startOfMonth, subDays } from 'date-fns'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    // Use service role for admin APIs since they are already protected by Next.js Middleware
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const now = new Date()
    const todayStr = startOfDay(now).toISOString()
    const weekStr = startOfWeek(now).toISOString()
    const monthStr = startOfMonth(now).toISOString()

    // 1. Fetch Orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) throw ordersError

    // Calculate Stats
    const todayOrders = orders.filter(o => o.created_at >= todayStr)
    const weekOrders = orders.filter(o => o.created_at >= weekStr)
    const monthOrders = orders.filter(o => o.created_at >= monthStr)

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total_amount, 0)
    const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total_amount, 0)
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total_amount, 0)

    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length

    // Unique Customers (by phone)
    const uniquePhones = new Set(orders.map(o => o.customer_phone))
    const totalCustomers = uniquePhones.size

    // Average Order Value (All time)
    const averageOrderValue = orders.length > 0 
      ? Math.round(orders.reduce((sum, o) => sum + o.total_amount, 0) / orders.length)
      : 0

    // Item Sales Calculation
    const itemSales: Record<string, { count: number, name: string }> = {}
    
    orders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          // Assuming item has menu_item_id and quantity (as sent by our OrderForm)
          const id = item.menu_item_id || item.id
          if (!id) return
          
          if (!itemSales[id]) {
            itemSales[id] = { count: 0, name: item.name || `Item ${id}` }
          }
          itemSales[id].count += item.quantity || 1
        })
      }
    })

    // Sort to get top 5 items
    const topItems = Object.values(itemSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const recentOrders = orders.slice(0, 10)

    // Fetch Settings for toggle
    const { data: settings } = await supabase
      .from('site_settings')
      .select('id, is_accepting_orders')
      .single()

    return successResponse({
      todayOrders: todayOrders.length,
      todayRevenue,
      weekOrders: weekOrders.length,
      weekRevenue,
      monthOrders: monthOrders.length,
      monthRevenue,
      totalCustomers,
      pendingOrdersCount,
      averageOrderValue,
      topItems,
      recentOrders,
      settings
    })

  } catch (error: any) {
    console.error('Dashboard API Error:', error)
    return errorResponse(error.message || 'Failed to fetch dashboard stats', 500)
  }
}
