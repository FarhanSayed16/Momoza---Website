import { CartItem, CustomerInfo } from '@/types'
import { formatCurrency } from './utils'

export function buildOrderMessage(
  items: CartItem[],
  customer: CustomerInfo,
  total: number,
  deliveryCharge: number = 0,
  orderNumber: string = '',
  orderId: string = '',
  baseUrl: string = ''
): string {
  const greeting = `*New Order: ${orderNumber}*\n\n`
  const customerDetails = `*Customer Details:*\nName: ${customer.name}\nPhone: ${customer.phone}\nType: ${customer.order_type}\n${
    customer.order_type === 'Delivery' ? `Address: ${customer.address}\n` : ''
  }${customer.notes ? `Notes: ${customer.notes}\n` : ''}\n`

  const itemsList = items
    .map(
      (item) =>
        `- ${item.quantity}x ${item.name} (${item.pieces} pcs) = ${formatCurrency(
          item.price * item.quantity
        )}`
    )
    .join('\n')

  const itemsSection = `*Order Items:*\n${itemsList}\n\n`
  
  const charges = deliveryCharge > 0 && customer.order_type === 'Delivery' 
    ? `Subtotal: ${formatCurrency(total - deliveryCharge)}\nDelivery: ${formatCurrency(deliveryCharge)}\n`
    : ''

  const totalSection = `*${charges}Total: ${formatCurrency(total)}*\n\n`
  
  const trackingLink = orderId && baseUrl ? `Track Order Live:\n${baseUrl}/track/${orderId}` : ''

  return `${greeting}${customerDetails}${itemsSection}${totalSection}${trackingLink}`
}

export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  // Ensure it has country code if missing (defaulting to India +91 for Momoza if 10 digits)
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${finalPhone}?text=${encodedMessage}`
}
