import React, { useState } from 'react'
import {
  Printer,
  Download,
  Check,
  ShieldCheck,
  AlertCircle,
  FileText,
  Scale,
  Plus,
  Trash2,
  Paperclip,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import type { FinalInvestigationReport, FactualFindingItem, ExhibitItem } from '../types/investigation.types'
import { Button } from '@/components/ui/Button'

interface Props {
  report: FinalInvestigationReport
  onChangeReport?: (report: FinalInvestigationReport) => void
  isEditable?: boolean
}

const REPORT_SECTIONS = [
  { id: 1, label: '1. Exec Summary' },
  { id: 2, label: '2. Scope' },
  { id: 3, label: '3. Methodology' },
  { id: 4, label: '4. Findings' },
  { id: 5, label: '5. Conclusion' },
  { id: 6, label: '6. Recommendations' },
  { id: 7, label: '7. Exhibits' },
  { id: 8, label: '8. Sign-Off' },
]

export const FinalInvestigationReportView: React.FC<Props> = ({
  report,
  onChangeReport,
  isEditable = true,
}) => {
  const [activeSection, setActiveSection] = useState<number>(1)
  const [isFullDocumentView, setIsFullDocumentView] = useState<boolean>(false)

  const handlePrint = () => {
    window.print()
  }

  const updateField = <K extends keyof FinalInvestigationReport>(
    field: K,
    value: FinalInvestigationReport[K]
  ) => {
    if (onChangeReport && isEditable) {
      onChangeReport({ ...report, [field]: value })
    }
  }

  const handleAddFinding = () => {
    const nextNum = (report.findings.length + 1).toString()
    const newFinding: FactualFindingItem = {
      id: `f-${Date.now()}`,
      findingNumber: `4.${nextNum}`,
      title: 'New Finding',
      fact: '',
      evidence: '',
    }
    updateField('findings', [...report.findings, newFinding])
  }

  const handleUpdateFinding = (index: number, updated: Partial<FactualFindingItem>) => {
    const next = [...report.findings]
    next[index] = { ...next[index], ...updated }
    updateField('findings', next)
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

  const handleUpdateExhibit = (index: number, updated: Partial<ExhibitItem>) => {
    const next = [...report.exhibits]
    next[index] = { ...next[index], ...updated }
    updateField('exhibits', next)
  }

  const handleRemoveExhibit = (index: number) => {
    const next = report.exhibits.filter((_, i) => i !== index)
    updateField('exhibits', next)
  }

  const handleAddRecommendation = (type: 'disciplinary' | 'systemic') => {
    if (type === 'disciplinary') {
      updateField('disciplinaryLegalActions', [...report.disciplinaryLegalActions, ''])
    } else {
      updateField('systemicPreventativeMeasures', [...report.systemicPreventativeMeasures, ''])
    }
  }

  const handleUpdateRecommendation = (
    type: 'disciplinary' | 'systemic',
    index: number,
    value: string
  ) => {
    if (type === 'disciplinary') {
      const next = [...report.disciplinaryLegalActions]
      next[index] = value
      updateField('disciplinaryLegalActions', next)
    } else {
      const next = [...report.systemicPreventativeMeasures]
      next[index] = value
      updateField('systemicPreventativeMeasures', next)
    }
  }

  const handleRemoveRecommendation = (type: 'disciplinary' | 'systemic', index: number) => {
    if (type === 'disciplinary') {
      updateField(
        'disciplinaryLegalActions',
        report.disciplinaryLegalActions.filter((_, i) => i !== index)
      )
    } else {
      updateField(
        'systemicPreventativeMeasures',
        report.systemicPreventativeMeasures.filter((_, i) => i !== index)
      )
    }
  }

  return (
    <div className="space-y-4 print:p-0">
      {/* Top Action Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-900">
              Final Investigation Report
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                report.investigativeFinding === 'Substantiated'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : report.investigativeFinding === 'Not Substantiated'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {report.investigativeFinding === 'Substantiated' ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              )}
              {report.investigativeFinding}
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

      {/* Internal Section Navigation (Hides all other 7 sections by default!) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 print:hidden">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {REPORT_SECTIONS.map((sec) => {
            const isActive = !isFullDocumentView && activeSection === sec.id
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActiveSection(sec.id)
                  setIsFullDocumentView(false)
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cbe-purple text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {sec.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-1 sm:border-l sm:border-slate-200 sm:pl-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsFullDocumentView(!isFullDocumentView)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1 border ${
              isFullDocumentView
                ? 'bg-cbe-gold text-white border-cbe-gold shadow-2xs font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isFullDocumentView ? 'Focused Section View' : 'Full Document View'}</span>
          </button>
        </div>
      </div>

      {/* 1. Executive Summary */}
      {(isFullDocumentView || activeSection === 1) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-cbe-purple" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Executive Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Case ID / Reference</span>
              <span className="font-mono font-bold text-xs text-cbe-purple mt-0.5 block">{report.caseId}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Date of Final Submission</span>
              <input
                type="text"
                value={report.dateFinalSubmission}
                onChange={(e) => updateField('dateFinalSubmission', e.target.value)}
                disabled={!isEditable}
                placeholder="DD/MM/YYYY"
                className="text-xs font-semibold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full"
              />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Estimated Financial Impact</span>
              <input
                type="text"
                value={report.estimatedFinancialImpact}
                onChange={(e) => updateField('estimatedFinancialImpact', e.target.value)}
                disabled={!isEditable}
                placeholder="Amount in ETB or N/A"
                className="text-xs font-semibold text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full"
              />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">Investigative Finding</span>
              <select
                value={report.investigativeFinding}
                onChange={(e) =>
                  updateField(
                    'investigativeFinding',
                    e.target.value as 'Substantiated' | 'Not Substantiated' | 'Unfounded'
                  )
                }
                disabled={!isEditable}
                className="text-xs font-bold text-cbe-purple bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                <option value="Substantiated">Substantiated</option>
                <option value="Not Substantiated">Not Substantiated</option>
                <option value="Unfounded">Unfounded</option>
              </select>
            </div>
          </div>

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
              <label className="text-[11px] font-semibold text-slate-500">Recommendation Summary</label>
              <textarea
                rows={2}
                value={report.recommendation}
                onChange={(e) => updateField('recommendation', e.target.value)}
                disabled={!isEditable}
                placeholder="e.g. Termination, Criminal Referral under Proclamation 699/2010, Policy Change..."
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Background and Scope */}
      {(isFullDocumentView || activeSection === 2) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-cbe-purple" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Background and Scope
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Source of Report</label>
              <input
                type="text"
                value={report.sourceOfReport}
                onChange={(e) => updateField('sourceOfReport', e.target.value)}
                disabled={!isEditable}
                placeholder="e.g. Anonymous Portal, Whistleblower (Confidential)"
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Date Investigation Commenced</label>
              <input
                type="text"
                value={report.dateInvestigationCommenced}
                onChange={(e) => updateField('dateInvestigationCommenced', e.target.value)}
                disabled={!isEditable}
                placeholder="DD/MM/YYYY"
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Investigative Team</label>
              <input
                type="text"
                value={report.investigativeTeam}
                onChange={(e) => updateField('investigativeTeam', e.target.value)}
                disabled={!isEditable}
                placeholder="Lead investigator & team members"
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Original Allegation (Verbatim)</label>
              <textarea
                rows={2}
                value={report.originalAllegationVerbatim}
                onChange={(e) => updateField('originalAllegationVerbatim', e.target.value)}
                disabled={!isEditable}
                placeholder="Quote core allegation verbatim from the intake report..."
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Scope of Investigation</label>
              <textarea
                rows={2}
                value={report.scopeOfInvestigation}
                onChange={(e) => updateField('scopeOfInvestigation', e.target.value)}
                disabled={!isEditable}
                placeholder="Define specific time period, personnel, and systems reviewed..."
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Methodology */}
      {(isFullDocumentView || activeSection === 3) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-cbe-purple" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Methodology
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Document Review</label>
              <textarea
                rows={3}
                value={report.documentReview}
                onChange={(e) => updateField('documentReview', e.target.value)}
                disabled={!isEditable}
                placeholder="e.g. 500 emails, 2 years of financial ledgers, 15 procurement contracts..."
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Forensic Analysis</label>
              <textarea
                rows={3}
                value={report.forensicAnalysis}
                onChange={(e) => updateField('forensicAnalysis', e.target.value)}
                disabled={!isEditable}
                placeholder="e.g. Forensic audit traced funds through bank accounts A and B..."
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Interviews Conducted</label>
              <textarea
                rows={3}
                value={report.interviewsConducted}
                onChange={(e) => updateField('interviewsConducted', e.target.value)}
                disabled={!isEditable}
                placeholder="List witnesses, subjects interviewed, and interview dates..."
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Factual Findings (Evidence-Based) */}
      {(isFullDocumentView || activeSection === 4) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cbe-purple" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Factual Findings (Evidence-Based)
              </h3>
            </div>
            {isEditable && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddFinding}
                className="text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Finding</span>
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {report.findings.map((item, index) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-mono text-xs font-bold text-cbe-purple">
                      {item.findingNumber}:
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateFinding(index, { title: e.target.value })}
                      disabled={!isEditable}
                      placeholder="e.g. Relating to Alleged Bribery / Conflict of Interest"
                      className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2.5 py-1 w-full"
                    />
                  </div>
                  {isEditable && report.findings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFinding(index)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove Finding"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Established Fact</label>
                  <textarea
                    rows={2}
                    value={item.fact}
                    onChange={(e) => handleUpdateFinding(index, { fact: e.target.value })}
                    disabled={!isEditable}
                    placeholder="Record fact established by evidence..."
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Supporting Evidence &amp; Exhibits</label>
                  <input
                    type="text"
                    value={item.evidence}
                    onChange={(e) => handleUpdateFinding(index, { evidence: e.target.value })}
                    disabled={!isEditable}
                    placeholder="e.g. Procurement File No. 123, Bid Analysis document (Exhibit A)"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Conclusion and Determination */}
      {(isFullDocumentView || activeSection === 5) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Scale className="w-4 h-4 text-cbe-purple" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              5. Conclusion and Determination
            </h3>
          </div>

          <div className="space-y-3">
            {/* Finding Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Official Determination
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Substantiated', 'Not Substantiated', 'Unfounded'] as const).map((det) => {
                  const isSelected = report.findingDetermination === det
                  return (
                    <button
                      key={det}
                      type="button"
                      onClick={() => updateField('findingDetermination', det)}
                      disabled={!isEditable}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? det === 'Substantiated'
                            ? 'bg-rose-50 border-rose-500 text-rose-900'
                            : det === 'Not Substantiated'
                            ? 'bg-amber-50 border-amber-500 text-amber-900'
                            : 'bg-emerald-50 border-emerald-500 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold">{det}</span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isSelected
                            ? det === 'Substantiated'
                              ? 'bg-rose-600 text-white'
                              : det === 'Not Substantiated'
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                            : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Formal Conclusion Narrative</label>
              <textarea
                rows={3}
                value={report.conclusionText}
                onChange={(e) => updateField('conclusionText', e.target.value)}
                disabled={!isEditable}
                placeholder="e.g. The investigation concludes that the allegation of Bribery & Tender Extortion is Substantiated based on the evidence presented in Section 4..."
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Policy / Law Violated</label>
              <input
                type="text"
                value={report.policyLawViolated}
                onChange={(e) => updateField('policyLawViolated', e.target.value)}
                disabled={!isEditable}
                placeholder="e.g. Article 15 of Anti-Corruption Proclamation No. 699/2010 (Abuse of Power); CBE Code of Conduct Art. 8"
                className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-900 focus:outline-none focus:border-cbe-purple"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. Recommendations */}
      {(isFullDocumentView || activeSection === 6) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Scale className="w-4 h-4 text-cbe-purple" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              6. Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 6.1 Disciplinary/Legal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  6.1 Disciplinary / Legal Action (For Subjects)
                </span>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => handleAddRecommendation('disciplinary')}
                    className="text-[11px] text-cbe-purple font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Action
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {report.disciplinaryLegalActions.map((action, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={action}
                      onChange={(e) => handleUpdateRecommendation('disciplinary', i, e.target.value)}
                      disabled={!isEditable}
                      placeholder="e.g. Immediate termination of employment for Mr. X for Gross Misconduct"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                    />
                    {isEditable && report.disciplinaryLegalActions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRecommendation('disciplinary', i)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 6.2 Systemic/Preventative */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  6.2 Systemic / Preventative Measures
                </span>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => handleAddRecommendation('systemic')}
                    className="text-[11px] text-cbe-purple font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Measure
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {report.systemicPreventativeMeasures.map((measure, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={measure}
                      onChange={(e) => handleUpdateRecommendation('systemic', i, e.target.value)}
                      disabled={!isEditable}
                      placeholder="e.g. Mandatory separation of duties between procurement approval and payment"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                    />
                    {isEditable && report.systemicPreventativeMeasures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRecommendation('systemic', i)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Exhibits (Appendices) */}
      {(isFullDocumentView || activeSection === 7) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-cbe-purple" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                7. Exhibits (Appendices)
              </h3>
            </div>
            {isEditable && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddExhibit}
                className="text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exhibit</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.exhibits.map((ex, i) => (
              <div
                key={ex.id}
                className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-start justify-between gap-3"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cbe-gold">
                      {ex.exhibitLetter}:
                    </span>
                    <input
                      type="text"
                      value={ex.title}
                      onChange={(e) => handleUpdateExhibit(i, { title: e.target.value })}
                      disabled={!isEditable}
                      placeholder="Exhibit title"
                      className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-0.5 w-full"
                    />
                  </div>
                  <input
                    type="text"
                    value={ex.description}
                    onChange={(e) => handleUpdateExhibit(i, { description: e.target.value })}
                    disabled={!isEditable}
                    placeholder="Description or file reference"
                    className="text-xs text-slate-600 bg-white border border-slate-200 rounded px-2 py-0.5 w-full"
                  />
                </div>

                {isEditable && report.exhibits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExhibit(i)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Sign-Off & Approval */}
      {(isFullDocumentView || activeSection === 8) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="w-4 h-4 text-cbe-purple" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              8. Sign-Off &amp; Management Approval
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Investigator Sign */}
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase block">
                Lead Investigator Certification
              </span>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Investigator Name / Sign</label>
                <input
                  type="text"
                  value={report.investigatorSignature}
                  onChange={(e) => updateField('investigatorSignature', e.target.value)}
                  disabled={!isEditable}
                  className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white font-medium text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Date of Signing</label>
                <input
                  type="text"
                  value={report.signatureDate}
                  onChange={(e) => updateField('signatureDate', e.target.value)}
                  disabled={!isEditable}
                  className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Senior Management Review */}
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase">
                  Oversight &amp; Management Review
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    report.approvalStatus === 'Approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {report.approvalStatus}
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Approved By (VP-RMCD / President / Board)</label>
                <input
                  type="text"
                  value={report.reviewedAndApprovedBy}
                  onChange={(e) => updateField('reviewedAndApprovedBy', e.target.value)}
                  disabled={!isEditable}
                  className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white font-medium text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase">Date of Approval</label>
                <input
                  type="text"
                  value={report.approvalDate}
                  onChange={(e) => updateField('approvalDate', e.target.value)}
                  disabled={!isEditable}
                  className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white font-medium text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Focused Navigation Footer (when not viewing full document) */}
      {!isFullDocumentView && (
        <div className="flex items-center justify-between pt-2 px-1 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            disabled={activeSection === 1}
            onClick={() => setActiveSection((prev) => Math.max(1, prev - 1))}
            className="text-xs font-semibold flex items-center gap-1 border-slate-200"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Section</span>
          </Button>

          <div className="text-xs text-slate-500 font-medium">
            Section <span className="font-bold text-slate-800">{activeSection}</span> of 8:{' '}
            <span className="text-cbe-purple font-semibold">
              {REPORT_SECTIONS[activeSection - 1].label}
            </span>
          </div>

          <Button
            size="sm"
            disabled={activeSection === 8}
            onClick={() => setActiveSection((prev) => Math.min(8, prev + 1))}
            className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1"
          >
            <span>Next Section</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}
