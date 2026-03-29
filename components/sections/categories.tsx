'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Package, ArrowRight } from 'lucide-react'
import type { Category } from '@/lib/supabase'

interface CategoriesProps {
  categories: Category[]
}

function CategorySkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="relative aspect-[16/9] bg-muted" />
    </div>
  )
}

export function CategoriesSection({ categories }: CategoriesProps) {
  const isEmpty = categories.length === 0

  return (
    <section className="py-24 bg-background-secondary grain">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            CATEGORÍAS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explorá nuestros productos por categoría
          </p>
        </motion.div>

        {isEmpty ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
            <div className="sm:col-span-2 lg:col-span-3 text-center py-8">
              <p className="text-muted-foreground">
                Conectá Supabase para ver tus categorías
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/catalogo?categoria=${category.slug}`}
                className="group block relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                {/* Background image or placeholder */}
                <div className="relative aspect-[16/9] bg-muted">
                  {category.icon_url ? (
                    <Image
                      src={category.icon_url}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <span className="inline-flex items-center text-sm text-primary font-medium">
                      Ver productos
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}
