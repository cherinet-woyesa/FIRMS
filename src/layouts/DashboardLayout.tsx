import React from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardSidebar, DashboardHeader, DashboardFooter } from './components'

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-screen flex bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 1. Modular Sidebar - Stays fixed and only scrolls internally if content increases */}
      <DashboardSidebar />

      {/* 2. Main Content Pane - Contains header, independent scrollable page body, and footer */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Modular Header */}
        <DashboardHeader />

        {/* Dynamic Page Body - Dedicated scroll container */}
        <main id="main-content-scroll" className="flex-1 overflow-y-auto p-6 sm:p-8">
          <Outlet />
        </main>

        {/* Modular Footer */}
        <DashboardFooter />
      </div>
    </div>
  )
}
