import React from 'react'
import { LogOut } from 'lucide-react'
import { clearSensitiveCache } from '@/lib/queryClient'
import { cn } from '@/utils/cn'

export interface PanicButtonProps {
  className?: string
  redirectUrl?: string
}

/**
 * Emergency Panic / Quick-Exit button
 * Immediately clears all local storage, session storage, and memory cache,
 * then instantly redirects to a neutral public site (default: google.com).
 */
export const PanicButton: React.FC<PanicButtonProps> = ({
  className,
  redirectUrl = 'https://www.google.com',
}) => {
  const handlePanic = () => {
    try {
      sessionStorage.clear()
      localStorage.clear()
      clearSensitiveCache()
    } finally {
      window.location.replace(redirectUrl)
    }
  }

  return (
    <button
      onClick={handlePanic}
      type="button"
      title="Quick Exit (Panic): Clears all session data and redirects away immediately"
      className={cn(
        'inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition-colors cursor-pointer',
        className
      )}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Quick Exit</span>
    </button>
  )
}
