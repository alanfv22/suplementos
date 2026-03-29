'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, generateWhatsAppMessage } from '@/lib/cart-store'
import type { Store } from '@/lib/supabase'

interface CartDrawerProps {
  store: Store | null
}

export function CartDrawer({ store }: CartDrawerProps) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore()
  const subtotal = getSubtotal()
  const [mpLoading, setMpLoading] = useState(false)
  const [mpError, setMpError] = useState<string | null>(null)

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleWhatsAppCheckout = () => {
    if (!store?.whatsapp_number) return
    const message = generateWhatsAppMessage(items, store.whatsapp_message_template || 'Hola! Me interesa hacer un pedido:')
    const url = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleMercadoPago = async () => {
    setMpError(null)
    if (items.length === 0) return
    setMpLoading(true)
    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            variantLabel: item.variantLabel,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            price: Number(item.price),
          })),
        }),
      })
      const data = (await res.json()) as { init_point?: string; error?: string }
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo iniciar el pago')
      }
      const url = data.init_point
      if (!url) throw new Error('Respuesta inválida del servidor')
      window.location.href = url
    } catch (e) {
      setMpError(e instanceof Error ? e.message : 'Error al conectar con Mercado Pago')
    } finally {
      setMpLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-heading text-xl tracking-wide">Tu Carrito</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-lg">Tu carrito está vacío</p>
                  <p className="text-muted-foreground/70 text-sm mt-1">
                    Agregá productos para comenzar tu pedido
                  </p>
                  <Button
                    onClick={closeCart}
                    className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Ver productos
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 bg-muted/30 rounded-lg p-3"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">{item.variantLabel}</p>
                        <p className="text-primary font-semibold mt-1">
                          ${item.price.toLocaleString('es-AR')}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="ml-auto p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors text-center py-2"
                  >
                    Vaciar carrito
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold text-foreground">
                    ${subtotal.toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    onClick={handleWhatsAppCheckout}
                    className="flex-1 h-12 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold shimmer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Finalizar por WhatsApp
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleMercadoPago}
                    disabled={mpLoading}
                    className="flex-1 h-12 border-[#009EE3] text-[#009EE3] hover:bg-[#009EE3]/10 font-semibold"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {mpLoading ? 'Abriendo…' : 'Pagar con Mercado Pago'}
                  </Button>
                </div>

                {mpError && (
                  <p className="text-xs text-center text-destructive">{mpError}</p>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  Te enviaremos a WhatsApp para confirmar tu pedido
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
