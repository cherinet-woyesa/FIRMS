import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import cbeLogo from '@/assets/cbelogo.jpg'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-white text-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <img src={cbeLogo} alt="CBE Logo" className="h-20 w-auto object-contain" />
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-cbe-purple-800">
          Officer Portal Authentication
        </h2>
        <p className="mt-1 text-center text-sm text-slate-600">
          Authorized Internal Compliance Investigators & Ethics Committee Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-slate-200">
          <Outlet />
        </div>

        <div className="mt-4 text-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-xs text-cbe-purple-600 hover:text-cbe-purple-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Whistleblower Portal</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
