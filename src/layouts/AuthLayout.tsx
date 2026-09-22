import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/config/routes'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-900 text-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Officer Portal Authentication
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Authorized Internal Compliance Investigators & Ethics Committee Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-slate-700">
          <Outlet />
        </div>

        <div className="mt-4 text-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Whistleblower Portal</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
