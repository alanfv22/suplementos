// Format price in Argentine Pesos
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Generate WhatsApp link with cart items
export function generateWhatsAppLink(
  phoneNumber: string,
  messageTemplate: string,
  cartItems?: Array<{
    name: string
    variant: string
    quantity: number
    price: number
  }>
): string {
  let message = messageTemplate

  if (cartItems && cartItems.length > 0) {
    const itemsList = cartItems
      .map(
        (item) =>
          `- ${item.name} (${item.variant}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
      )
      .join('\n')

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    message += `\n\n*Mi pedido:*\n${itemsList}\n\n*Total: ${formatPrice(total)}*`
  }

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}
