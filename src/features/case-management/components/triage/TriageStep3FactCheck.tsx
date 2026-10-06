import React from 'react'
import { Building, Globe, Database, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { TriageWorkflowState } from '../../types/triage.types'

interface Props {
  triageState: TriageWorkflowState
  onChangeTriage: (updater: (prev: TriageWorkflowState) => TriageWorkflowState) => void
  onUpdateReportField: (field: any, val: string) => void
  onPrev: () => void
  onNext: () => void
}

export const TriageStep3FactCheck: React.FC<Props> = ({
  triageState,
  onChangeTriage,
  onUpdateReportField,
  onPrev,
  onNext,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">3. Covert Fact-Checking</h3>
        </div>
      </div>

      <div className="space-y-3">
        {/* Item 1: Org Chart */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-cbe-purple" />
              <span className="text-xs font-bold text-slate-800">Organization &amp; Authority Review</span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={triageState.orgChartReviewed}
                onChange={(e) =>
                  onChangeTriage((prev) => ({ ...prev, orgChartReviewed: e.target.checked }))
                }
                className="w-3.5 h-3.5 text-cbe-purple rounded"
              />
              <span>Verified</span>
            </label>
          </div>
          <input
            type="text"
            value={triageState.orgChartFindings || ''}
            onChange={(e) => {
              const val = e.target.value
              onChangeTriage((prev) => ({ ...prev, orgChartFindings: val }))
              onUpdateReportField('initialReviewFindings', val)
            }}
            className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-1 focus:ring-cbe-purple"
          />
        </div>

        {/* Item 2: OSINT */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cbe-gold" />
              <span className="text-xs font-bold text-slate-800">Open Source Due Diligence</span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={triageState.osintReviewed}
                onChange={(e) =>
                  onChangeTriage((prev) => ({ ...prev, osintReviewed: e.target.checked }))
                }
                className="w-3.5 h-3.5 text-cbe-purple rounded"
              />
              <span>Verified</span>
            </label>
          </div>
          <input
            type="text"
            value={triageState.osintFindings || ''}
            onChange={(e) =>
              onChangeTriage((prev) => ({ ...prev, osintFindings: e.target.value }))
            }
            className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-1 focus:ring-cbe-purple"
          />
        </div>

        {/* Item 3: Internal Ledgers */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Internal Records Review</span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={triageState.internalRecordsReviewed}
                onChange={(e) =>
                  onChangeTriage((prev) => ({
                    ...prev,
                    internalRecordsReviewed: e.target.checked,
                  }))
                }
                className="w-3.5 h-3.5 text-cbe-purple rounded"
              />
              <span>Verified</span>
            </label>
          </div>
          <input
            type="text"
            value={triageState.internalRecordsFindings || ''}
            onChange={(e) =>
              onChangeTriage((prev) => ({
                ...prev,
                internalRecordsFindings: e.target.value,
              }))
            }
            className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-1 focus:ring-cbe-purple"
          />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          className="text-xs font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 2
        </Button>
        <Button
          size="sm"
          onClick={onNext}
          className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
        >
          <span>Proceed to Step 4: Assessment Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
