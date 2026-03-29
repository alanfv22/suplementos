import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

type PreferenceItemInput = {
  productId: string
  variantId: string
  productName: string
  variantLabel: string
  quantity: number
  imageUrl?: string
  price?: number
  base_price?: number
  price_override?: number | null
}

function getBaseUrl(request: Request): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (env) return env.replace(/\/$/, '')

  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') ?? 'http'
  if (host) return `${proto}://${host}`

  return 'http://localhost:3000'
}

function resolveUnitPrice(item: PreferenceItemInput): number {
  if (item.price_override != null && item.price_override !==  null) {
    const n = Number(item.price_override)
    if (Number.isFinite(n) && n >= 0) return n
  }
  if (item.base_price != null) {
    const n = Number(item.base_price)
    if (Number.isFinite(n) && n >= 0) return n
  }
  const n = Number(item.price)
  if (!Number.isFinite(n) || n < 0) {
    throw new Error('Precio inválido')
  }
  return n
}

export async function POST(request: Request) {
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json(
      { error: 'MP_ACCESS_TOKEN no configurado' },
      { status: 500 }
    )
  }

  let body: { items?: PreferenceItemInput[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const rawItems = body.items
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json(
      { error: 'Se requiere al menos un ítem' },
      { status: 400 }
    )
  }

  const baseUrl = getBaseUrl(request)

  let mpItems: Array<{
    id: string
    title: string
    description?: string
    picture_url?: string
    quantity: number
    currency_id: string
    unit_price: number
  }>

  try {
    mpItems = rawItems.map((item) => {
      const unitPrice = resolveUnitPrice(item)
      const qty = Math.floor(Number(item.quantity))
      if (!Number.isFinite(qty) || qty < 1) {
        throw new Error('Cantidad inválida')
      }
      const title = `${item.productName} (${item.variantLabel})`.slice(0, 256)
      return {
        id: String(item.variantId),
        title,
        description: item.variantLabel,
        picture_url: item.imageUrl || undefined,
        quantity: qty,
        currency_id: 'ARS',
        unit_price: unitPrice,
      }
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Datos inválidos'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const client = new MercadoPagoConfig({ accessToken })
  const preference = new Preference(client)

  try {
    const result = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${baseUrl}/pago-exitoso`,
          failure: `${baseUrl}/pago-fallido`,
          pending: `${baseUrl}/pago-pendiente`,
        },
        notification_url: 'https://alanfv.app.n8n.cloud/webhook/9020ea8f-3ce8-41d8-8862-e64a038faa08',
        ...(baseUrl.includes('localhost') ? {} : { auto_return: 'approved' }),
      },
    })

    const initPoint = result.sandbox_init_point ?? result.init_point
    if (!initPoint) {
      return NextResponse.json(
        { error: 'No se obtuvo URL de checkout' },
        { status: 502 }
      )
    }

    return NextResponse.json({ init_point: initPoint })
  } catch (e) {
    console.error('MP ERROR COMPLETO:', JSON.stringify(e, null, 2))
    const message =
      e instanceof Error ? e.message : 'Error al crear la preferencia'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
