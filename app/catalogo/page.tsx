import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getStore, getCategories, getBrands, getProductsFiltered, type ProductFilters } from '@/lib/data'
import { CatalogClient } from '@/components/catalog-client'
import { ProductCardSkeleton } from '@/components/product-card'

export const metadata: Metadata = {
  title: 'Catálogo | PowerFuel - Suplementos Deportivos',
  description: 'Explorá nuestro catálogo completo de suplementos deportivos. Proteínas, creatina, pre-entrenos y más. Filtrá por categoría y marca.',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    categoria?: string
    marca?: string
    orden?: string
  }>
}

function ProductsLoadingSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams
  const store = await getStore()

  if (!store) {
    return (
      <CatalogClient
        store={null}
        categories={[]}
        brands={[]}
        products={[]}
        currentFilters={{}}
      />
    )
  }

  // Fetch all data
  const [categories, brands] = await Promise.all([
    getCategories(store.id),
    getBrands(store.id),
  ])

  // Build filters from search params
  const filters: ProductFilters = {}
  
  if (params.categoria) {
    const category = categories.find(c => c.slug === params.categoria)
    if (category) filters.categoryId = category.id
  }
  
  if (params.marca) {
    const brand = brands.find(b => b.slug === params.marca)
    if (brand) filters.brandId = brand.id
  }
  
  if (params.orden === 'precio-asc') {
    filters.sortBy = 'price_asc'
  } else if (params.orden === 'precio-desc') {
    filters.sortBy = 'price_desc'
  }

  const products = await getProductsFiltered(store.id, filters)

  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <CatalogClient
        store={store}
        categories={categories}
        brands={brands}
        products={products}
        currentFilters={{
          categoria: params.categoria,
          marca: params.marca,
          orden: params.orden,
        }}
      />
    </Suspense>
  )
}
