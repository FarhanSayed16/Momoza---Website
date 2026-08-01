import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing config')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch categories and items
    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (catError) throw catError

    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true })

    if (itemsError) throw itemsError

    return successResponse({ categories, items })
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing config')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('menu_items')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return successResponse(data, 201)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
