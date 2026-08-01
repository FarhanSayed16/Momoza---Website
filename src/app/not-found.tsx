import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { UtensilsCrossed } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-4 text-center">
      <div className="mb-8 rounded-full bg-brand-primary/10 p-6">
        <UtensilsCrossed className="h-16 w-16 text-brand-primary" />
      </div>
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground font-sans">
        404
      </h1>
      <h2 className="mb-6 text-2xl font-semibold text-foreground/90">
        Page Not Found
      </h2>
      <p className="mb-10 max-w-md text-lg text-foreground/70">
        Oops! It looks like this page got lost in our kitchen. Let's get you back to the fresh momos.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto">
            Go to Homepage
          </Button>
        </Link>
        <Link href="/menu">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            View Menu
          </Button>
        </Link>
      </div>
    </div>
  )
}
