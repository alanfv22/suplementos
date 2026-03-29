'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Check, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/cart-store'
import type { ProductWithRelations, ProductVariant } from '@/lib/supabase'

interface ProductCardProps {
  product: ProductWithRelations
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.find(v => v.active) || product.variants[0] || null
  )
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()

  const primaryImage = product.images.find(img => img.is_primary) || product.images[0]
  const currentPrice = selectedVariant?.price_override ?? product.base_price
  const activeVariants = product.variants.filter(v => v.active)

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItem(product, selectedVariant)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300"
    >
      {/* Image */}
      <Link href={`/producto/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs font-medium text-foreground">
            {product.category.name}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
            {product.brand.name}
          </p>
        )}

        {/* Name */}
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-xl font-bold text-primary mt-2">
          ${currentPrice.toLocaleString('es-AR')}
        </p>

        {/* Variant Selector */}
        {activeVariants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {activeVariants.slice(0, 4).map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`px-2 py-1 text-xs rounded-md border transition-all ${
                  selectedVariant?.id === variant.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {variant.label}
              </button>
            ))}
            {activeVariants.length > 4 && (
              <Link
                href={`/producto/${product.id}`}
                className="px-2 py-1 text-xs rounded-md border border-border text-muted-foreground hover:border-primary/50"
              >
                +{activeVariants.length - 4}
              </Link>
            )}
          </div>
        )}

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant || added}
          className={`w-full mt-4 shimmer ${
            added
              ? 'bg-green-600 hover:bg-green-600 text-white'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Agregado
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar al carrito
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}

// Skeleton for loading state
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted rounded w-16" />
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="h-6 bg-muted rounded w-24 mt-2" />
        <div className="h-10 bg-muted rounded w-full mt-4" />
      </div>
    </div>
  )
}
