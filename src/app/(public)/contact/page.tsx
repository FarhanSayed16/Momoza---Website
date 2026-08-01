import React from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { Section } from '@/components/public/Section'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { WHATSAPP_GREETING } from '@/constants'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Momoza. Find our kitchen address, contact numbers, operating hours, and delivery areas.',
}

// Simple FAQ Item Component
const FAQItem = ({ question, answer }: { question: string, answer: string }) => (
  <div className="border border-border rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-sm">
    <h4 className="font-bold text-lg mb-2">{question}</h4>
    <p className="text-foreground/70">{answer}</p>
  </div>
)

export default async function ContactPage() {
  const supabase = await createClient()

  // Fetch Site Settings
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  const whatsappUrl = getWhatsAppUrl(settings?.whatsapp_number || '', WHATSAPP_GREETING)

  return (
    <>
      <Section className="bg-brand-bg dark:bg-zinc-900 pt-24 md:pt-32 pb-12 border-b border-border">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl font-sans mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            Have a question about our momos, catering, or delivery? We'd love to hear from you.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-xl shadow-[#25D366]/20 px-8 py-6 rounded-full text-lg" leftIcon={<MessageCircle className="h-6 w-6" />}>
              Chat with us on WhatsApp
            </Button>
          </a>
        </div>
      </Section>

      <Section className="py-12 md:py-20 bg-white dark:bg-zinc-950">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info (Left) */}
          <div>
            <h2 className="text-3xl font-bold mb-8 font-sans">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Our Kitchen</h3>
                  <p className="text-foreground/70 leading-relaxed max-w-sm">
                    {settings?.address || '123 Momo Lane, Food District, City - 400001'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Phone Number</h3>
                  <p className="text-foreground/70">
                    <a href={`tel:${settings?.phone}`} className="hover:text-brand-primary transition-colors">
                      {settings?.phone || '+91 98765 43210'}
                    </a>
                  </p>
                  <p className="text-foreground/70">
                    <a href={`tel:${settings?.whatsapp_number}`} className="hover:text-brand-primary transition-colors">
                      {settings?.whatsapp_number || '+91 98765 43210'} (WhatsApp)
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Operating Hours</h3>
                  <p className="text-foreground/70 whitespace-pre-line">
                    {settings?.operating_hours || 'Mon-Sun: 12:00 PM - 10:00 PM'}
                  </p>
                  {settings?.is_accepting_orders !== false ? (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 border border-green-200 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                      Open Now
                    </div>
                  ) : (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                      Currently Closed
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-foreground/70">
                    <a href={`mailto:${settings?.email}`} className="hover:text-brand-primary transition-colors">
                      {settings?.email || 'hello@momoza.com'}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map (Right) */}
          <div className="h-full min-h-[400px] rounded-3xl overflow-hidden border border-border shadow-md bg-gray-100 dark:bg-zinc-800">
            {settings?.google_maps_url ? (
              <iframe 
                src={settings.google_maps_url} 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '400px' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-foreground/50 min-h-[400px]">
                <MapPin className="h-12 w-12 mb-4 opacity-50" />
                <p>Google Maps location will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-20 pt-16 border-t border-border">
          <h2 className="text-3xl font-bold mb-10 text-center font-sans">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <FAQItem 
              question="What is the minimum order amount?" 
              answer={`Our minimum order amount for delivery is ₹${settings?.min_order_amount || 150}. There is no minimum for pickup orders.`} 
            />
            <FAQItem 
              question="How much do you charge for delivery?" 
              answer={`We charge a flat delivery fee of ₹${settings?.delivery_charge || 30} within our delivery radius.`} 
            />
            <FAQItem 
              question="What areas do you deliver to?" 
              answer={settings?.delivery_radius || "We currently deliver within a 5km radius of our kitchen."} 
            />
            <FAQItem 
              question="How do I pay for my order?" 
              answer="We accept payment via UPI (Google Pay, PhonePe, Paytm) or Cash on Delivery. You can confirm your preferred method when you place the order on WhatsApp." 
            />
            <FAQItem 
              question="Are your momos fresh?" 
              answer="Absolutely! All our momos are made fresh daily from scratch. We do not use frozen momos or artificial preservatives." 
            />
            <FAQItem 
              question="Do you take bulk or catering orders?" 
              answer="Yes, we do! Please contact us at least 24 hours in advance for bulk orders or party catering so we can prepare accordingly." 
            />
          </div>
        </div>
      </Section>
    </>
  )
}
