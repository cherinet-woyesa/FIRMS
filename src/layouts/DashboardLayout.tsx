import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Shield, LayoutDashboard, Inbox, History, Settings, LogOut } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/useAuthStore'

export const DashboardLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const navLinks = [
    { label: 'Overview', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Case Registry', to: ROUTES.CASES, icon: Inbox },
    { label: 'Audit Logs', to: ROUTES.AUDIT_LOGS, icon: History },
    { label: 'Settings', to: ROUTES.SETTINGS, icon: Settings },
  ]

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <Shield className="w-6 h-6 text-cbe-gold" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white">ComplianceDesk</span>
            <span className="text-[10px] text-cbe-gold-300 uppercase tracking-wider">Investigator Suite</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-cbe-purple text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Officer Lead'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.department || 'Internal Ethics'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Internal Ethics & Compliance Committee</h2>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Secure Officer Session Active</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
