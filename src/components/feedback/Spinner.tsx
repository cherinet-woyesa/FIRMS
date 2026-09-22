import React from 'react'
import { cn } from '@/utils/cn'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  }

  return (
    <div
      className={cn(
        'rounded-full border-slate-200 border-t-slate-900 animate-spin',
        sizes[size],
        className
      )}
    />
  )
}
