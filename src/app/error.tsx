'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Caught by global error boundary:', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-red-500/10 p-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h2>
      <p className="mb-8 max-w-md text-foreground/60">
        We apologize for the inconvenience. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
          Go to Homepage
        </Button>
      </div>
    </div>
  )
}
