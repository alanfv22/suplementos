'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

export function ShoppingCart() {
  const [isMounted, setIsMounted] = useState(false)
  const { getTotalItems, openCart } = useCartStore()
  const totalItems = getTotalItems()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className="w-10 h-10" />

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-foreground hover:text-primary transition-colors"
      aria-label="Abrir carrito"
    >
      <ShoppingCartIcon className="w-6 h-6" />
      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
        >
          {totalItems}
        </motion.span>
      )}
    </button>
  )
}
