export interface SiteSettings {
  id: string
  brand_name: string
  tagline: string
  description: string
  phone: string
  whatsapp_number: string
  email: string
  address: string
  delivery_radius: string
  operating_hours: string
  instagram_url: string
  google_maps_url: string
  min_order_amount: number
  delivery_charge: number
  is_accepting_orders: boolean
  updated_at: string
}

export interface HeroSection {
  id: string
  heading: string
  subheading: string
  cta_text: string
  background_image: string | null
  is_active: boolean
  sort_order: number
}

export interface MenuCategory {
  id: string
  name: string
  description: string | null
  image_url?: string | null
  sort_order: number
  is_active: boolean
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  pieces: number
  image_url: string | null
  is_vegetarian: boolean
  is_bestseller: boolean
  is_available: boolean
  sort_order: number
  updated_at: string
  created_at: string
}

export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[]
}

export interface Slide {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_url: string | null
  is_active: boolean
  sort_order: number
}

export interface Review {
  id: string
  customer_name: string
  customer_phone: string | null
  rating: number
  review_text: string
  is_approved: boolean
  is_featured: boolean
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string // Refers to MenuItem.id
  name: string
  price: number
  quantity: number
  pieces: number
  is_vegetarian: boolean
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string | null
  order_type: 'Delivery' | 'Pickup'
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  notes: string | null
  created_at: string
}

export interface AboutSection {
  id: string
  title: string
  story: string
  image_url: string | null
  highlights: { title: string; description: string; icon: string }[]
  updated_at: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  monthRevenue: number
  totalCustomers: number
  pendingOrdersCount: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: number
}

export interface CustomerInfo {
  name: string
  phone: string
  address: string
  notes?: string
  order_type: 'Delivery' | 'Pickup'
}

