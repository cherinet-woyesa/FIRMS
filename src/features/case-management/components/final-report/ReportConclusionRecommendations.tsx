import React from 'react'
import { MessageSquare } from 'lucide-react'
import type { FinalInvestigationReport } from '../../types/investigation.types'

interface Props {
  report: FinalInvestigationReport
  updateField: (field: keyof FinalInvestigationReport, value: any) => void
  isEditable: boolean
  onOpenComments: (section: string) => void
}

export const ReportConclusionRecommendations: React.FC<Props> = ({
  report,
  updateField,
  isEditable,
  onOpenComments,
}) => {
  const getDisciplinaryText = (): string => {
    if (typeof report.disciplinaryLegalActions === 'string') return report.disciplinaryLegalActions
    if (Array.isArray(report.disciplinaryLegalActions)) return report.disciplinaryLegalActions.join('\n')
    return ''
  }

  const getSystemicText = (): string => {
    if (typeof report.systemicPreventativeMeasures === 'string') return report.systemicPreventativeMeasures
    if (Array.isArray(report.systemicPreventativeMeasures)) return report.systemicPreventativeMeasures.join('\n')
    return ''
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 5. CONCLUSION AND DETERMINATION                                           */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">5. Conclusion and Determination</h3>
            <button
              type="button"
              onClick={() => onOpenComments('5. Conclusion and Determination')}
              className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
              title="Add Section Comment"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Field 1: Conclusion */}
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Conclusion
          </label>
          <textarea
            value={report.conclusionText || ''}
            onChange={(e) => updateField('conclusionText', e.target.value)}
            disabled={!isEditable}
            rows={4}
            className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
          />
        </div>

        {/* Field 2: Policy/Law Violated */}
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Policy/Law Violated
          </label>
          <textarea
            value={report.policyLawViolated || ''}
            onChange={(e) => updateField('policyLawViolated', e.target.value)}
            disabled={!isEditable}
            rows={3}
            className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. RECOMMENDATIONS                                                        */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">6. Recommendations</h3>
            <button
              type="button"
              onClick={() => onOpenComments('6. Recommendations')}
              className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
              title="Add Section Comment"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Field 1: Disciplinary/Legal Action */}
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Disciplinary/Legal Action
          </label>
          <textarea
            value={getDisciplinaryText()}
            onChange={(e) => updateField('disciplinaryLegalActions', e.target.value)}
            disabled={!isEditable}
            rows={4}
            className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
          />
        </div>

        {/* Field 2: Systemic/Preventative Measures */}
        <div>
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
            Systemic/Preventative Measures
          </label>
          <textarea
            value={getSystemicText()}
            onChange={(e) => updateField('systemicPreventativeMeasures', e.target.value)}
            disabled={!isEditable}
            rows={4}
            className="w-full text-sm p-3.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
          />
        </div>
      </div>
    </div>
  )
}
