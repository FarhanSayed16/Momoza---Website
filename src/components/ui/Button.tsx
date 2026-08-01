import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      primary:
        'bg-brand-primary text-white hover:bg-red-600 shadow-sm hover:shadow-md ring-brand-primary',
      secondary:
        'bg-brand-secondary text-brand-dark hover:bg-yellow-500 shadow-sm hover:shadow-md ring-brand-secondary',
      outline:
        'border-2 border-[color:var(--border)] bg-transparent hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)] text-[color:var(--foreground)] ring-[color:var(--border)]',
      ghost: 'bg-transparent hover:bg-[color:var(--foreground)]/10 text-[color:var(--foreground)] ring-[color:var(--border)]',
      danger:
        'bg-red-100 text-red-600 hover:bg-red-200 ring-red-500',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
      icon: 'h-11 w-11 p-2',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
