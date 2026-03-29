'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import type { Store } from '@/lib/supabase'

interface WhatsAppButtonProps {
  store: Store | null
}

// Default fallback number when store is not configured
const DEFAULT_WHATSAPP = '5491112345678'
const DEFAULT_MESSAGE = 'Hola! Tengo una consulta sobre sus productos.'

export function WhatsAppButton({ store }: WhatsAppButtonProps) {
  const whatsappNumber = store?.whatsapp_number || DEFAULT_WHATSAPP
  const messageTemplate = store?.whatsapp_message_template || DEFAULT_MESSAGE

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageTemplate)}`
    window.open(url, '_blank')
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </motion.button>
  )
}
