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
    <div className="h-screen print:h-auto flex bg-white text-slate-900 font-sans overflow-hidden print:overflow-visible">
      {/* 1. Modular Responsive Sidebar (desktop pinned, mobile slide-over) */}
      <div className="print:hidden">
        <DashboardSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* 2. Main Content Pane - Contains responsive header, independent scrollable page body, and footer */}
      <div className="flex-1 flex flex-col min-w-0 h-screen print:h-auto overflow-hidden print:overflow-visible">
        {/* Modular Header with Mobile Menu Trigger */}
        <div className="print:hidden">
          <DashboardHeader onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
        </div>

        {/* Dynamic Page Body - Dedicated scroll container */}
        <main id="main-content-scroll" className="flex-1 overflow-y-auto print:overflow-visible p-4 sm:p-6 lg:p-8 print:p-0 bg-white">
          <Outlet />
        </main>

        {/* Modular Footer */}
        <div className="print:hidden">
          <DashboardFooter />
        </div>
      </div>
    </div>
  )
}
