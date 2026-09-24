import React from 'react'


export const DashboardHeader: React.FC = () => {

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



      </div>
    </header>
  )
}
