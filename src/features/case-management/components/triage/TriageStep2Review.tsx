import React from 'react'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { TriageWorkflowState } from '../../types/triage.types'

interface Props {
  triageState: TriageWorkflowState
  onChangeTriage: (updater: (prev: TriageWorkflowState) => TriageWorkflowState) => void
  onUpdateReportField: (field: any, val: string) => void
  onNext: () => void
}

export const TriageStep2Review: React.FC<Props> = ({
  triageState,
  onChangeTriage,
  onUpdateReportField,
  onNext,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">2. Initial Review &amp; Triage</h3>
        </div>
      </div>

      {/* Jurisdiction Buttons */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">Mandate &amp; Jurisdiction</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChangeTriage((prev) => ({ ...prev, isWithinJurisdiction: true }))}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
              triageState.isWithinJurisdiction
                ? 'border-cbe-purple bg-purple-50 text-cbe-purple shadow-2xs ring-1 ring-cbe-purple'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span>Within Corruption &amp; Ethics Mandate</span>
            {triageState.isWithinJurisdiction && <Check className="w-4 h-4 text-cbe-purple" />}
          </button>

          <button
            type="button"
            onClick={() => onChangeTriage((prev) => ({ ...prev, isWithinJurisdiction: false }))}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
              !triageState.isWithinJurisdiction
                ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-2xs ring-1 ring-amber-500'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <span>Outside Mandate (Referral Required)</span>
            {!triageState.isWithinJurisdiction && <Check className="w-4 h-4 text-amber-600" />}
          </button>
        </div>
      </div>

      {/* Triage Rating Matrix */}
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-bold text-slate-700">Triage Criteria Scoring</label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Specificity */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Specificity &amp; Detail</span>
            <div className="grid grid-cols-3 gap-1">
              {(['High', 'Medium', 'Low'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    onChangeTriage((prev) => ({ ...prev, specificityRating: lvl }))
                    onUpdateReportField('specificityAndDetail', `${lvl} – verified details.`)
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    triageState.specificityRating === lvl
                      ? 'bg-cbe-purple text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Corroboration */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Corroboration Level</span>
            <div className="grid grid-cols-3 gap-1">
              {(['High', 'Medium', 'Low'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    onChangeTriage((prev) => ({ ...prev, corroborationRating: lvl }))
                    onUpdateReportField('credibilityAssessment', `${lvl} credibility.`)
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    triageState.corroborationRating === lvl
                      ? 'bg-cbe-purple text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Severity &amp; Risk</span>
            <div className="grid grid-cols-3 gap-1">
              {(['High', 'Medium', 'Low'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    onChangeTriage((prev) => ({ ...prev, severityRating: lvl }))
                    onUpdateReportField('severityAssessment', `${lvl} risk.`)
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    triageState.severityRating === lvl
                      ? 'bg-cbe-purple text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-end pt-3 border-t border-slate-100">
        <Button
          size="sm"
          onClick={onNext}
          className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
        >
          <span>Covert Fact-Checking</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
