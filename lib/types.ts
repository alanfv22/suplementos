// Database types matching Supabase schema
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
  // Joined relations
  category?: Category | null
  brand?: Brand | null
  images?: ProductImage[]
  variants?: ProductVariant[]
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

// Cart types
export interface CartItem {
  product: Product
  variant: ProductVariant
  quantity: number
}

// Filter types
export interface ProductFilters {
  categorySlug?: string
  brandSlug?: string
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'
  search?: string
}
