'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, Headphones, Award, CreditCard, RotateCcw } from 'lucide-react'

const differentiators = [
  {
    icon: Shield,
    title: '100% Originales',
    description: 'Garantía de autenticidad en todos nuestros productos',
  },
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En compras mayores a $50.000 a todo el país',
  },
  {
    icon: Headphones,
    title: 'Asesoramiento',
    description: 'Te ayudamos a elegir el suplemento ideal para vos',
  },
  {
    icon: Award,
    title: 'Calidad Premium',
    description: 'Solo las mejores marcas nacionales e importadas',
  },
  {
    icon: CreditCard,
    title: 'Pago Seguro',
    description: 'Múltiples medios de pago con seguridad garantizada',
  },
  {
    icon: RotateCcw,
    title: 'Devoluciones',
    description: '30 días para cambios o devoluciones sin problemas',
  },
]

export function DifferentiatorsSection() {
  return (
    <section className="py-24 bg-background-secondary grain">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            ¿POR QUÉ ELEGIRNOS?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nos diferenciamos por nuestra dedicación a tu bienestar
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
