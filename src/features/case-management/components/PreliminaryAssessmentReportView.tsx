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
import { RichTextEditor } from '@/components/forms/RichTextEditor'

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
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${report.predicationDetermination === 'Sufficient'
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
        {/* Section 1: Allegation & Case Context */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all">
          <div className="w-full px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cbe-purple" />
              <span className="text-xs font-bold text-slate-800">
                1. Allegation &amp; Case Context
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3 bg-white">
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
                  <User className="w-3 h-3 text-slate-400" /> Alleged Subject
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
                  <Building className="w-3 h-3 text-slate-400" /> Alleged Organization/Unit
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
                <RichTextEditor
                  value={report.allegationSummary}
                  onChange={(val) => updateField('allegationSummary', val)}
                  isEditable={isEditable}
                  minHeight="100px"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Applicable Law / Policy</label>
                <RichTextEditor
                  value={report.applicableLawPolicy}
                  onChange={(val) => updateField('applicableLawPolicy', val)}
                  isEditable={isEditable}
                  minHeight="100px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Triage Assessment & Findings */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all">
          <div className="w-full px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-cbe-purple" />
              <span className="text-xs font-bold text-slate-800">
                2. Triage &amp; Covert Fact-Check Findings
              </span>
            </div>
          </div>

          <div className="p-4 space-y-3 bg-white">
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
                <label className="text-[11px] font-semibold text-slate-500">Evidence Provided</label>
                <RichTextEditor
                  value={report.evidenceProvided}
                  onChange={(val) => updateField('evidenceProvided', val)}
                  isEditable={isEditable}
                  minHeight="100px"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Initial Review Findings</label>
                <RichTextEditor
                  value={report.initialReviewFindings}
                  onChange={(val) => updateField('initialReviewFindings', val)}
                  isEditable={isEditable}
                  minHeight="100px"
                />
              </div>
            </div>
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

          {/* Step A: Decision & Recommendation */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 block">
              A. Decision &amp; Recommended Course of Action
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'Full Investigation',
                  predication: 'Sufficient',
                  label: 'Sufficient Predication: Full Investigation',
                  description: '',
                  color: 'emerald',
                },
                {
                  id: 'Case Closure',
                  predication: 'Insufficient',
                  label: 'Insufficient Predication: Close Case',

                  color: 'rose',
                },
                {
                  id: 'Referral',
                  predication: 'Sufficient',
                  label: 'Referral',

                  color: 'cbe-purple',
                },
              ].map((action) => {
                const isSelected = report.recommendedAction === action.id
                // Use specific colors for selected state
                let selectedBg = 'bg-slate-800 border-slate-800 text-white'
                if (action.color === 'emerald') selectedBg = 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                if (action.color === 'rose') selectedBg = 'bg-rose-600 border-rose-600 text-white shadow-sm'
                if (action.color === 'cbe-purple') selectedBg = 'bg-cbe-purple border-cbe-purple text-white shadow-sm'

                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      if (!isEditable) return
                      updateField('predicationDetermination', action.predication)
                      updateField('recommendedAction', action.id)
                    }}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between h-full ${isSelected
                      ? selectedBg
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <span className="text-xs font-bold leading-snug">{action.label}</span>
                      <div
                        className={`w-4 h-4 shrink-0 rounded-full flex items-center justify-center mt-0.5 ${isSelected ? 'bg-white text-slate-900' : 'border border-slate-300'
                          }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] leading-relaxed block ${isSelected ? 'text-white/90' : 'text-slate-500'
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
            <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200 transition-all">
              <label className="text-xs font-bold text-slate-800 block">
                Specify Referral Authority or Body
              </label>
              <input
                type="text"
                value={report.referralTarget || ''}
                onChange={(e) => updateField('referralTarget', e.target.value)}
                disabled={!isEditable}
                placeholder="e.g. Human Resources Directorate, Federal Police, FEACC"
                className="w-full text-sm border border-slate-300 rounded-lg px-4 py-2.5 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition-shadow"
              />
            </div>
          )}

          {/* Step B: Next Steps & Interim Measures */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-800 block">
              B. Next Steps &amp; Interim Measures
            </label>
            <RichTextEditor
              value={report.nextStepsInterimMeasures}
              onChange={(val) => updateField('nextStepsInterimMeasures', val)}
              isEditable={isEditable}
              placeholder="e.g. Freeze procurement award, secure evidence logs, notify internal audit head..."
              minHeight="100px"
            />
          </div>

          {/* Sign-off completion date */}
          {/* <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Date of Assessment Completion:</span>
            <input
              type="text"
              value={report.dateAssessmentCompletion}
              onChange={(e) => updateField('dateAssessmentCompletion', e.target.value)}
              disabled={!isEditable}
              placeholder="DD/MM/YYYY"
              className="text-xs font-semibold text-slate-800 border border-slate-200 rounded px-2 py-1 bg-white text-right w-32"
            />
          </div> */}

          {/* 4. Signature Block (for formal print/view) */}
          {/* <div className="pt-8 pb-4 mt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-8">
            <div className="space-y-4 w-full max-w-sm">
              <div className="border-b border-slate-400 pb-2">
                <span className="text-xs font-bold text-slate-800 block mb-3">Prepared by Investigator/Team:</span>
                <input
                  type="text"
                  value={report.investigatorTeamAssigned || ''}
                  onChange={(e) => updateField('investigatorTeamAssigned', e.target.value)}
                  disabled={!isEditable}
                  placeholder="Enter name(s)..."
                  className="w-full text-sm text-slate-900 border-none bg-transparent focus:ring-0 p-0"
                />
              </div>
              <p className="text-[11px] text-slate-500">Date: {report.dateAssessmentCompletion || '_____________'}</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
