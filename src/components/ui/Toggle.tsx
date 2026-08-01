import React from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId()
    const toggleId = id || generatedId

    return (
      <label htmlFor={toggleId} className="flex items-center cursor-pointer gap-3">
        <div className="relative">
          <input
            type="checkbox"
            id={toggleId}
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 dark:peer-focus:ring-brand-primary/30 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
        </div>
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      </label>
    )
  }
)

Toggle.displayName = 'Toggle'
