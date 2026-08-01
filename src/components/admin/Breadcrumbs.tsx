import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-zinc-500 mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-zinc-300 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-zinc-300 font-medium' : ''}>
                {item.label}
              </span>
            )}
            
            {!isLast && <ChevronRight className="h-4 w-4 text-zinc-700" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
