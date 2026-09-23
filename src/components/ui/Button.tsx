import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

    const variants = {
      primary: 'bg-cbe-purple text-white hover:bg-cbe-purple-600 focus:ring-cbe-purple',
      secondary: 'bg-cbe-gold text-white hover:bg-cbe-gold-600 focus:ring-cbe-gold',
      outline: 'border border-cbe-purple-200 bg-transparent text-cbe-purple-800 hover:bg-cbe-purple-50 focus:ring-cbe-purple-400',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600',
      ghost: 'bg-transparent text-cbe-purple-700 hover:bg-cbe-purple-50 focus:ring-cbe-purple-300',
    }

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-2.5 gap-2.5',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
