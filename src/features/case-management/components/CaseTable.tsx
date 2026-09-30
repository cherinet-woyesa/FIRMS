import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { CaseSummary } from '@/types/common.types'
import { CASE_STATUSES, CASE_PRIORITIES } from '@/constants/caseStatus'
import { Badge } from '@/components/ui/Badge'
import { Clock, Loader2 } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { initiateCase } from '../api/getCases'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface CaseTableProps {
  cases: CaseSummary[]
}

export const CaseTable: React.FC<CaseTableProps> = ({ cases }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [initiatingId, setInitiatingId] = useState<string | null>(null)
  const { user } = useSelector((state: RootState) => state.auth)
  const userRoles = user?.roles || []
  const canAssign = user?.permissions?.includes('cases.assign') || false
  const isPresident = userRoles.includes('President')
  const isVpIa = userRoles.some(r => r.includes('VP') || r.includes('VP-IA'))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Reference</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Priority</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Assigned Investigator</th>
              {canAssign || isPresident || isVpIa ? <th className="px-6 py-3.5 text-center">Action</th> : null}
              <th className="px-6 py-3.5">Filed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(ROUTES.CASE_DETAIL(c.id))}
                className="hover:bg-slate-50 transition cursor-pointer"
              >
                <td className="px-6 py-4 font-mono font-bold text-cbe-purple">
                  {c.referenceKey}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">
                  {c.category}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      c.priority === 'CRITICAL'
                        ? 'danger'
                        : c.priority === 'HIGH'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {CASE_PRIORITIES[c.priority]?.label || c.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="default">
                    {CASE_STATUSES[c.status]?.label || c.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600 text-xs">
                  {c.targetDepartment || 'General'}
                </td>
                <td className="px-6 py-4 text-slate-700 text-xs">
                  {c.assignedTo || <span className="text-slate-400 italic">Unassigned</span>}
                </td>
                {(() => {
                  const isInitiated = c.status === 'INITIATED' || c.status === 'INVESTIGATION_ACTIVE'
                  let showAction = canAssign || isPresident || isVpIa
                  let buttonText = c.assignedTo ? 'Reassign Team' : 'Assign Team'
                  let actionType = 'assign'

                  if (isPresident) {
                    if (!isInitiated) {
                      buttonText = 'Initiate Task'
                      actionType = 'initiate'
                    } else {
                      buttonText = 'Assign to VP-IA'
                    }
                  } else if (isVpIa) {
                    if (!isInitiated) {
                      buttonText = 'Initiate Task'
                      actionType = 'initiate'
                    } else {
                      buttonText = 'Assign to FI Director'
                    }
                  }

                  if (!showAction) return null
                  
                  const isInitiating = initiatingId === c.id

                  return (
                    <td className="px-6 py-4 text-center">
                      <button
                        disabled={isInitiating}
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (actionType === 'initiate') {
                            setInitiatingId(c.id)
                            const success = await initiateCase(c.id)
                            setInitiatingId(null)
                            if (success) {
                              queryClient.invalidateQueries({ queryKey: ['case-registry'] })
                            } else {
                              alert('Failed to initiate case.')
                            }
                          } else {
                            navigate(`${ROUTES.TEAM_CREATION}?caseId=${c.id}`)
                          }
                        }}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors border flex items-center justify-center min-w-[100px] mx-auto ${
                          actionType === 'initiate' 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-cbe-purple hover:text-white hover:border-cbe-purple'
                        } ${isInitiating ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        {isInitiating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : buttonText}
                      </button>
                    </td>
                  )
                })()}
                <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(c.submittedAt).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
