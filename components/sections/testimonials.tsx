'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Users, Package, TrendingUp } from 'lucide-react'

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Clientes satisfechos' },
  { icon: Package, value: 15000, suffix: '+', label: 'Pedidos entregados' },
  { icon: Star, value: 4.9, suffix: '', label: 'Calificación promedio' },
  { icon: TrendingUp, value: 98, suffix: '%', label: 'Clientes recurrentes' },
]

const testimonials = [
  {
    name: 'Martín G.',
    location: 'Buenos Aires',
    text: 'La mejor tienda de suplementos que encontré. Productos originales, precios justos y envío super rápido. 100% recomendado.',
    rating: 5,
  },
  {
    name: 'Luciana P.',
    location: 'Córdoba',
    text: 'Me asesoraron re bien para elegir mi primera proteína. Excelente atención por WhatsApp, responden al toque.',
    rating: 5,
  },
  {
    name: 'Diego R.',
    location: 'Mendoza',
    text: 'Compro hace más de un año y nunca tuve un problema. Los precios están muy bien y siempre tienen stock.',
    rating: 5,
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const stepValue = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += stepValue
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current * 10) / 10)
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {Number.isInteger(value) ? Math.floor(count).toLocaleString('es-AR') : count.toFixed(1)}
      {suffix}
    </span>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-card border border-border rounded-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="font-heading text-4xl text-foreground mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">
            LO QUE DICEN NUESTROS CLIENTES
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mayor recompensa
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-4 italic">{`"${testimonial.text}"`}</p>

              {/* Author */}
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
