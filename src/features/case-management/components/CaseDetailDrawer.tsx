import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  X,
  Calendar,
  Building,
  User,
  Shield,
  ArrowRight,
  MapPin,
  Paperclip,
} from 'lucide-react'
import { fetchCaseById, type CaseDetailedInvestigation } from '../api/getCases'
import type { CaseSummary } from '@/types/common.types'
import { Badge } from '@/components/ui/Badge'
import { CASE_STATUSES, CASE_PRIORITIES } from '@/constants/caseStatus'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'
import { ROUTES } from '@/config/routes'

interface Props {
  caseSummary: CaseSummary | null
  isOpen: boolean
  onClose: () => void
}

export const CaseDetailDrawer: React.FC<Props> = ({
  caseSummary,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const [details, setDetails] = useState<CaseDetailedInvestigation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && caseSummary) {
      let isMounted = true
      setIsLoading(true)
      fetchCaseById(caseSummary.id)
        .then((data) => {
          if (isMounted) {
            setDetails(data)
            setIsLoading(false)
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false)
        })
      return () => {
        isMounted = false
      }
    } else {
      setDetails(null)
    }
  }, [isOpen, caseSummary])

  if (!isOpen || !caseSummary) return null

  const referenceKey = details?.referenceKey || caseSummary.referenceKey
  const status = details?.status || caseSummary.status
  const priority = details?.priority || caseSummary.priority
  const category = details?.category || caseSummary.category
  const targetDepartment = details?.targetDepartment || caseSummary.targetDepartment
  const assignedTo = details?.assignedTo || caseSummary.assignedTo
  const submittedAt = details?.submittedAt || caseSummary.submittedAt

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cbe-purple/10 flex items-center justify-center text-cbe-purple shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Case Details
                </h3>
                <span className="font-mono text-xs font-bold text-cbe-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  {referenceKey}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Intake information &amp; whistleblower report metadata
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700">
          {/* Metadata Pill Banner */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  priority === 'CRITICAL'
                    ? 'danger'
                    : priority === 'HIGH'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {CASE_PRIORITIES[priority]?.label || priority}
              </Badge>
              <Badge variant="default">
                {CASE_STATUSES[status]?.label || status}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Filed on {new Date(submittedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Category
              </span>
              <span className="font-medium text-slate-800 text-xs block">
                {category}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400" /> Target Department
              </span>
              <span className="font-medium text-slate-800 text-xs block">
                {targetDepartment || 'General / Central Office'}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Assigned Investigator
              </span>
              <span className="font-medium text-slate-800 text-xs block">
                {assignedTo || <span className="text-slate-400 italic">Unassigned</span>}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                <Shield className="w-3 h-3 text-slate-400" /> Reporting Mode
              </span>
              <span className="font-medium text-slate-800 text-xs block capitalize">
                {details?.reportingMode || (caseSummary.isAnonymous ? 'Anonymous' : 'Confidential')}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Spinner size="sm" />
              <p className="text-[11px]">Loading intake narrative...</p>
            </div>
          ) : (
            <>
              {/* Allegation Summary */}
              {details?.summary && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">
                    Allegation Summary
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                    {details.summary}
                  </div>
                </div>
              )}

              {/* Detailed Narrative */}
              {details?.detailedNarrative && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">
                    Detailed Statement / Narrative
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line leading-relaxed text-slate-800 font-sans">
                    {details.detailedNarrative}
                  </div>
                </div>
              )}

              {/* Accused Person(s) & Department */}
              {(details?.corruptedPersonNames || details?.jobPositions || details?.divisionDepartmentBranch) && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs">
                    Subject / Accused Details
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                    {details.corruptedPersonNames && (
                      <p>
                        <strong className="text-slate-600">Person(s):</strong>{' '}
                        <span className="text-slate-900 font-medium">{details.corruptedPersonNames}</span>
                      </p>
                    )}
                    {details.jobPositions && (
                      <p>
                        <strong className="text-slate-600">Position / Title:</strong>{' '}
                        <span className="text-slate-800">{details.jobPositions}</span>
                      </p>
                    )}
                    {details.divisionDepartmentBranch && (
                      <p>
                        <strong className="text-slate-600">Unit / Branch:</strong>{' '}
                        <span className="text-slate-800">{details.divisionDepartmentBranch}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Incident Date & Location */}
              {(details?.incidentDate || details?.incidentStartDate || details?.incidentLocation) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block text-xs flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Incident Date
                    </span>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800">
                      {details.incidentDate || details.incidentStartDate || 'Not specified'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 block text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                    </span>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800 truncate">
                      {details.incidentLocation || 'Not specified'}
                    </div>
                  </div>
                </div>
              )}

              {/* Evidence in Possession */}
              {details?.evidenceInPossession && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 block text-xs flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" /> Evidence in Possession
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                    {details.evidenceInPossession}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Close
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              onClose()
              navigate(ROUTES.CASE_DETAIL(caseSummary.id))
            }}
            className="bg-cbe-purple hover:bg-cbe-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <span>Preliminary Investigation Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
