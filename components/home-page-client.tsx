'use client'

import { Navbar } from '@/components/navbar'
import { CartDrawer } from '@/components/cart-drawer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/sections/hero'
import { ProblemsSection } from '@/components/sections/problems'
import { FeaturedProductsSection } from '@/components/sections/featured-products'
import { CategoriesSection } from '@/components/sections/categories'
import { BrandsSection } from '@/components/sections/brands'
import { DifferentiatorsSection } from '@/components/sections/differentiators'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { FinalCTASection } from '@/components/sections/final-cta'
import type { Store, Category, Brand, ProductWithRelations } from '@/lib/supabase'

interface HomePageClientProps {
  store: Store | null
  categories: Category[]
  brands: Brand[]
  products: ProductWithRelations[]
}

export function HomePageClient({ store, categories, brands, products }: HomePageClientProps) {
  return (
    <>
      <Navbar store={store} />
      <CartDrawer store={store} />
      <WhatsAppButton store={store} />
      
      <main>
        <HeroSection />
        <ProblemsSection />
        <FeaturedProductsSection products={products} />
        <CategoriesSection categories={categories} />
        <BrandsSection brands={brands} />
        <DifferentiatorsSection />
        <TestimonialsSection />
        <FinalCTASection store={store} />
      </main>

      <Footer store={store} />
    </>
  )
}
