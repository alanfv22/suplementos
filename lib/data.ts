import { supabase, isSupabaseConfigured, type Store, type Category, type Brand, type ProductWithRelations } from './supabase'

export async function getStore(): Promise<Store | null> {
  if (!isSupabaseConfigured || !supabase) return null

  const storeId = process.env.NEXT_PUBLIC_STORE_ID
  if (!storeId) {
    console.error('NEXT_PUBLIC_STORE_ID no está definido')
    return null
  }

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', storeId)
    .single()

  if (error) {
    console.error('Error fetching store:', error)
    return null
  }

  return data
}

// Get all categories for a store
export async function getCategories(storeId?: string): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) return []

  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (storeId) {
    query = query.eq('store_id', storeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

// Get all brands for a store
export async function getBrands(storeId?: string): Promise<Brand[]> {
  if (!isSupabaseConfigured || !supabase) return []

  let query = supabase
    .from('brands')
    .select('*')
    .order('sort_order', { ascending: true })

  if (storeId) {
    query = query.eq('store_id', storeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data || []
}

// Get products with filters
export interface ProductFilters {
  categoryId?: string
  categorySlug?: string
  brandId?: string
  brandSlug?: string
  sortBy?: 'price_asc' | 'price_desc' | 'name'
  limit?: number
}

export async function getProductsFiltered(
  storeId?: string,
  filters: ProductFilters = {}
): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured || !supabase) return []

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .eq('active', true)

  if (storeId) {
    query = query.eq('store_id', storeId)
  }

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  if (filters.brandId) {
    query = query.eq('brand_id', filters.brandId)
  }

  // Apply sorting
  if (filters.sortBy === 'price_asc') {
    query = query.order('base_price', { ascending: true })
  } else if (filters.sortBy === 'price_desc') {
    query = query.order('base_price', { ascending: false })
  } else {
    query = query.order('sort_order', { ascending: true })
  }

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

// Get a single product by ID
export async function getProductById(productId: string): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured || !supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .eq('id', productId)
    .eq('active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

// Get featured products (first N products)
export async function getFeaturedProducts(storeId?: string, limit: number = 8): Promise<ProductWithRelations[]> {
  return getProductsFiltered(storeId, { limit })
}

// Get related products (same category, excluding current product)
export async function getRelatedProducts(
  storeId: string | undefined,
  productId: string,
  categoryId: string | null,
  limit: number = 4
): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured || !supabase) return []

  if (!categoryId) {
    return getProductsFiltered(storeId, { limit })
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      variants:product_variants(*),
      images:product_images(*)
    `)
    .eq('category_id', categoryId)
    .eq('active', true)
    .neq('id', productId)
    .limit(limit)

  if (storeId) {
    query = query.eq('store_id', storeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching related products:', error)
    return []
  }

  return data || []
}

// Get category by slug
export async function getCategoryBySlug(storeId: string | undefined, slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured || !supabase) return null

  let query = supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (storeId) {
    query = supabase
      .from('categories')
      .select('*')
      .eq('store_id', storeId)
      .eq('slug', slug)
      .single()
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

// Get brand by slug
export async function getBrandBySlug(storeId: string | undefined, slug: string): Promise<Brand | null> {
  if (!isSupabaseConfigured || !supabase) return null

  let query = supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single()

  if (storeId) {
    query = supabase
      .from('brands')
      .select('*')
      .eq('store_id', storeId)
      .eq('slug', slug)
      .single()
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching brand:', error)
    return null
  }

  return data
}
