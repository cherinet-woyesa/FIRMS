import React from 'react'
import { Calendar, MessageSquare } from 'lucide-react'
import type { FinalInvestigationReport } from '../../types/investigation.types'

const FINDING_OPTIONS: Array<{ value: 'Substantiated' | 'Not Substantiated' | 'Unfounded'; label: string }> = [
  { value: 'Substantiated', label: 'Substantiated' },
  { value: 'Not Substantiated', label: 'Not Substantiated' },
  { value: 'Unfounded', label: 'Unfounded' },
]

interface Props {
  report: FinalInvestigationReport
  updateField: (field: keyof FinalInvestigationReport, value: any) => void
  isEditable: boolean
  onOpenComments: (section: string) => void
}

export const ReportExecutiveSummary: React.FC<Props> = ({
  report,
  updateField,
  isEditable,
  onOpenComments,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">1. Executive Summary</h3>
          <button
            type="button"
            onClick={() => onOpenComments('1. Executive Summary')}
            className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
            title="Add Section Comment"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
        <span className="font-mono text-xs text-slate-400 font-medium">Ref: {report.caseId || 'CASE-2026-0042'}</span>
      </div>

      {/* Row 1: Case ID & Date of Final Submission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Case ID/Reference
          </label>
          <input
            type="text"
            value={report.caseId || ''}
            onChange={(e) => updateField('caseId', e.target.value)}
            disabled={!isEditable}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition disabled:bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Date of Final Submission
          </label>
          <div className="relative">
            <input
              type="date"
              value={report.dateFinalSubmission || ''}
              onChange={(e) => updateField('dateFinalSubmission', e.target.value)}
              disabled={!isEditable}
              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition disabled:bg-slate-50"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 2: Allegation Summary */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Allegation Summary
        </label>
        <textarea
          value={report.allegationSummary || ''}
          onChange={(e) => updateField('allegationSummary', e.target.value)}
          disabled={!isEditable}
          rows={4}
          className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
        />
      </div>

      {/* Row 3: Investigative Finding (3 Radio Option Cards) */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-2">
          Investigative Finding
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FINDING_OPTIONS.map((opt) => {
            const isSelected = report.investigativeFinding === opt.value
            return (
              <div
                key={opt.value}
                onClick={() => isEditable && updateField('investigativeFinding', opt.value)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition select-none ${
                  isEditable ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isSelected
                    ? 'border-cbe-purple bg-[#FBF4FA] text-slate-900 shadow-2xs ring-1 ring-cbe-purple/40'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                    isSelected ? 'border-cbe-purple bg-cbe-purple' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                <span className="text-xs font-semibold">{opt.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 4: Estimated Financial Impact */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Estimated Financial Impact
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <span className="text-xs font-bold text-cbe-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              ETB
            </span>
          </div>
          <input
            type="text"
            value={report.estimatedFinancialImpact || ''}
            onChange={(e) => updateField('estimatedFinancialImpact', e.target.value)}
            disabled={!isEditable}
            className="w-full text-sm pl-16 pr-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple font-mono font-medium transition disabled:bg-slate-50"
          />
        </div>
      </div>

      {/* Row 5: Recommendation */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Recommendation
        </label>
        <textarea
          value={report.recommendation || ''}
          onChange={(e) => updateField('recommendation', e.target.value)}
          disabled={!isEditable}
          rows={4}
          className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
        />
      </div>
    </div>
  )
}
