import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CaseSummary } from '@/types/common.types'
import { CASE_STATUSES, CASE_PRIORITIES } from '@/constants/caseStatus'
import { Badge } from '@/components/ui/Badge'
import {
  Clock,
  Loader2,
  MoreVertical,
  Users,
  FileText,
  ClipboardCheck,
} from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { initiateCase } from '../api/getCases'
import { useQueryClient } from '@tanstack/react-query'

interface CaseTableProps {
  cases: CaseSummary[]
}

export const CaseTable: React.FC<CaseTableProps> = ({ cases }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [initiatingId, setInitiatingId] = useState<string | null>(null)
  const [activeMenuCase, setActiveMenuCase] = useState<CaseSummary | null>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  const { user } = useSelector((state: RootState) => state.auth)
  const userRoles = user?.roles || []
  const canAssign =
    user?.permissions?.includes('cases.assign') ||
    userRoles.some(
      (r) =>
        r.includes('Manager') ||
        r.includes('Director') ||
        r.includes('President') ||
        r.includes('VP') ||
        r.includes('Admin')
    )
  const isPresident = userRoles.includes('President')
  const isVpIa = userRoles.some((r) => r.includes('VP') || r.includes('VP-IA'))

  // Close dropdown menu when clicking outside, scrolling, or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuCase(null)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenuCase(null)
      }
    }
    const handleScrollOrResize = () => {
      setActiveMenuCase(null)
    }

    if (activeMenuCase) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
      window.addEventListener('scroll', handleScrollOrResize, true)
      window.addEventListener('resize', handleScrollOrResize)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [activeMenuCase])

  return (
    <>
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
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
                <th className="px-6 py-3.5 text-center">Action</th>
                <th className="px-6 py-3.5">Filed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => {
                const isInitiating = initiatingId === c.id
                const isMenuOpen = activeMenuCase?.id === c.id

                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(ROUTES.CASE_DETAIL(c.id))}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
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

                    {/* Three-Dots Action Button */}
                    <td
                      className="px-6 py-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isMenuOpen) {
                            setActiveMenuCase(null)
                            return
                          }
                          const rect = e.currentTarget.getBoundingClientRect()
                          const menuEstimatedHeight = 140
                          const spaceBelow = window.innerHeight - rect.bottom
                          const top =
                            spaceBelow < menuEstimatedHeight
                              ? rect.top - menuEstimatedHeight - 4
                              : rect.bottom + 4
                          const right = Math.max(16, window.innerWidth - rect.right)

                          setMenuPos({ top, right })
                          setActiveMenuCase(c)
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer inline-flex items-center justify-center ${
                          isMenuOpen
                            ? 'bg-cbe-purple text-white border-cbe-purple shadow-xs ring-1 ring-cbe-purple'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'
                        }`}
                        title="Case Actions"
                      >
                        {isInitiating ? (
                          <Loader2 className="w-4 h-4 animate-spin text-cbe-purple" />
                        ) : (
                          <MoreVertical className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(c.submittedAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Popover Menu (Position Fixed to prevent table overflow clipping) */}
      {activeMenuCase && menuPos && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${menuPos.top}px`,
            right: `${menuPos.right}px`,
            zIndex: 9999,
          }}
          className="w-56 bg-white rounded-xl shadow-2xl border border-slate-200/95 py-1.5 animate-in fade-in zoom-in-95 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Option 1: Assign Team */}
          {(() => {
            const isInitiated =
              activeMenuCase.status === 'INITIATED' ||
              activeMenuCase.status === 'INVESTIGATION_ACTIVE'
            let buttonText = activeMenuCase.assignedTo ? 'Reassign Team' : 'Assign Team'
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

            if (!canAssign && !isPresident && !isVpIa) return null

            return (
              <button
                type="button"
                disabled={initiatingId === activeMenuCase.id}
                onClick={async (e) => {
                  e.stopPropagation()
                  const targetCase = activeMenuCase
                  setActiveMenuCase(null)
                  if (actionType === 'initiate') {
                    setInitiatingId(targetCase.id)
                    const success = await initiateCase(targetCase.id)
                    setInitiatingId(null)
                    if (success) {
                      queryClient.invalidateQueries({
                        queryKey: ['case-registry'],
                      })
                    } else {
                      alert('Failed to initiate case.')
                    }
                  } else {
                    navigate(`${ROUTES.TEAM_CREATION}?caseId=${targetCase.id}`)
                  }
                }}
                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-cbe-purple hover:bg-purple-50 flex items-center gap-2.5 transition cursor-pointer"
              >
                <Users className="w-4 h-4 text-cbe-purple shrink-0" />
                <span>{buttonText}</span>
              </button>
            )
          })()}

          {/* Option 2: Case Detail (Navigates to dedicated full page) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              const id = activeMenuCase.id
              setActiveMenuCase(null)
              navigate(ROUTES.CASE_INTAKE_DETAILS(id))
            }}
            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-cbe-purple hover:bg-purple-50 flex items-center gap-2.5 transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Case Detail</span>
          </button>

          {/* Option 3: Preliminary Investigation Step */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              const id = activeMenuCase.id
              setActiveMenuCase(null)
              navigate(ROUTES.CASE_DETAIL(id))
            }}
            className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-cbe-purple hover:bg-purple-50 flex items-center gap-2.5 transition cursor-pointer border-t border-slate-100"
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preliminary Investigation Step</span>
          </button>
        </div>
      )}
    </>
  )
}
