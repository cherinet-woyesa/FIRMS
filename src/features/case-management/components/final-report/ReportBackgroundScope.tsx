import React from 'react'
import { Calendar, MessageSquare } from 'lucide-react'
import type { FinalInvestigationReport } from '../../types/investigation.types'

interface Props {
  report: FinalInvestigationReport
  updateField: (field: keyof FinalInvestigationReport, value: any) => void
  isEditable: boolean
  onOpenComments: (section: string) => void
}

export const ReportBackgroundScope: React.FC<Props> = ({
  report,
  updateField,
  isEditable,
  onOpenComments,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">2. Background and Scope</h3>
          <button
            type="button"
            onClick={() => onOpenComments('2. Background and Scope')}
            className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
            title="Add Section Comment"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: Source of Report & Date Commenced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Source of Report
          </label>
          <input
            type="text"
            value={report.sourceOfReport || ''}
            onChange={(e) => updateField('sourceOfReport', e.target.value)}
            disabled={!isEditable}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition disabled:bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Date Investigation Commenced
          </label>
          <div className="relative">
            <input
              type="date"
              value={report.dateInvestigationCommenced || ''}
              onChange={(e) => updateField('dateInvestigationCommenced', e.target.value)}
              disabled={!isEditable}
              className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition disabled:bg-slate-50"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 2: Original Allegation (Verbatim) */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Original Allegation
        </label>
        <textarea
          value={report.originalAllegationVerbatim || ''}
          onChange={(e) => updateField('originalAllegationVerbatim', e.target.value)}
          disabled={!isEditable}
          rows={4}
          className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50 font-serif text-slate-800"
        />
      </div>

      {/* Row 3: Scope of Investigation */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Scope of Investigation
        </label>
        <textarea
          value={report.scopeOfInvestigation || ''}
          onChange={(e) => updateField('scopeOfInvestigation', e.target.value)}
          disabled={!isEditable}
          rows={4}
          className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
        />
      </div>

      {/* Row 4: Investigative Team */}
      <div>
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
          Investigative Team
        </label>
        <textarea
          value={report.investigativeTeam || ''}
          onChange={(e) => updateField('investigativeTeam', e.target.value)}
          disabled={!isEditable}
          rows={2}
          className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
        />
      </div>
    </div>
  )
}
