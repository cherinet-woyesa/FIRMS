import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  Inbox,
  FolderSearch,
  History,
  Settings,
  LogOut,
  Users,
  Lock,
  X,
} from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/useAuthStore'

interface Props {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export const DashboardSidebar: React.FC<Props> = ({ mobileOpen = false, onCloseMobile }) => {
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
    { label: 'Teams', to: ROUTES.TEAM_CREATION, icon: Users },
    { label: 'User Management', to: ROUTES.USERS, icon: Users },
    { label: 'Access Management', to: ROUTES.ACCESS_MANAGEMENT, icon: Lock },
    { label: 'Report Repository', to: ROUTES.REPORT_REPOSITORY, icon: FolderSearch },
    { label: 'Audit Logs', to: ROUTES.AUDIT_LOGS, icon: History },
    { label: 'Settings', to: ROUTES.SETTINGS, icon: Settings },
  ]

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-slate-900 text-white select-none">
      {/* Brand Header */}
      <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-cbe-gold shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white">ComplianceDesk</span>
            <span className="text-[10px] text-cbe-gold uppercase tracking-wider font-semibold">
              Investigator Suite
            </span>
          </div>
        </div>
        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links - Scrolls internally only when content exceeds sidebar height */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        {navLinks.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-cbe-purple text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || 'Lead Compliance Officer'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.department || 'Ethics & Internal Audit'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (visible on lg screens and wider) */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 shrink-0 border-r border-slate-800 z-30">
        {sidebarContent(false)}
      </aside>

      {/* 2. Mobile Responsive Slide-Over Drawer (visible on < lg when open) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer container */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] h-full shadow-2xl z-10 border-r border-slate-800">
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  )
}
