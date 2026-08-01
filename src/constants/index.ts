import { OrderStatus } from '@/types'

export const ORDER_STATUSES: { label: string; value: OrderStatus; color: string }[] = [
  { label: 'Pending', value: 'pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { label: 'Confirmed', value: 'confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { label: 'Preparing', value: 'preparing', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { label: 'Delivered', value: 'delivered', color: 'bg-green-100 text-green-800 border-green-200' },
  { label: 'Cancelled', value: 'cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
]

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'About', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
]

export const IMAGE_CONFIG = {
  maxSizeMB: 5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  initialQuality: 0.8,
  fileType: 'image/webp',
}

export const WHATSAPP_GREETING = "Hi Momoza! I'd like to know more about your menu."

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Menu', href: '/admin/menu', icon: 'Menu' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingBag' },
  { label: 'Reviews', href: '/admin/reviews', icon: 'Star' },
  { label: 'Hero & Slides', href: '/admin/hero', icon: 'Image' },
  { label: 'About', href: '/admin/about', icon: 'Info' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
]
