import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DashboardSidebar, DashboardHeader, DashboardFooter } from './components'

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Automatically close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. Modular Responsive Sidebar (desktop pinned, mobile slide-over) */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Pane - Contains responsive header, independent scrollable page body, and footer */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Modular Header with Mobile Menu Trigger */}
        <DashboardHeader onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

        {/* Dynamic Page Body - Dedicated scroll container */}
        <main id="main-content-scroll" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Modular Footer */}
        <DashboardFooter />
      </div>
    </div>
  )
}
