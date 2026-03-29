'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Package, Clock } from 'lucide-react'

const problems = [
  {
    icon: AlertTriangle,
    title: '¿Cansado de suplementos truchos?',
    description: 'En el mercado hay muchos productos falsificados que no dan resultados. Nosotros garantizamos 100% originalidad.',
  },
  {
    icon: Package,
    title: '¿No sabés qué elegir?',
    description: 'La cantidad de opciones puede ser abrumadora. Te asesoramos gratis para encontrar el suplemento ideal para vos.',
  },
  {
    icon: Clock,
    title: '¿Te cansaste de esperar?',
    description: 'Entendemos tu ansiedad por empezar. Despachamos en 24hs y tenés envío gratis en compras mayores a $50.000.',
  },
]

export function ProblemsSection() {
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
            SABEMOS LO QUE PASÁS
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Olvidate de los problemas típicos al comprar suplementos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <problem.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl text-foreground mb-2">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
