import React from 'react'
import {
  Printer,
  Download,
  Check,
  ShieldCheck,
  AlertCircle,
  FileText,
  Search,
  Scale,
  Building,
  User,
  Clock,
  Briefcase,
} from 'lucide-react'
import type { PreliminaryAssessmentReport } from '../types/triage.types'
import { Button } from '@/components/ui/Button'

interface Props {
  report: PreliminaryAssessmentReport
  onChangeReport?: (field: keyof PreliminaryAssessmentReport, value: string) => void
  isEditable?: boolean
}

export const PreliminaryAssessmentReportView: React.FC<Props> = ({
  report,
  onChangeReport,
  isEditable = true,
}) => {
  const [showAllegationContext, setShowAllegationContext] = React.useState(false)
  const [showTriageFindings, setShowTriageFindings] = React.useState(false)

  const handlePrint = () => {
    window.print()
  }

  const updateField = (field: keyof PreliminaryAssessmentReport, value: string) => {
    if (onChangeReport && isEditable) {
      onChangeReport(field, value)
    }
  }

  return (
    <div className="space-y-4 print:p-0">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-bold text-slate-900">
              Preliminary Assessment Report
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                report.predicationDetermination === 'Sufficient'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {report.predicationDetermination === 'Sufficient' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              {report.predicationDetermination} Predication
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs border-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Accordions for Supporting Data: Hidden by default, visible on demand */}
      <div className="space-y-2">
        {/* Accordion 1: Allegation & Case Context */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setShowAllegationContext(!showAllegationContext)}
            className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cbe-purple" />
              <span className="text-xs font-bold text-slate-800">
                1. Allegation &amp; Case Context
              </span>
              <span className="text-[11px] text-slate-500 font-normal ml-1">
                ({report.allegedSubjects || 'Subject'} • {report.typeOfMisconduct || 'Misconduct'})
              </span>
            </div>
            <span className="text-xs font-semibold text-cbe-purple hover:underline">
              {showAllegationContext ? 'Hide Context ▲' : 'View Context ▼'}
            </span>
          </button>

          {showAllegationContext && (
            <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
              {/* 4-Item Quick Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Case Reference</span>
                  <span className="font-mono font-bold text-xs text-cbe-purple mt-0.5 block">{report.caseId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Receipt Date</span>
                  <input
                    type="text"
                    value={report.dateReportReceipt}
                    onChange={(e) => updateField('dateReportReceipt', e.target.value)}
                    disabled={!isEditable}
                    placeholder="DD/MM/YYYY"
                    className="text-xs font-semibold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Source Channel</span>
                  <input
                    type="text"
                    value={report.sourceReportingChannel}
                    onChange={(e) => updateField('sourceReportingChannel', e.target.value)}
                    disabled={!isEditable}
                    className="text-xs font-semibold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full truncate"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Assigned Lead</span>
                  <input
                    type="text"
                    value={report.investigatorTeamAssigned}
                    onChange={(e) => updateField('investigatorTeamAssigned', e.target.value)}
                    disabled={!isEditable}
                    className="text-xs font-semibold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full truncate"
                  />
                </div>
              </div>

              {/* Allegation Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> Accused Subject(s)
                  </label>
                  <input
                    type="text"
                    value={report.allegedSubjects}
                    onChange={(e) => updateField('allegedSubjects', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" /> Unit / Division
                  </label>
                  <input
                    type="text"
                    value={report.allegedOrganizationUnit}
                    onChange={(e) => updateField('allegedOrganizationUnit', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400" /> Misconduct Type
                  </label>
                  <input
                    type="text"
                    value={report.typeOfMisconduct}
                    onChange={(e) => updateField('typeOfMisconduct', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Incident Period
                  </label>
                  <input
                    type="text"
                    value={report.allegedPeriodOfIncident}
                    onChange={(e) => updateField('allegedPeriodOfIncident', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>
              </div>

              {/* Narrative & Legal Basis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Allegation Summary</label>
                  <textarea
                    rows={2}
                    value={report.allegationSummary}
                    onChange={(e) => updateField('allegationSummary', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Applicable Law / Policy</label>
                  <textarea
                    rows={2}
                    value={report.applicableLawPolicy}
                    onChange={(e) => updateField('applicableLawPolicy', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Triage Assessment & Findings */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setShowTriageFindings(!showTriageFindings)}
            className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-left transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cbe-purple" />
              <span className="text-xs font-bold text-slate-800">
                2. Triage &amp; Covert Fact-Check Findings
              </span>
              <span className="text-[11px] text-slate-500 font-normal ml-1">
                (Specificity: {report.specificityAndDetail?.split(' ')[0] || 'Medium'} • Credibility: {report.credibilityAssessment?.split(' ')[0] || 'High'})
              </span>
            </div>
            <span className="text-xs font-semibold text-cbe-purple hover:underline">
              {showTriageFindings ? 'Hide Findings ▲' : 'View Findings ▼'}
            </span>
          </button>

          {showTriageFindings && (
            <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
              {/* 3 Core Criteria Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">Specificity</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cbe-purple text-white">
                      {report.specificityAndDetail?.startsWith('High') ? 'High' : report.specificityAndDetail?.startsWith('Low') ? 'Low' : 'Medium'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={report.specificityAndDetail}
                    onChange={(e) => updateField('specificityAndDetail', e.target.value)}
                    disabled={!isEditable}
                    placeholder="Specificity notes..."
                    className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white text-slate-900"
                  />
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">Credibility</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                      {report.credibilityAssessment?.startsWith('High') ? 'High' : report.credibilityAssessment?.startsWith('Low') ? 'Low' : 'Medium'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={report.credibilityAssessment}
                    onChange={(e) => updateField('credibilityAssessment', e.target.value)}
                    disabled={!isEditable}
                    placeholder="Credibility notes..."
                    className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white text-slate-900"
                  />
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">Severity</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                      {report.severityAssessment?.startsWith('High') ? 'High' : report.severityAssessment?.startsWith('Low') ? 'Low' : 'Medium'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={report.severityAssessment}
                    onChange={(e) => updateField('severityAssessment', e.target.value)}
                    disabled={!isEditable}
                    placeholder="Severity notes..."
                    className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Evidence & Fact-Check Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Evidence In Possession</label>
                  <textarea
                    rows={2}
                    value={report.evidenceProvided}
                    onChange={(e) => updateField('evidenceProvided', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Initial Review &amp; OSINT Findings</label>
                  <textarea
                    rows={2}
                    value={report.initialReviewFindings}
                    onChange={(e) => updateField('initialReviewFindings', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Primary Card: Predication Determination & Decision */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Scale className="w-4 h-4 text-cbe-purple" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Predication Determination &amp; Recommendation
          </h3>
        </div>

        {/* Step A: Predication Determination */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            A. Predication Threshold Determination
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateField('predicationDetermination', 'Sufficient')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${report.predicationDetermination === 'Sufficient'
                ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500'
                : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${report.predicationDetermination === 'Sufficient'
                  ? 'bg-emerald-600 text-white'
                  : 'border border-slate-300'
                  }`}
              >
                {report.predicationDetermination === 'Sufficient' && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Sufficient Predication Found
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Factual basis and credible evidence meet threshold for formal inquiry.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => updateField('predicationDetermination', 'Insufficient')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${report.predicationDetermination === 'Insufficient'
                ? 'bg-rose-50/70 border-rose-500 ring-1 ring-rose-500'
                : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${report.predicationDetermination === 'Insufficient'
                  ? 'bg-rose-600 text-white'
                  : 'border border-slate-300'
                  }`}
              >
                {report.predicationDetermination === 'Insufficient' && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Insufficient Predication Found
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Lacks specific facts or tangible corroboration to proceed.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Step B: Recommended Action */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-800 block">
            B. Recommended Course of Action
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'Full Investigation',
                label: 'Full Investigation',
                description: 'Initiate formal internal audit or forensic investigation.',
              },
              {
                id: 'Referral',
                label: 'Referral',
                description: 'Transfer matter to external or specialized body.',
              },
              {
                id: 'Case Closure',
                label: 'Case Closure',
                description: ' ',
              },
            ].map((action) => {
              const isSelected = report.recommendedAction === action.id
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => updateField('recommendedAction', action.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${isSelected
                    ? 'bg-cbe-purple text-white border-cbe-purple shadow-sm'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{action.label}</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-white text-cbe-purple' : 'border border-slate-300'
                        }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <span
                    className={`text-[11px] leading-tight block ${isSelected ? 'text-purple-100' : 'text-slate-500'
                      }`}
                  >
                    {action.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* If Referral Selected */}
        {report.recommendedAction === 'Referral' && (
          <div className="space-y-1.5 p-3 rounded-lg bg-amber-50/60 border border-amber-200">
            <label className="text-xs font-semibold text-amber-900 block">
              Specify Referral Authority or Body
            </label>
            <input
              type="text"
              value={report.referralTarget || ''}
              onChange={(e) => updateField('referralTarget', e.target.value)}
              disabled={!isEditable}
              placeholder="e.g. Human Resources Directorate, Federal Police, FEACC"
              className="w-full text-xs border border-amber-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
            />
          </div>
        )}

        {/* Step C: Next Steps & Interim Measures */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-800 block">
            C. Next Steps &amp; Interim Measures
          </label>
          <textarea
            rows={2}
            value={report.nextStepsInterimMeasures}
            onChange={(e) => updateField('nextStepsInterimMeasures', e.target.value)}
            disabled={!isEditable}
            placeholder="e.g. Freeze procurement award, secure evidence logs, notify internal audit head..."
            className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
          />
        </div>

        {/* Sign-off completion date */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Date of Assessment Completion:</span>
          <input
            type="text"
            value={report.dateAssessmentCompletion}
            onChange={(e) => updateField('dateAssessmentCompletion', e.target.value)}
            disabled={!isEditable}
            placeholder="DD/MM/YYYY"
            className="text-xs font-semibold text-slate-800 border border-slate-200 rounded px-2 py-1 bg-white text-right w-32"
          />
        </div>
      </div>
    </div>
  )
}
