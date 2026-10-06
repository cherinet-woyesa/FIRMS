import React from 'react'
import { MessageSquare } from 'lucide-react'
import type { FinalInvestigationReport } from '../../types/investigation.types'

interface Props {
  report: FinalInvestigationReport
  updateField: (field: keyof FinalInvestigationReport, value: any) => void
  isEditable: boolean
  onOpenComments: (section: string) => void
}

export const ReportMethodology: React.FC<Props> = ({
  report,
  updateField,
  isEditable,
  onOpenComments,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">3. Methodology</h3>
          <button
            type="button"
            onClick={() => onOpenComments('3. Methodology')}
            className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
            title="Add Section Comment"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Field 1: Document Review */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Document Review
        </label>
        <textarea
          value={report.documentReview || ''}
          onChange={(e) => updateField('documentReview', e.target.value)}
          disabled={!isEditable}
          rows={4}
          className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
        />
      </div>

      {/* Field 2: Forensic Analysis */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Forensic Analysis
        </label>
        <textarea
          value={report.forensicAnalysis || ''}
          onChange={(e) => updateField('forensicAnalysis', e.target.value)}
          disabled={!isEditable}
          rows={4}
          className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
        />
      </div>

      {/* Field 3: Interviews Conducted */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Interviews Conducted
        </label>
        <textarea
          value={report.interviewsConducted || ''}
          onChange={(e) => updateField('interviewsConducted', e.target.value)}
          disabled={!isEditable}
          rows={4}
          className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
        />
      </div>
    </div>
  )
}
