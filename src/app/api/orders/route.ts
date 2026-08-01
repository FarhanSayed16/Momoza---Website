import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customer_name,
      customer_phone,
      customer_address,
      order_type,
      total_amount,
      notes,
      items
    } = body

    // Server-side validation
    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim() === '') {
      return errorResponse('Valid name is required', 400)
    }
    if (!customer_phone || typeof customer_phone !== 'string' || !/^\d{10}$/.test(customer_phone.replace(/\D/g, ''))) {
      return errorResponse('Valid 10-digit phone number is required', 400)
    }
    if (order_type === 'Delivery' && (!customer_address || typeof customer_address !== 'string' || customer_address.trim() === '')) {
      return errorResponse('Delivery address is required', 400)
    }
    if (typeof total_amount !== 'number' || total_amount <= 0) {
      return errorResponse('Valid total amount is required', 400)
    }
    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse('Order must contain at least one item', 400)
    }

    // We use service role to bypass RLS since the public user is unauthenticated
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert order
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: customer_name.trim(),
          customer_phone: customer_phone.replace(/\D/g, ''),
          customer_address: customer_address?.trim() || null,
          order_type,
          total_amount,
          notes: notes?.trim() || null,
          items, // Stored as JSONB
          status: 'pending'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error inserting order:', error)
      return errorResponse(error.message, 500)
    }

    return successResponse(data, 201)
  } catch (error) {
    console.error('Order API error:', error)
    return errorResponse('Internal Server Error', 500)
  }
}
