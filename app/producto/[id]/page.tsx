import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStore, getProductById, getRelatedProducts } from '@/lib/data'
import { ProductDetailClient } from '@/components/product-detail-client'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  
  if (!product) {
    return {
      title: 'Producto no encontrado | PowerFuel',
    }
  }

  const primaryImage = product.images.find(img => img.is_primary) || product.images[0]

  return {
    title: `${product.name} | PowerFuel`,
    description: product.description || `Comprá ${product.name} al mejor precio. Suplemento 100% original.`,
    openGraph: {
      title: product.name,
      description: product.description || `Comprá ${product.name} al mejor precio.`,
      images: primaryImage?.url ? [primaryImage.url] : [],
    },
  }
}

export default async function ProductoPage({ params }: PageProps) {
  const { id } = await params
  const store = await getStore()
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = store
    ? await getRelatedProducts(store.id, product.id, product.category_id, 4)
    : []

  return (
    <ProductDetailClient
      store={store}
      product={product}
      relatedProducts={relatedProducts}
    />
  )
}
