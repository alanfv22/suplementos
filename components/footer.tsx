'use client'

import Link from 'next/link'
import { MessageCircle, MapPin, Mail } from 'lucide-react'
import type { Store } from '@/lib/supabase'

interface FooterProps {
  store: Store | null
}

export function Footer({ store }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-heading text-2xl tracking-wider text-foreground mb-4">
              {store?.name || 'POWERFUEL'}
            </h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Tu tienda de suplementos deportivos 100% originales. 
              Comprometidos con tu rendimiento y bienestar.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={store?.whatsapp_number ? `https://wa.me/${store.whatsapp_number}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:bg-[#20BD5A] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Enlaces</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link href="/catalogo" className="text-muted-foreground hover:text-primary transition-colors">
                Catálogo
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <div className="flex flex-col gap-3">
              {store?.whatsapp_number && (
                <a
                  href={`https://wa.me/${store.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Argentina</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@powerfuel.com.ar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {store?.name || 'PowerFuel'}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
