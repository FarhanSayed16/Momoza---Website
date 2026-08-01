import React from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { Section } from '@/components/public/Section'
import { MenuGrid } from '@/components/public/MenuGrid'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore our full menu of authentic homemade momos, including vegetarian, non-vegetarian, and combo options.',
}

export default async function MenuPage() {
  const supabase = await createClient()

  // Fetch Categories
  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Fetch all active items
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('sort_order', { ascending: true })

  return (
    <div className="min-h-screen flex flex-col">
      <Section className="bg-brand-bg dark:bg-zinc-900 pt-24 md:pt-32 pb-12 border-b border-border">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl font-sans mb-6">
            Our Menu
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Freshly steamed, perfectly seasoned, and made with love. Choose from our delicious variety of authentic momos.
          </p>
        </div>
      </Section>

      <Section className="py-8 md:py-12 bg-white dark:bg-zinc-950 min-h-[60vh]">
        <MenuGrid 
          items={items || []} 
          categories={categories || []} 
        />
      </Section>
    </div>
  )
}
