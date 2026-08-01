import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing config')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('hero_section')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    return successResponse(data)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing config')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { heading, subheading, cta_text, background_image, is_active, sort_order } = body
    const updates = { heading, subheading, cta_text, background_image, is_active, sort_order }
    Object.keys(updates).forEach(key => (updates as any)[key] === undefined && delete (updates as any)[key])

    const { data, error } = await supabase
      .from('hero_section')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    return successResponse(data)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
