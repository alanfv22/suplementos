import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PowerFuel | Suplementos Deportivos Premium',
  description: 'Tu tienda de suplementos deportivos 100% originales. Proteínas, creatina, pre-entrenos y más. Envío gratis en compras mayores a $50.000.',
  keywords: ['suplementos deportivos', 'proteína', 'creatina', 'pre entreno', 'fitness', 'gym'],
  openGraph: {
    title: 'PowerFuel | Suplementos Deportivos Premium',
    description: 'Tu tienda de suplementos deportivos 100% originales. Proteínas, creatina, pre-entrenos y más.',
    type: 'website',
    locale: 'es_AR',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className={`${bebasNeue.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
