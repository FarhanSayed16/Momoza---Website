'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'
import { NAV_LINKS } from '@/constants'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { settings } = useSiteSettings()

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-brand-primary">{settings?.brand_name || 'Momoza'}</h3>
            <p className="text-foreground/70 max-w-sm">
              {settings?.tagline || 'Authentic homemade momos, prepared fresh daily in our kitchen with love and the finest ingredients.'}
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-brand-primary">
              {/* FSSAI Badge Placeholder */}
              <div className="flex h-8 items-center justify-center rounded border-2 border-brand-primary px-2">
                fssai
              </div>
              <span>License: 12345678901234</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {settings?.instagram_url ? (
                <a 
                  href={settings.instagram_url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800 text-foreground hover:bg-brand-primary hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              ) : (
                <a 
                  href="#" 
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-zinc-800 text-foreground hover:bg-brand-primary hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-foreground/70 hover:text-brand-primary transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-foreground">Contact Us</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-foreground/70">
                <MapPin className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />
                <span>{settings?.address || 'Address not set'}<br/>Delivery within {settings?.delivery_radius || '0-5 km'}</span>
              </li>
              <li className="flex items-center gap-3 text-foreground/70">
                <Phone className="h-5 w-5 text-brand-primary shrink-0" />
                <a href={`tel:${settings?.phone || ''}`} className="hover:text-brand-primary transition-colors">{settings?.phone || 'Phone not set'}</a>
              </li>
              <li className="flex items-center gap-3 text-foreground/70">
                <Mail className="h-5 w-5 text-brand-primary shrink-0" />
                <a href={`mailto:${settings?.email || ''}`} className="hover:text-brand-primary transition-colors">{settings?.email || 'Email not set'}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/60">
          <div className="flex flex-col gap-1">
            <p>© {currentYear} {settings?.brand_name || 'Momoza'}. All rights reserved.</p>
            <p className="text-xs text-foreground/50">Made with ❤️ for momo lovers.</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
