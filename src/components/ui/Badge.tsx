import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'veg' | 'nonveg'
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-gradient-to-r from-orange-400 to-rose-500 text-white shadow-md border-none',
      danger: 'bg-red-100 text-red-800',
      veg: 'border border-green-600 text-green-700 bg-green-50',
      nonveg: 'border border-red-600 text-red-700 bg-red-50',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      >
        {variant === 'veg' && (
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-600"></span>
        )}
        {variant === 'nonveg' && (
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-600"></span>
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
