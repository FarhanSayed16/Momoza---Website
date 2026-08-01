import React from 'react'
import { Loader2 } from 'lucide-react'

export const LoadingSpinner = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClass = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  }[size]

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[200px]">
      <Loader2 className={`animate-spin text-brand-primary ${sizeClass}`} />
    </div>
  )
}
