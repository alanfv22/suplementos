'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from '@/components/shopping-cart'
import type { Store } from '@/lib/supabase'

interface NavbarProps {
  store: Store | null
}

export function Navbar({ store }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWhatsAppClick = () => {
    if (!store?.whatsapp_number) return
    const url = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(store.whatsapp_message_template || 'Hola!')}`
    window.open(url, '_blank')
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl tracking-wider text-foreground">
            {store?.name || 'POWERFUEL'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Catálogo
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWhatsAppClick}
            className="hidden sm:flex items-center gap-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultá</span>
          </Button>

          <ShoppingCart />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground font-medium py-2"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground font-medium py-2"
            >
              Catálogo
            </Link>
            <Button
              variant="outline"
              onClick={handleWhatsAppClick}
              className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Consultá por WhatsApp
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
