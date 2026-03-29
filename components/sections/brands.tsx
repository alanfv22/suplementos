'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import type { Brand } from '@/lib/supabase'

interface BrandsProps {
  brands: Brand[]
}

function BrandSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-full animate-pulse">
      <div className="w-6 h-6 rounded-full bg-muted" />
      <div className="w-20 h-4 rounded bg-muted" />
    </div>
  )
}

export function BrandsSection({ brands }: BrandsProps) {
  const isEmpty = brands.length === 0

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            MARCAS QUE AMAMOS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trabajamos solo con las mejores marcas del mercado
          </p>
        </motion.div>

        {isEmpty ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <BrandSkeleton key={i} />
              ))}
            </div>
            <p className="text-muted-foreground">
              Conectá Supabase para ver tus marcas
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/catalogo?marca=${brand.slug}`}
                className="group flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                {brand.logo_url ? (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {brand.name}
                </span>
              </Link>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}
