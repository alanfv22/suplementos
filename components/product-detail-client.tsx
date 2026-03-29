'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Package,
  Shield,
  Truck,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { CartDrawer } from '@/components/cart-drawer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useCartStore } from '@/lib/cart-store'
import type { Store, ProductWithRelations, ProductVariant } from '@/lib/supabase'

interface ProductDetailClientProps {
  store: Store | null
  product: ProductWithRelations
  relatedProducts: ProductWithRelations[]
}

export function ProductDetailClient({
  store,
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const activeVariants = product.variants.filter(v => v.active)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    activeVariants[0] || null
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()

  const currentPrice = selectedVariant?.price_override ?? product.base_price
  const sortedImages = [...product.images].sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.sort_order - b.sort_order
  })
  const selectedImage = sortedImages[selectedImageIndex]

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItem(product, selectedVariant, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWhatsAppClick = () => {
    if (!store?.whatsapp_number) return
    const message = `Hola! Me interesa el producto: ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ''}`
    const url = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <Navbar store={store} />
      <CartDrawer store={store} />
      <WhatsAppButton store={store} />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al catálogo
            </Link>
          </motion.div>

          {/* Product content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square bg-card border border-border rounded-xl overflow-hidden">
                {selectedImage ? (
                  <Image
                    src={selectedImage.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {sortedImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {sortedImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Category & Brand */}
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Link
                    href={`/catalogo?categoria=${product.category.slug}`}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {product.category.name}
                  </Link>
                )}
                {product.brand && (
                  <Link
                    href={`/catalogo?marca=${product.brand.slug}`}
                    className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full hover:bg-secondary/20 transition-colors"
                  >
                    {product.brand.name}
                  </Link>
                )}
              </div>

              {/* Name */}
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  ${currentPrice.toLocaleString('es-AR')}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Variant Selector */}
              {activeVariants.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Variante:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-foreground hover:border-primary/50'
                        }`}
                      >
                        {variant.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-foreground hover:bg-muted transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium text-foreground min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-foreground hover:bg-muted transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || added}
                  size="lg"
                  className={`flex-1 h-12 shimmer ${
                    added
                      ? 'bg-green-600 hover:bg-green-600 text-white'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Agregado al carrito
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Agregar al carrito
                    </>
                  )}
                </Button>
              </div>

              {/* WhatsApp Consult */}
              <Button
                onClick={handleWhatsAppClick}
                variant="outline"
                size="lg"
                className="w-full h-12 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Consultar por WhatsApp
              </Button>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">100% Original</p>
                    <p className="text-xs text-muted-foreground">Garantía de autenticidad</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Envío rápido</p>
                    <p className="text-xs text-muted-foreground">Despacho en 24hs</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24"
            >
              <h2 className="font-heading text-3xl text-foreground mb-8">
                PRODUCTOS RELACIONADOS
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer store={store} />
    </>
  )
}
