'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constants'
import { useCart } from '@/contexts/CartContext'
import { StoreClosedBanner } from '@/components/public/StoreClosedBanner'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)
  const pathname = usePathname()
  const { getItemCount, setIsCartOpen } = useCart()

  const totalItems = getItemCount()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Check for last order
    const savedOrder = localStorage.getItem('momoza-last-order')
    if (savedOrder) {
      setLastOrderId(savedOrder)
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-zinc-950/90'
          : 'bg-transparent'
      )}
    >
      <StoreClosedBanner />
      <div className={cn("container mx-auto px-4 md:px-6 flex items-center justify-between", scrolled ? "py-4" : "py-6")}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <span className={cn(
            "text-2xl font-bold tracking-tight font-sans transition-colors",
            pathname === '/' && !scrolled ? "text-white" : "text-brand-primary"
          )}>
            Momoza
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            const isWhiteText = pathname === '/' && !scrolled

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-primary',
                  isActive 
                    ? 'text-brand-primary' 
                    : isWhiteText ? 'text-white/90 hover:text-white' : 'text-foreground/80'
                )}
              >
                {link.label}
              </Link>
            )
          })}
          
          {lastOrderId && (
            <Link
              href={`/track/${lastOrderId}`}
              className={cn(
                'flex items-center gap-1 text-sm font-bold transition-colors hover:text-brand-primary',
                pathname.startsWith('/track') 
                  ? 'text-brand-primary' 
                  : pathname === '/' && !scrolled ? 'text-white' : 'text-brand-primary'
              )}
            >
              <MapPin className="h-4 w-4" />
              Track Order
            </Link>
          )}
        </nav>

        {/* Actions (Cart & Mobile Menu Toggle) */}
        <div className="flex items-center gap-4 z-50">
          <button
            onClick={() => setIsCartOpen(true)}
            className={cn(
              "relative p-2 transition-colors",
              pathname === '/' && !scrolled ? "text-white hover:text-white/80" : "text-foreground hover:text-brand-primary"
            )}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-6 w-6" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white shadow-sm"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className={cn(
              "md:hidden p-2 transition-colors",
              pathname === '/' && !scrolled ? "text-white" : "text-foreground"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 top-full w-full bg-white shadow-lg dark:bg-zinc-950 md:hidden"
          >
            <nav className="flex flex-col p-4 border-t border-border">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'p-4 text-base font-medium rounded-lg transition-colors',
                    pathname === link.href
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'text-foreground hover:bg-gray-100 dark:hover:bg-zinc-900'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              {lastOrderId && (
                <Link
                  href={`/track/${lastOrderId}`}
                  className={cn(
                    'flex items-center gap-2 p-4 text-base font-bold rounded-lg transition-colors text-brand-primary',
                    pathname.startsWith('/track') ? 'bg-brand-primary/10' : 'hover:bg-gray-100 dark:hover:bg-zinc-900'
                  )}
                >
                  <MapPin className="h-5 w-5" />
                  Track Active Order
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
