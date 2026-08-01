'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_GREETING } from '@/constants'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface WhatsAppButtonProps {
  phoneNumber?: string
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber = '+919324826414' // We will eventually fetch this from settings 
}) => {
  const whatsappUrl = getWhatsAppUrl(phoneNumber, WHATSAPP_GREETING)

  return (
    <div className="fixed bottom-24 right-6 z-40 md:bottom-24 md:right-8 group">
      {/* Tooltip */}
      <div className="absolute -top-12 right-0 w-max translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 hidden md:block">
        <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-lg dark:bg-gray-100 dark:text-gray-900">
          Chat with us!
          {/* Tooltip triangle */}
          <div className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-100"></div>
        </div>
      </div>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40"
      >
        <MessageCircle className="h-7 w-7" />
        
        {/* Pulse effect */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40"></span>
      </motion.a>
    </div>
  )
}
