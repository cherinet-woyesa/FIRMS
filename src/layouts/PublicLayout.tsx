import React from 'react'
import { Outlet } from 'react-router-dom'
import { PublicHeader, PublicFooter } from './components'

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* 1. Modular Public Header */}
      <PublicHeader />

      {/* 2. Main Page Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* 3. Modular Public Footer */}
      <PublicFooter />
    </div>
  )
}
