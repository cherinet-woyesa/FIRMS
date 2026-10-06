import React, { useState } from 'react'
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
  PlusCircle,
  Workflow,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { logout } from '@/features/auth/store/authSlice'

interface Props {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export const DashboardSidebar: React.FC<Props> = ({ mobileOpen = false, onCloseMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }

  const userRoles = user?.roles || []
  const isAdmin = userRoles.includes('Administrator')
  const isPresident = userRoles.includes('President')
  const isVpIa = userRoles.some(role => role.includes('VP') || role.includes('VP-IA'))
  const isRegularManager = userRoles.some(role => role === 'FI Manager' || role === 'Manager' || role.includes('Director'))
  const isFiAuditor = userRoles.includes('FI Auditor')
  const isTeamLeader = userRoles.includes('Team Leader')

  // Case Assignment (Teams tab)
  const canManageTeams = isAdmin || isPresident || isVpIa || isRegularManager

  // Dashboard Access
  const canViewDashboard = isAdmin || !isFiAuditor

  // Report & Archive Access (everyone has at least "own cases" access)
  const canViewReports = true

  // Manual Case Intake Access (Team Leader, FI Auditor, President, Admin)
  const canInitiateNewReport = isAdmin || isPresident || isTeamLeader || isFiAuditor

  const navLinks = [
    { label: 'Overview', to: ROUTES.DASHBOARD, icon: LayoutDashboard, show: canViewDashboard },
    { label: 'Manual Intake', to: ROUTES.MANUAL_INTAKE, icon: PlusCircle, show: canInitiateNewReport },
    { label: 'Case Registry', to: ROUTES.CASES, icon: Inbox, show: true },
    { label: 'Teams', to: ROUTES.TEAM_CREATION, icon: Users, show: canManageTeams },
    { label: 'User Management', to: ROUTES.USERS, icon: Users, show: isAdmin },
    { label: 'Access Management', to: ROUTES.ACCESS_MANAGEMENT, icon: Lock, show: isAdmin },
    { label: 'Report Repository', to: ROUTES.REPORT_REPOSITORY, icon: FolderSearch, show: canViewReports },
    { label: 'Audit Logs', to: ROUTES.AUDIT_LOGS, icon: History, show: isAdmin },
    { label: 'Workflow Management', to: ROUTES.WORKFLOWS, icon: Workflow, show: isAdmin },
    { label: 'Settings', to: ROUTES.SETTINGS, icon: Settings, show: isAdmin },
  ]

  const sidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden">
      {/* Brand Header */}
      <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-cbe-gold shrink-0" />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-all duration-300">
              <span className="font-bold text-sm tracking-tight text-slate-900 truncate">ComplianceDesk</span>
              <span className="text-[10px] text-cbe-gold uppercase tracking-wider font-semibold truncate">
                Investigator Suite
              </span>
            </div>
          )}
        </div>
        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer shrink-0"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links - Scrolls internally only when content exceeds sidebar height */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-1">
        {navLinks.filter(item => item.show).map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 py-2.5 mr-4 rounded-r-full text-sm font-medium transition-all ${isCollapsed ? 'justify-center pl-3' : 'pl-5 pr-3'} ${isActive
                ? 'bg-purple-50/70 text-cbe-purple border-l-4 border-cbe-purple'
                : 'text-slate-600 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900'
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cbe-purple' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="shrink-0 p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Lead Compliance Officer'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {userRoles.length > 0 ? userRoles.join(', ') : 'Ethics & Internal Audit'}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer shrink-0"
          >
            <LogOut className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (visible on lg screens and wider) */}
      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-200 z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent(false)}
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-400 hover:text-cbe-purple transition-colors cursor-pointer z-40"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
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
