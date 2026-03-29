'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Store } from '@/lib/supabase'

interface FinalCTAProps {
  store: Store | null
}

export function FinalCTASection({ store }: FinalCTAProps) {
  const handleWhatsAppClick = () => {
    if (!store?.whatsapp_number) return
    const url = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(store.whatsapp_message_template || 'Hola!')}`
    window.open(url, '_blank')
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Neon gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      {/* Animated glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-foreground mb-6 leading-tight">
            <span className="block">¿LISTO PARA</span>
            <span className="block text-primary glow-text-primary">TRANSFORMARTE?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            No esperes más para alcanzar tus metas. 
            Empezá hoy con los mejores suplementos del mercado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-primary shimmer"
            >
              <Link href="/catalogo">
                Comprá ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              onClick={handleWhatsAppClick}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Consultá por WhatsApp
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Envío gratis en compras mayores a $50.000 | Pago seguro | Garantía de originalidad
          </p>
        </motion.div>
      </div>
    </section>
  )
}
