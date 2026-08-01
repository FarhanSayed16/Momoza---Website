import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-response'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const oldImageUrl = formData.get('oldImageUrl') as string | null

    if (!file) {
      return errorResponse('No file provided', 400)
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Only JPEG, PNG, and WebP are allowed.', 400)
    }

    // Validate file size (Max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return errorResponse('File size exceeds 5MB limit.', 400)
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing config')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Delete old image if provided
    if (oldImageUrl) {
      try {
        const urlObj = new URL(oldImageUrl)
        const pathParts = urlObj.pathname.split('/')
        const bucketIndex = pathParts.indexOf('menu-images')
        if (bucketIndex !== -1) {
          const oldFilePath = pathParts.slice(bucketIndex + 1).join('/')
          if (oldFilePath) {
            await supabase.storage.from('menu-images').remove([oldFilePath])
          }
        }
      } catch (e) {
        console.warn('Failed to delete old image:', e)
        // Non-fatal, continue with upload
      }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName)

    return successResponse({ url: publicUrlData.publicUrl }, 201)
  } catch (error: any) {
    console.error('Upload API Error:', error)
    return errorResponse(error.message || 'Failed to upload image', 500)
  }
}
