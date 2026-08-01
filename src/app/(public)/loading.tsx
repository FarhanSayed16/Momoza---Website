import React from 'react'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-brand-bg/50">
      <Loader2 className="h-12 w-12 animate-spin text-brand-primary mb-4" />
      <p className="text-lg font-medium text-foreground/70 animate-pulse">
        Preparing fresh momos...
      </p>
    </div>
  )
}
