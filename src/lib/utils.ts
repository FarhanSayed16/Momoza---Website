import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function truncateText(text: string | null | undefined, length: number): string {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export function getImageUrl(path: string | null, bucket: string = 'menu-images'): string {
  if (!path) return ''
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return path

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
