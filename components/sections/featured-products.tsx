'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import type { ProductWithRelations } from '@/lib/supabase'

interface FeaturedProductsProps {
  products: ProductWithRelations[]
  loading?: boolean
}

export function FeaturedProductsSection({ products, loading }: FeaturedProductsProps) {
  return (
    <section id="productos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-2">
              PRODUCTOS DESTACADOS
            </h2>
            <p className="text-muted-foreground text-lg">
              Los suplementos más elegidos por nuestros clientes
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-fit border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link href="/catalogo">
              Ver todo el catálogo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No hay productos disponibles en este momento
            </p>
            <p className="text-sm text-muted-foreground/70">
              Conectá Supabase para ver tus productos
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
