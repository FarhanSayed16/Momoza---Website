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
      .from('about_section')
      .select('*')
      .single()

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

    const { title, story, image_url, highlights } = body
    const updates = { title, story, image_url, highlights }
    Object.keys(updates).forEach(key => (updates as any)[key] === undefined && delete (updates as any)[key])

    const { data, error } = await supabase
      .from('about_section')
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
