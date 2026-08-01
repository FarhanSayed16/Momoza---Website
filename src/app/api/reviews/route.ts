import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customer_name,
      customer_phone,
      rating,
      review_text
    } = body

    // Basic validation
    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim() === '') {
      return errorResponse('Valid name is required', 400)
    }
    if (!review_text || typeof review_text !== 'string' || review_text.trim() === '' || review_text.length > 500) {
      return errorResponse('Valid review text (max 500 chars) is required', 400)
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return errorResponse('Rating must be between 1 and 5', 400)
    }

    // We use service role to bypass RLS since the public user is unauthenticated
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Rate limiting: 1 review per phone per day
    if (customer_phone) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { data: existingReviews, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('customer_phone', customer_phone)
        .gte('created_at', today.toISOString())
        
      if (checkError) {
        console.error('Error checking rate limit:', checkError)
        return errorResponse('Failed to verify request', 500)
      }
      
      if (existingReviews && existingReviews.length > 0) {
        return errorResponse('You can only submit one review per day.', 429)
      }
    }

    // Insert review
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          customer_name: customer_name.trim(),
          customer_phone: customer_phone || null,
          rating,
          review_text: review_text.trim(),
          is_approved: false,
          is_featured: false
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error inserting review:', error)
      return errorResponse(error.message, 500)
    }

    return successResponse(data, 201)
  } catch (error) {
    console.error('Review API error:', error)
    return errorResponse('Internal Server Error', 500)
  }
}
