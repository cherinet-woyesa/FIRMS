import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ShieldCheck, ShieldAlert, FileText, Search, Lock } from 'lucide-react'
import { PanicButton } from '@/components/navigation/PanicButton'
import { ROUTES } from '@/config/routes'

export const PublicLayout: React.FC = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight">TrustBridge</span>
              <span className="text-[11px] text-slate-400">Enterprise Integrity Portal</span>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to={ROUTES.REPORT}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                location.pathname === ROUTES.REPORT || location.pathname === ROUTES.HOME
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Submit Report</span>
            </Link>

            <Link
              to={ROUTES.TRACK}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                location.pathname === ROUTES.TRACK
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Status</span>
            </Link>

            <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

            <Link
              to={ROUTES.LOGIN}
              className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 transition hidden sm:flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Officer Portal</span>
            </Link>

            {/* Quick Exit Emergency Button */}
            <PanicButton className="ml-2" />
          </nav>
        </div>
      </header>

      {/* Security notice ribbon */}
      <div className="bg-amber-50 border-b border-amber-200 py-1.5 px-4 text-center text-xs text-amber-900 flex items-center justify-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Confidential & End-to-End Encrypted:</strong> No IP addresses, device identifiers, or timestamps are logged.
        </span>
      </div>

      {/* Main Page Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Corporate Ethics & Whistleblower Oversight Committee.</p>
          <p className="text-slate-400">Strictly guarded under Global Whistleblower Protection Directives.</p>
        </div>
      </footer>
    </div>
  )
}
