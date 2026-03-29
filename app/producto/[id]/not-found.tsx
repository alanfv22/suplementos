import Link from 'next/link'
import { Package, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Package className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
        <h1 className="font-heading text-4xl text-foreground mb-4">
          PRODUCTO NO ENCONTRADO
        </h1>
        <p className="text-muted-foreground mb-8">
          El producto que buscás no existe o fue eliminado.
        </p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/catalogo">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al catálogo
          </Link>
        </Button>
      </div>
    </main>
  )
}
