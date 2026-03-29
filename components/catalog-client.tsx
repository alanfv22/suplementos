'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter, X, ArrowUpDown, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Navbar } from '@/components/navbar'
import { CartDrawer } from '@/components/cart-drawer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Footer } from '@/components/footer'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import type { Store, Category, Brand, ProductWithRelations } from '@/lib/supabase'

interface CatalogClientProps {
  store: Store | null
  categories: Category[]
  brands: Brand[]
  products: ProductWithRelations[]
  currentFilters: {
    categoria?: string
    marca?: string
    orden?: string
  }
}

export function CatalogClient({
  store,
  categories,
  brands,
  products,
  currentFilters,
}: CatalogClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/catalogo')
  }

  const hasActiveFilters = currentFilters.categoria || currentFilters.marca || currentFilters.orden

  const selectedCategory = categories.find(c => c.slug === currentFilters.categoria)
  const selectedBrand = brands.find(b => b.slug === currentFilters.marca)

  return (
    <>
      <Navbar store={store} />
      <CartDrawer store={store} />
      <WhatsAppButton store={store} />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
              CATÁLOGO
            </h1>
            <p className="text-muted-foreground text-lg">
              {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-card border border-border rounded-xl"
          >
            <div className="flex items-center gap-2 text-muted-foreground mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            {/* Category Filter */}
            <Select
              value={currentFilters.categoria || 'all'}
              onValueChange={(value) => updateFilter('categoria', value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Brand Filter */}
            <Select
              value={currentFilters.marca || 'all'}
              onValueChange={(value) => updateFilter('marca', value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.slug}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              value={currentFilters.orden || 'default'}
              onValueChange={(value) => updateFilter('orden', value === 'default' ? null : value)}
            >
              <SelectTrigger className="w-[180px] bg-background border-border">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <SelectValue placeholder="Ordenar por" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Orden por defecto</SelectItem>
                <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </motion.div>

          {/* Active filters tags */}
          {(selectedCategory || selectedBrand) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {selectedCategory.name}
                  <button
                    onClick={() => updateFilter('categoria', null)}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrand && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                  {selectedBrand.name}
                  <button
                    onClick={() => updateFilter('marca', null)}
                    className="hover:bg-secondary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </motion.div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron productos
              </h2>
              <p className="text-muted-foreground mb-6">
                {hasActiveFilters
                  ? 'Probá ajustando los filtros de búsqueda'
                  : 'Conectá Supabase para ver tus productos'}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer store={store} />
    </>
  )
}
