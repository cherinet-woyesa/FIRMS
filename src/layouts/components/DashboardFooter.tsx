import React from 'react'
import { ShieldCheck, Lock } from 'lucide-react'

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 px-6 sm:px-8 py-3.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cbe-purple shrink-0" />
        <span className="font-semibold text-slate-700">Commercial Bank of Ethiopia</span>
        <span className="text-slate-300">•</span>
        <span className="text-[11px] text-slate-500">ComplianceDesk Fraud Investigation Suite</span>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-cbe-gold" />
          <span>Strictly Confidential &amp; Legally Privileged</span>
        </span>
        <span className="text-slate-300">•</span>
        <span>© {new Date().getFullYear()} CBE All Rights Reserved</span>
      </div>
    </footer>
  )
}
