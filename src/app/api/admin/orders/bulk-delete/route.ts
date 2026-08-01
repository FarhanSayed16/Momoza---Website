import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const beforeDate = searchParams.get('before')

    if (!beforeDate) {
      return errorResponse('Missing before date parameter', 400)
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing config')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Delete orders older than the specified date
    const { error } = await supabase
      .from('orders')
      .delete()
      .lt('created_at', new Date(beforeDate).toISOString())

    if (error) throw error

    return successResponse({ success: true, message: 'Old orders deleted successfully' })
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
