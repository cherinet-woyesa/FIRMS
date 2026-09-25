import React from 'react'
import {
  Printer,
  Download,
  Plus,
  Trash2,
  FileText,
  MessageSquare,
  Lock,
  PenTool,
} from 'lucide-react'
import type { FinalInvestigationReport, FindingItem, ExhibitItem } from '../types/investigation.types'
import { Button } from '@/components/ui/Button'

interface Props {
  report: FinalInvestigationReport
  onChangeReport?: (field: keyof FinalInvestigationReport, value: any) => void
  isEditable?: boolean
}

export const FinalInvestigationReportView: React.FC<Props> = ({
  report,
  onChangeReport,
  isEditable = true,
}) => {
  const handlePrint = () => {
    window.print()
  }

  const updateField = (field: keyof FinalInvestigationReport, value: any) => {
    if (onChangeReport && isEditable) {
      onChangeReport(field, value)
    }
  }

  const handleAddFinding = () => {
    const nextNum = `4.${report.findings.length + 1}`
    const newFinding: FindingItem = {
      id: `f-${Date.now()}`,
      findingNumber: nextNum,
      title: '',
      fact: '',
      evidence: '',
    }
    updateField('findings', [...report.findings, newFinding])
  }

  const handleRemoveFinding = (index: number) => {
    const next = report.findings.filter((_, i) => i !== index)
    updateField('findings', next)
  }

  const handleAddExhibit = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nextLetter = letters[report.exhibits.length % letters.length]
    const newExhibit: ExhibitItem = {
      id: `ex-${Date.now()}`,
      exhibitLetter: `Exhibit ${nextLetter}`,
      title: '',
      description: '',
    }
    updateField('exhibits', [...report.exhibits, newExhibit])
  }

  const handleRemoveExhibit = (index: number) => {
    const next = report.exhibits.filter((_, i) => i !== index)
    updateField('exhibits', next)
  }

  return (
    <div className="space-y-5 print:p-0">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Final Investigation Report
          </h2>
          <p className="text-xs text-slate-500">
            Formal findings, verified evidentiary index, and supervisory sign-offs
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs flex items-center gap-1.5 px-3.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs flex items-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Export DOCX</span>
          </Button>
        </div>
      </div>

      {/* Review Mode Banner (FR 3.7.1 & FR 3.7.2) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between shadow-2xs mb-4">
        <div className="flex items-center gap-2 text-amber-800">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-semibold">Protected Review Mode Active</span>
          <span className="text-[11px] opacity-80 hidden sm:inline">
            Direct editing is prohibited. Reviewers must provide feedback via comments.
          </span>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-[10px] border-amber-300 text-amber-700 hover:bg-amber-100 bg-white cursor-pointer">
          <MessageSquare className="w-3 h-3 mr-1" /> View All Comments
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* EXECUTIVE SUMMARY                                                         */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">Executive Summary</h3>
            <button className="text-slate-400 hover:text-cbe-purple transition cursor-pointer" title="Add Comment">
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="font-mono text-xs text-slate-400 font-medium">Ref: {report.caseId}</span>
        </div>

        {/* 4 Metadata Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Case Reference
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
              {report.caseId}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Date of Final Submission
            </span>
            <span className="font-semibold text-slate-900 text-sm mt-1 block">
              {report.dateFinalSubmission}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Financial Impact
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-1 block">
              {report.estimatedFinancialImpact}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Investigative Finding
            </span>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {report.investigativeFinding}
            </span>
          </div>
        </div>

        {/* Allegation Summary */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Allegation Summary
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {report.allegationSummary}
          </div>
        </div>

        {/* Recommendation Summary */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Recommendation Summary
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {report.recommendation}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BACKGROUND & SCOPE                                                        */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">Background &amp; Scope</h3>
            <button className="text-slate-400 hover:text-cbe-purple transition cursor-pointer" title="Add Comment">
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Source of Report
            </span>
            <span className="font-semibold text-slate-900 text-sm mt-1 block">
              {report.sourceOfReport}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Date Commenced
            </span>
            <span className="font-semibold text-slate-900 text-sm mt-1 block">
              {report.dateInvestigationCommenced}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Investigative Team
            </span>
            <span className="font-semibold text-slate-900 text-sm mt-1 block">
              {report.investigativeTeam}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Original Allegation (Verbatim)
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
            "{report.originalAllegationVerbatim}"
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Investigation Scope &amp; Target Records
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {report.scopeOfInvestigation}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INVESTIGATION METHODOLOGY                                                 */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">Investigation Methodology</h3>
            <button className="text-slate-400 hover:text-cbe-purple transition cursor-pointer" title="Add Comment">
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Document &amp; Record Review
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {report.documentReview}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Forensic &amp; Financial Analysis
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {report.forensicAnalysis}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Witness &amp; Subject Interviews Conducted
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {report.interviewsConducted}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FACTUAL FINDINGS                                                          */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Factual Findings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Documented facts supported by corroborated documentary or testimonial evidence
            </p>
          </div>
          {isEditable && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddFinding}
              className="text-xs flex items-center gap-1 border-slate-200 hover:bg-slate-50"
            >
              <Plus className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Add Finding</span>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {report.findings.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-cbe-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    Finding {item.findingNumber}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                </div>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFinding(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Remove Finding"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 block mb-0.5">Established Fact:</span>
                {item.fact}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                <span className="font-semibold text-slate-700">Supporting Evidence:</span>
                <span className="font-mono text-cbe-purple">{item.evidence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONCLUSION & POLICY VIOLATIONS                                            */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Conclusion &amp; Policy Violations</h3>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Legal &amp; Policy Violations Established
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
            {report.policyLawViolated}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Final Investigative Conclusion
          </label>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {report.conclusionText}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECOMMENDATIONS & REFERRALS                                               */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Recommendations &amp; Referrals</h3>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Disciplinary &amp; Legal Referral Recommendations
          </label>
          <div className="space-y-2">
            {report.disciplinaryLegalActions.map((action, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5"
              >
                <span className="font-bold text-cbe-purple text-xs shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Institutional &amp; Preventative Internal Control Reforms
          </label>
          <div className="space-y-2">
            {report.systemicPreventativeMeasures.map((measure, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5"
              >
                <span className="font-bold text-cbe-purple text-xs shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed">{measure}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ANNEXES & SUPPLEMENTARY MATERIALS (FR 3.7.4)                              */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Annexes &amp; Supplementary Materials</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Attach supplementary materials, worksheets, and evidence to the case file
            </p>
          </div>
          {isEditable && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddExhibit}
              className="text-xs flex items-center gap-1 border-slate-200 hover:bg-slate-50"
            >
              <Plus className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Attach Material</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {report.exhibits.map((ex, idx) => (
            <div
              key={ex.id}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-cbe-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  {ex.exhibitLetter}
                </span>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExhibit(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Remove Exhibit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-xs">{ex.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{ex.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUPERVISORY SIGN-OFF & APPROVALS                                          */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Digital Signatures &amp; Approvals</h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Lock className="w-3 h-3" /> cryptographically verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Investigator Sign-Off */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <PenTool className="w-24 h-24" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Lead Investigator Digital Signature
            </span>
            <div className="flex flex-col">
              <span className="font-mono text-emerald-600 text-xs font-bold bg-emerald-50 w-fit px-2 py-1 rounded border border-emerald-100 mb-2">
                Signed by: {report.investigatorSignature}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                Hash: 0x8F9B...3A2C
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500 relative z-10">
              <span>Timestamp:</span>
              <span className="font-medium text-slate-800">{report.signatureDate}</span>
            </div>
          </div>

          {/* Approving Authority */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <PenTool className="w-24 h-24" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Executive Digital Signature
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {report.approvalStatus}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-emerald-600 text-xs font-bold bg-emerald-50 w-fit px-2 py-1 rounded border border-emerald-100 mb-2">
                Signed by: {report.reviewedAndApprovedBy}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                Hash: 0x1E4D...9F8A
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500 relative z-10">
              <span>Timestamp:</span>
              <span className="font-medium text-slate-800">{report.approvalDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
