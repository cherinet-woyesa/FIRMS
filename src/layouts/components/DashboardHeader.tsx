import React from 'react'
import { Menu } from 'lucide-react'

interface Props {
  onToggleMobileMenu?: () => void
}

export const DashboardHeader: React.FC<Props> = ({ onToggleMobileMenu }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
      {/* Title & Institutional Org */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-1.5 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition lg:hidden cursor-pointer shrink-0"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cbe-purple shrink-0" />
          <h2 className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight truncate">
            Commercial Bank of Ethiopia
          </h2>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-xs text-slate-500 hidden md:inline font-medium truncate">
            Internal Ethics &amp; Compliance Committee
          </span>
        </div>
      </div>

      {/* Right Session Meta & Controls */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
          Officer Portal
        </span>
      </div>
    </header>
  )
}
