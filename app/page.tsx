import { getStore, getCategories, getBrands, getFeaturedProducts } from '@/lib/data'
import { HomePageClient } from '@/components/home-page-client'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const store = await getStore()
  
  const [categories, brands, products] = await Promise.all([
    store ? getCategories(store.id) : Promise.resolve([]),
    store ? getBrands(store.id) : Promise.resolve([]),
    store ? getFeaturedProducts(store.id, 8) : Promise.resolve([]),
  ])

  return (
    <HomePageClient 
      store={store}
      categories={categories}
      brands={brands}
      products={products}
    />
  )
}
