'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductWithRelations, ProductVariant } from './supabase'

export interface CartItem {
  productId: string
  variantId: string
  productName: string
  variantLabel: string
  price: number
  quantity: number
  imageUrl: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: ProductWithRelations, variant: ProductVariant, quantity?: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getSubtotal: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.variantId === variant.id)
        const price = variant.price_override ?? product.base_price
        const primaryImage = product.images.find(img => img.is_primary) || product.images[0]

        if (existingItem) {
          set({
            items: items.map(item =>
              item.variantId === variant.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isOpen: true,
          })
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                variantId: variant.id,
                productName: product.name,
                variantLabel: variant.label,
                price,
                quantity,
                imageUrl: primaryImage?.url || '',
              },
            ],
            isOpen: true,
          })
        }
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId),
        })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// Generate WhatsApp message from cart
export function generateWhatsAppMessage(items: CartItem[], template: string): string {
  if (items.length === 0) return template

  const itemsList = items
    .map(
      item =>
        `- ${item.productName} (${item.variantLabel}) x${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-AR')}`
    )
    .join('\n')

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return `${template}\n\n*Mi pedido:*\n${itemsList}\n\n*Total: $${subtotal.toLocaleString('es-AR')}*`
}
