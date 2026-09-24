import React from 'react'
import { Shield, Bell, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export const DashboardHeader: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
      {/* Title & Institutional Org */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cbe-purple" />
          <h2 className="text-sm font-semibold text-slate-800 tracking-tight">
            Commercial Bank of Ethiopia
          </h2>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-xs text-slate-500 hidden sm:inline font-medium">
            Internal Ethics &amp; Compliance Committee
          </span>
        </div>
      </div>

      {/* Right Session Meta & Controls */}
      <div className="flex items-center gap-4 text-xs">
        {/* Session Active Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden md:inline">Secure Officer Session Active</span>
          <span className="md:hidden">Active</span>
        </div>

        {/* Security / Encryption Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-400 font-mono text-[11px] border-l border-slate-200 pl-3">
          <Lock className="w-3.5 h-3.5 text-cbe-purple" />
          <span>TLS 1.3 End-to-End</span>
        </div>
      </div>
    </header>
  )
}
