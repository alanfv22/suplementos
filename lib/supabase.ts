import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create client only if configured - use a dummy client for type safety
let supabaseInstance: SupabaseClient | null = null

if (isSupabaseConfigured) {
  supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!)
}

export const supabase = supabaseInstance

// Types based on database schema
export interface Store {
  id: string
  name: string
  slug: string
  whatsapp_number: string
  whatsapp_message_template: string
  primary_color: string
  logo_url: string
  active: boolean
  created_at: string
}

export interface Category {
  id: string
  store_id: string
  name: string
  slug: string
  icon_url: string | null
  sort_order: number
}

export interface Brand {
  id: string
  store_id: string
  name: string
  slug: string
  logo_url: string | null
  sort_order: number
}

export interface Product {
  id: string
  store_id: string
  category_id: string | null
  brand_id: string | null
  name: string
  description: string
  base_price: number
  active: boolean
  sort_order: number
}

export interface ProductVariant {
  id: string
  product_id: string
  label: string
  price_override: number | null
  stock: number
  active: boolean
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_primary: boolean
  sort_order: number
}

// Extended types with relations
export interface ProductWithRelations extends Product {
  category: Category | null
  brand: Brand | null
  variants: ProductVariant[]
  images: ProductImage[]
}

// Cart types
export interface CartItem {
  product: ProductWithRelations
  variant: ProductVariant
  quantity: number
}
