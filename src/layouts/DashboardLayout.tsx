import React from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardSidebar, DashboardHeader, DashboardFooter } from './components'

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* 1. Modular Sidebar */}
      <DashboardSidebar />

      {/* 2. Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Modular Header */}
        <DashboardHeader />

        {/* Dynamic Page Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <Outlet />
        </main>

        {/* Modular Footer */}
        <DashboardFooter />
      </div>
    </div>
  )
}
