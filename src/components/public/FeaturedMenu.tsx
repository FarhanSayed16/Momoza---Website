'use client'

import React from 'react'
import Link from 'next/link'
import { Section } from '@/components/public/Section'
import { MenuCard } from '@/components/public/MenuCard'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { MenuItem } from '@/types'

interface FeaturedMenuProps {
  bestsellers: MenuItem[]
}

export const FeaturedMenu: React.FC<FeaturedMenuProps> = ({ bestsellers }) => {
  if (!bestsellers || bestsellers.length === 0) return null

  return (
    <Section 
      title="Customer Favorites" 
      subtitle="Our most loved momos, ordered time and time again."
      className="bg-white dark:bg-zinc-950"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {bestsellers.map((item, index) => (
          <MenuCard key={item.id} item={item} index={index} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/menu">
          <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
            View Full Menu
          </Button>
        </Link>
      </div>
    </Section>
  )
}
