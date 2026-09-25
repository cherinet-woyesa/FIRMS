import React from 'react'
import { Users } from 'lucide-react'
import { TeamForm } from './TeamForm'

export const TeamCreationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Team Creation
            </h1>

            <p className="text-sm text-slate-600 mt-1">
              Create an investigation team and assign members to a case.
            </p>
          </div>
        </div>
      </div>

      {/* Team Form */}
      <TeamForm />
    </div>
  )
}