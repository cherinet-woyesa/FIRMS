import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FileText, Search, Lock } from 'lucide-react'
import { PanicButton } from '@/components/navigation/PanicButton'
import { ROUTES } from '@/config/routes'
import cbeLogo from '@/assets/cbelogo.jpg'

export const PublicLayout: React.FC = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* Top Header */}
      <header className="bg-white text-slate-900 shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <img src={cbeLogo} alt="CBE Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-cbe-purple">FIRMS</span>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              to={ROUTES.REPORT}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${location.pathname === ROUTES.REPORT || location.pathname === ROUTES.HOME
                ? 'bg-cbe-purple text-white'
                : 'text-slate-600 hover:text-cbe-purple hover:bg-cbe-purple-50'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Submit Report</span>
            </Link>

            <Link
              to={ROUTES.TRACK}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${location.pathname === ROUTES.TRACK
                ? 'bg-cbe-purple text-white'
                : 'text-slate-600 hover:text-cbe-purple hover:bg-cbe-purple-50'
                }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Status</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

            <Link
              to={ROUTES.LOGIN}
              className="text-xs text-slate-500 hover:text-cbe-purple-600 px-2.5 py-1.5 transition hidden sm:flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Officer Portal</span>
            </Link>

            {/* Quick Exit Emergency Button */}
            <PanicButton className="ml-2" />
          </nav>
        </div>
      </header>



      {/* Main Page Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Internal Audit Division</p>
        </div>
      </footer>
    </div>
  )
}
