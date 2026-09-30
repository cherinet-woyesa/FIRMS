import React, { useState } from 'react'
import {
  FileText,
  Shield,
  Search,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Building,
  Scale,
  Briefcase,
} from 'lucide-react'
import type {
  FullInvestigationState,
  SeizedRecordItem,
  ExternalInquiryItem,
  InterviewRecord,
  SubjectInterviewRecord,
  DisciplinaryActionItem,
  SystemicMeasureItem,
} from '../types/investigation.types'
import { FinalInvestigationReportView } from './FinalInvestigationReportView'
import { Button } from '@/components/ui/Button'

interface Props {
  investigation: FullInvestigationState
  onUpdateInvestigation: (updated: FullInvestigationState) => void
  onSave: () => void
  isSaving?: boolean
}

const STEPS = [
  { id: 1, label: '1. Planning & Authorization' },
  { id: 2, label: '2. Evidence & Forensics' },
  { id: 3, label: '3. Witness & Subject Interviews' },
  { id: 4, label: '4. Final Investigation Report' },
  { id: 5, label: '5. Action & Case Closure' },
]

export const FullInvestigationWorkspace: React.FC<Props> = ({
  investigation,
  onUpdateInvestigation,
  onSave,
}) => {
  const [activeStep, setActiveStep] = useState<number>(investigation.currentStep || 1)
  const [step1Tab, setStep1Tab] = useState<'authorization' | 'scope'>('authorization')
  const [step2Tab, setStep2Tab] = useState<'seized' | 'forensics' | 'inquiries'>('seized')
  const [step3Tab, setStep3Tab] = useState<'neutral' | 'key' | 'subject'>('neutral')

  const updateState = (updater: (prev: FullInvestigationState) => FullInvestigationState) => {
    const next = updater(investigation)
    onUpdateInvestigation(next)
  }

  // --- Step 1 Handlers ---
  const handleToggleScope = (scopeItem: string) => {
    updateState((prev) => {
      const exists = prev.planning.approvalScope.includes(scopeItem)
      const nextScope = exists
        ? prev.planning.approvalScope.filter((s) => s !== scopeItem)
        : [...prev.planning.approvalScope, scopeItem]
      return {
        ...prev,
        planning: { ...prev.planning, approvalScope: nextScope },
      }
    })
  }

  // --- Step 2 Handlers (Evidence) ---
  const handleAddSeizedRecord = () => {
    const newItem: SeizedRecordItem = {
      id: `rec-${Date.now()}`,
      category: 'Financial',
      title: 'New Seized Document',
      dateSeized: new Date().toLocaleDateString(),
      custodyRef: `EVD-2026-${Math.floor(100 + Math.random() * 900)}`,
    }
    updateState((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        seizedRecords: [...prev.evidence.seizedRecords, newItem],
      },
    }))
  }

  const handleRemoveSeizedRecord = (id: string) => {
    updateState((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        seizedRecords: prev.evidence.seizedRecords.filter((r) => r.id !== id),
      },
    }))
  }

  const handleAddExternalInquiry = () => {
    const newItem: ExternalInquiryItem = {
      id: `inq-${Date.now()}`,
      inquiryType: 'Vendor License (FEACC)',
      details: '',
      findings: '',
    }
    updateState((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        covertExternalInquiries: [...prev.evidence.covertExternalInquiries, newItem],
      },
    }))
  }

  // --- Step 3 Handlers (Interviews) ---
  const handleAddWitness = (type: 'neutral' | 'key') => {
    const newItem: InterviewRecord = {
      id: `w-${Date.now()}`,
      name: '',
      role: '',
      date: new Date().toLocaleDateString(),
      summary: '',
      exhibitsCorroborated: '',
    }
    updateState((prev) => ({
      ...prev,
      interviews: {
        ...prev.interviews,
        [type === 'neutral' ? 'neutralWitnesses' : 'keyWitnesses']: [
          ...prev.interviews[type === 'neutral' ? 'neutralWitnesses' : 'keyWitnesses'],
          newItem,
        ],
      },
    }))
  }

  const handleAddSubjectInterview = () => {
    const newItem: SubjectInterviewRecord = {
      id: `sub-${Date.now()}`,
      name: '',
      role: '',
      date: new Date().toLocaleDateString(),
      legalCounselPresent: true,
      rightsInformed: true,
      recordedDefense: '',
    }
    updateState((prev) => ({
      ...prev,
      interviews: {
        ...prev.interviews,
        subjects: [...prev.interviews.subjects, newItem],
      },
    }))
  }

  // --- Step 5 Handlers (Closure) ---
  const handleAddDisciplinary = () => {
    const newItem: DisciplinaryActionItem = {
      id: `da-${Date.now()}`,
      actionType: 'Termination',
      targetSubject: '',
      authority: 'Human Resources Directorate',
      status: 'Pending',
    }
    updateState((prev) => ({
      ...prev,
      closure: {
        ...prev.closure,
        disciplinaryActions: [...prev.closure.disciplinaryActions, newItem],
      },
    }))
  }

  const handleAddSystemicMeasure = () => {
    const newItem: SystemicMeasureItem = {
      id: `sm-${Date.now()}`,
      policyTitle: '',
      responsibleUnit: '',
      status: 'In Progress',
    }
    updateState((prev) => ({
      ...prev,
      closure: {
        ...prev.closure,
        systemicMeasures: [...prev.closure.systemicMeasures, newItem],
      },
    }))
  }

  return (
    <div className="space-y-5">
      {/* 5-Step Stepper Navigation */}
      <div className="flex border-b border-slate-200 gap-1 bg-white p-1 rounded-lg overflow-x-auto">
        {STEPS.map((s) => {
          const isActive = activeStep === s.id
          return (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition cursor-pointer whitespace-nowrap text-center ${
                isActive
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Step 1: Formal Planning and Authorization */}
      {activeStep === 1 && (
        <div className="space-y-4">
          {/* Sub-nav pills */}
          <div className="flex border-b border-slate-200 gap-1 bg-slate-100/80 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setStep1Tab('authorization')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                step1Tab === 'authorization'
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              1. Formal Authorization &amp; Mandate
            </button>
            <button
              type="button"
              onClick={() => setStep1Tab('scope')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                step1Tab === 'scope'
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              2. Scope, Targets &amp; Resources
            </button>
          </div>

          {step1Tab === 'authorization' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cbe-purple" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    1. Formal Authorization &amp; Mandate
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    investigation.planning.isAuthorized
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {investigation.planning.isAuthorized ? 'Authorized to Investigate' : 'Pending Authorization'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">
                    Authorizing Authority (VP-RMCD / Director ECV / President)
                  </label>
                  <input
                    type="text"
                    value={investigation.planning.authorizedBy}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        planning: { ...prev.planning, authorizedBy: e.target.value },
                      }))
                    }
                    placeholder="e.g. Vice President, Risk Management & Compliance"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Date of Formal Authorization</label>
                  <input
                    type="text"
                    value={investigation.planning.authorizationDate}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        planning: { ...prev.planning, authorizationDate: e.target.value },
                      }))
                    }
                    placeholder="DD/MM/YYYY"
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple font-medium"
                  />
                </div>
              </div>

              {/* Approved Investigative Powers */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-800 block">
                  Approved Investigative Powers Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Interviewing Staff & Witnesses',
                    'Seizing Physical & Digital Records',
                    'Requesting External / FEACC Data',
                    'Engaging Police Forensic Support',
                    'Suspending Core System Permissions',
                    'Examining Bank Ledgers & Transfers',
                  ].map((scope) => {
                    const isChecked = investigation.planning.approvalScope.includes(scope)
                    return (
                      <label
                        key={scope}
                        className={`p-2.5 rounded-lg border text-xs font-medium cursor-pointer flex items-center gap-2 transition ${
                          isChecked
                            ? 'bg-purple-50/70 border-cbe-purple text-purple-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleScope(scope)}
                          className="w-3.5 h-3.5 text-cbe-purple rounded"
                        />
                        <span>{scope}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step1Tab === 'scope' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-cbe-purple" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Scope, Targets &amp; Resources
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Target Subjects Under Investigation</label>
                  <input
                    type="text"
                    value={investigation.planning.targetSubjects}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        planning: { ...prev.planning, targetSubjects: e.target.value },
                      }))
                    }
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Investigation Timeframe &amp; Scope Period</label>
                  <input
                    type="text"
                    value={investigation.planning.investigationTimeframe}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        planning: { ...prev.planning, investigationTimeframe: e.target.value },
                      }))
                    }
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Specific Allegation Being Investigated</label>
                  <textarea
                    rows={2}
                    value={investigation.planning.specificAllegations}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        planning: { ...prev.planning, specificAllegations: e.target.value },
                      }))
                    }
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Required Resources &amp; Support</label>
                  <textarea
                    rows={2}
                    value={investigation.planning.requiredResources}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        planning: { ...prev.planning, requiredResources: e.target.value },
                      }))
                    }
                    placeholder="e.g. Forensic auditors, legal counsel, IT security log analysis..."
                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 Footer Nav */}
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              onClick={() => setActiveStep(2)}
              className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Proceed to Step 2: Evidence &amp; Forensics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Evidence Collection and Analysis */}
      {activeStep === 2 && (
        <div className="space-y-4">
          {/* Sub-nav pills */}
          <div className="flex border-b border-slate-200 gap-1 bg-slate-100/80 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setStep2Tab('seized')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                step2Tab === 'seized'
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              1. Seized Records ({investigation.evidence.seizedRecords.length})
            </button>
            <button
              type="button"
              onClick={() => setStep2Tab('forensics')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                step2Tab === 'forensics'
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              2. Forensic Audit &amp; Loss
            </button>
            <button
              type="button"
              onClick={() => setStep2Tab('inquiries')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                step2Tab === 'inquiries'
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              3. External Inquiries ({investigation.evidence.covertExternalInquiries.length})
            </button>
          </div>

          {/* Document and Data Seizure */}
          {step2Tab === 'seized' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cbe-purple" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    1. Document &amp; Digital Data Seizure
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddSeizedRecord}
                  className="text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Seized Record
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {investigation.evidence.seizedRecords.map((rec, i) => (
                  <div
                    key={rec.id}
                    className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cbe-purple text-white">
                          {rec.category}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 font-semibold">{rec.custodyRef}</span>
                      </div>
                      <input
                        type="text"
                        value={rec.title}
                        onChange={(e) => {
                          const next = [...investigation.evidence.seizedRecords]
                          next[i] = { ...next[i], title: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            evidence: { ...prev.evidence, seizedRecords: next },
                          }))
                        }}
                        className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 w-full"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Seized: {rec.dateSeized}</span>
                        <select
                          value={rec.category}
                          onChange={(e) => {
                            const next = [...investigation.evidence.seizedRecords]
                            next[i] = { ...next[i], category: e.target.value as any }
                            updateState((prev) => ({
                              ...prev,
                              evidence: { ...prev.evidence, seizedRecords: next },
                            }))
                          }}
                          className="bg-transparent border-none text-[10px] font-medium text-slate-600 cursor-pointer"
                        >
                          <option value="Financial">Financial (Ledgers/Transfers)</option>
                          <option value="Digital">Digital (Emails/Logs)</option>
                          <option value="Procurement">Procurement (Tenders/Bids)</option>
                          <option value="Personnel">Personnel &amp; Org</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSeizedRecord(rec.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forensic Audit & Tracing */}
          {step2Tab === 'forensics' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Scale className="w-4 h-4 text-cbe-purple" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Forensic Financial Audit &amp; Loss Quantification
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Funds Traced (ETB)</label>
                  <input
                    type="text"
                    value={investigation.evidence.fundsTracedETB}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        evidence: { ...prev.evidence, fundsTracedETB: e.target.value },
                      }))
                    }
                    className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-lg px-3 py-2 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Quantified Institutional Loss (ETB)</label>
                  <input
                    type="text"
                    value={investigation.evidence.quantifiedLossesETB}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        evidence: { ...prev.evidence, quantifiedLossesETB: e.target.value },
                      }))
                    }
                    className="w-full text-xs font-bold text-rose-600 border border-slate-200 rounded-lg px-3 py-2 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Forensic Audit Agency / Partner</label>
                  <input
                    type="text"
                    value={investigation.evidence.forensicAgency}
                    onChange={(e) =>
                      updateState((prev) => ({
                        ...prev,
                        evidence: { ...prev.evidence, forensicAgency: e.target.value },
                      }))
                    }
                    className="w-full text-xs font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-2 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-semibold text-slate-500">Patterns of Illicit Payments &amp; Findings</label>
                <textarea
                  rows={2}
                  value={investigation.evidence.illicitPatternsIdentified}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      evidence: { ...prev.evidence, illicitPatternsIdentified: e.target.value },
                    }))
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                />
              </div>
            </div>
          )}

          {/* External / Covert Inquiries */}
          {step2Tab === 'inquiries' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-cbe-purple" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    3. Covert &amp; External Inquiries (FEACC / Registries)
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddExternalInquiry}
                  className="text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Inquiry
                </Button>
              </div>

              <div className="space-y-3">
                {investigation.evidence.covertExternalInquiries.map((inq, i) => (
                  <div key={inq.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{inq.inquiryType}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = investigation.evidence.covertExternalInquiries.filter(
                            (item) => item.id !== inq.id
                          )
                          updateState((prev) => ({
                            ...prev,
                            evidence: { ...prev.evidence, covertExternalInquiries: next },
                          }))
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={inq.details}
                      onChange={(e) => {
                        const next = [...investigation.evidence.covertExternalInquiries]
                        next[i] = { ...next[i], details: e.target.value }
                        updateState((prev) => ({
                          ...prev,
                          evidence: { ...prev.evidence, covertExternalInquiries: next },
                        }))
                      }}
                      placeholder="Inquiry scope / entity checked"
                      className="w-full text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium"
                    />
                    <textarea
                      rows={1}
                      value={inq.findings}
                      onChange={(e) => {
                        const next = [...investigation.evidence.covertExternalInquiries]
                        next[i] = { ...next[i], findings: e.target.value }
                        updateState((prev) => ({
                          ...prev,
                          evidence: { ...prev.evidence, covertExternalInquiries: next },
                        }))
                      }}
                      placeholder="Findings / corroboration..."
                      className="w-full text-xs border border-slate-200 rounded px-2 py-1 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 Footer Nav */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(1)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 1
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveStep(3)}
              className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Proceed to Step 3: Witness &amp; Subject Interviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Witness and Subject Interviews */}
      {activeStep === 3 && (
        <div className="space-y-4">
          {/* Sub-nav pills */}
          <div className="flex border-b border-slate-200 gap-1 bg-slate-100/80 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setStep3Tab('neutral')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                step3Tab === 'neutral'
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              1. Neutral Witnesses ({investigation.interviews.neutralWitnesses.length})
            </button>
            <button
              type="button"
              onClick={() => setStep3Tab('key')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                step3Tab === 'key'
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              2. Key Witnesses ({investigation.interviews.keyWitnesses.length})
            </button>
            <button
              type="button"
              onClick={() => setStep3Tab('subject')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                step3Tab === 'subject'
                  ? 'bg-cbe-purple text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              3. Subject Interrogations ({investigation.interviews.subjects.length})
            </button>
          </div>

          {/* Neutral Witnesses */}
          {step3Tab === 'neutral' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    1. Neutral Witnesses (Document Corroboration)
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddWitness('neutral')}
                  className="text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Neutral Witness
                </Button>
              </div>

              <div className="space-y-3">
                {investigation.interviews.neutralWitnesses.map((w, i) => (
                  <div key={w.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={w.name}
                        onChange={(e) => {
                          const next = [...investigation.interviews.neutralWitnesses]
                          next[i] = { ...next[i], name: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, neutralWitnesses: next },
                          }))
                        }}
                        placeholder="Witness Name"
                        className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        value={w.role}
                        onChange={(e) => {
                          const next = [...investigation.interviews.neutralWitnesses]
                          next[i] = { ...next[i], role: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, neutralWitnesses: next },
                          }))
                        }}
                        placeholder="Job Title / Department"
                        className="text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        value={w.date}
                        onChange={(e) => {
                          const next = [...investigation.interviews.neutralWitnesses]
                          next[i] = { ...next[i], date: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, neutralWitnesses: next },
                          }))
                        }}
                        placeholder="Interview Date"
                        className="text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={w.summary}
                      onChange={(e) => {
                        const next = [...investigation.interviews.neutralWitnesses]
                        next[i] = { ...next[i], summary: e.target.value }
                        updateState((prev) => ({
                          ...prev,
                          interviews: { ...prev.interviews, neutralWitnesses: next },
                        }))
                      }}
                      placeholder="Statement summary & verified records..."
                      className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Witnesses */}
          {step3Tab === 'key' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Key Witnesses (Direct Knowledge)
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddWitness('key')}
                  className="text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Key Witness
                </Button>
              </div>

              <div className="space-y-3">
                {investigation.interviews.keyWitnesses.map((w, i) => (
                  <div key={w.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={w.name}
                        onChange={(e) => {
                          const next = [...investigation.interviews.keyWitnesses]
                          next[i] = { ...next[i], name: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, keyWitnesses: next },
                          }))
                        }}
                        placeholder="Key Witness Name"
                        className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        value={w.role}
                        onChange={(e) => {
                          const next = [...investigation.interviews.keyWitnesses]
                          next[i] = { ...next[i], role: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, keyWitnesses: next },
                          }))
                        }}
                        placeholder="Position"
                        className="text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        value={w.date}
                        onChange={(e) => {
                          const next = [...investigation.interviews.keyWitnesses]
                          next[i] = { ...next[i], date: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, keyWitnesses: next },
                          }))
                        }}
                        placeholder="Date"
                        className="text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={w.summary}
                      onChange={(e) => {
                        const next = [...investigation.interviews.keyWitnesses]
                        next[i] = { ...next[i], summary: e.target.value }
                        updateState((prev) => ({
                          ...prev,
                          interviews: { ...prev.interviews, keyWitnesses: next },
                        }))
                      }}
                      placeholder="Direct observation statement..."
                      className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subjects of Allegation */}
          {step3Tab === 'subject' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    3. Subject(s) of Allegation (Formal Confrontation &amp; Due Process)
                  </h3>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddSubjectInterview}
                  className="text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subject Interview
                </Button>
              </div>

              <div className="space-y-4">
                {investigation.interviews.subjects.map((sub, i) => (
                  <div key={sub.id} className="border border-rose-200 rounded-xl p-4 bg-rose-50/30 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => {
                          const next = [...investigation.interviews.subjects]
                          next[i] = { ...next[i], name: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, subjects: next },
                          }))
                        }}
                        placeholder="Subject Name"
                        className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2.5 py-1.5"
                      />
                      <input
                        type="text"
                        value={sub.role}
                        onChange={(e) => {
                          const next = [...investigation.interviews.subjects]
                          next[i] = { ...next[i], role: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, subjects: next },
                          }))
                        }}
                        placeholder="Title / Grade"
                        className="text-xs text-slate-800 bg-white border border-slate-200 rounded px-2.5 py-1.5"
                      />
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sub.legalCounselPresent}
                            onChange={(e) => {
                              const next = [...investigation.interviews.subjects]
                              next[i] = { ...next[i], legalCounselPresent: e.target.checked }
                              updateState((prev) => ({
                                ...prev,
                                interviews: { ...prev.interviews, subjects: next },
                              }))
                            }}
                            className="w-3.5 h-3.5 text-cbe-purple rounded"
                          />
                          <span>Counsel Present</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sub.rightsInformed}
                            onChange={(e) => {
                              const next = [...investigation.interviews.subjects]
                              next[i] = { ...next[i], rightsInformed: e.target.checked }
                              updateState((prev) => ({
                                ...prev,
                                interviews: { ...prev.interviews, subjects: next },
                              }))
                            }}
                            className="w-3.5 h-3.5 text-cbe-purple rounded"
                          />
                          <span>Due Process Advised</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-500">
                        Subject Explanation / Recorded Defense
                      </label>
                      <textarea
                        rows={3}
                        value={sub.recordedDefense}
                        onChange={(e) => {
                          const next = [...investigation.interviews.subjects]
                          next[i] = { ...next[i], recordedDefense: e.target.value }
                          updateState((prev) => ({
                            ...prev,
                            interviews: { ...prev.interviews, subjects: next },
                          }))
                        }}
                        placeholder="Record subject's formal response to presented evidence..."
                        className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:border-cbe-purple"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 Footer Nav */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(2)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 2
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveStep(4)}
              className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Proceed to Step 4: Final Investigation Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Final Investigation Report */}
      {activeStep === 4 && (
        <div className="space-y-4">
          <FinalInvestigationReportView
            report={investigation.report}
            onChangeReport={(field, val) =>
              updateState((prev) => ({
                ...prev,
                report: { ...prev.report, [field]: val },
              }))
            }
            isEditable={true}
          />

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(3)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 3: Interviews
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="text-xs font-semibold"
              >
                Save Progress
              </Button>
              <Button
                size="sm"
                onClick={() => setActiveStep(5)}
                className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Proceed to Step 5: Action &amp; Closure</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Action and Closure */}
      {activeStep === 5 && (
        <div className="space-y-4">
          {/* Disciplinary / Legal Action */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cbe-purple" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Disciplinary &amp; Legal Referral Action
                </h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddDisciplinary}
                className="text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Action
              </Button>
            </div>

            <div className="space-y-3">
              {investigation.closure.disciplinaryActions.map((da, i) => (
                <div
                  key={da.id}
                  className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                    <input
                      type="text"
                      value={da.targetSubject}
                      onChange={(e) => {
                        const next = [...investigation.closure.disciplinaryActions]
                        next[i] = { ...next[i], targetSubject: e.target.value }
                        updateState((prev) => ({
                          ...prev,
                          closure: { ...prev.closure, disciplinaryActions: next },
                        }))
                      }}
                      placeholder="Subject Name"
                      className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1"
                    />
                    <select
                      value={da.actionType}
                      onChange={(e) => {
                        const next = [...investigation.closure.disciplinaryActions]
                        next[i] = { ...next[i], actionType: e.target.value }
                        updateState((prev) => ({
                          ...prev,
                          closure: { ...prev.closure, disciplinaryActions: next },
                        }))
                      }}
                      className="text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded px-2 py-1"
                    >
                      <option value="Termination">Termination of Employment</option>
                      <option value="Criminal Referral">Criminal Referral (FEACC / Police)</option>
                      <option value="Demotion / Suspension">Demotion / Suspension</option>
                      <option value="Formal Reprimand">Formal Reprimand</option>
                    </select>
                    <select
                      value={da.status}
                      onChange={(e) => {
                        const next = [...investigation.closure.disciplinaryActions]
                        next[i] = { ...next[i], status: e.target.value as any }
                        updateState((prev) => ({
                          ...prev,
                          closure: { ...prev.closure, disciplinaryActions: next },
                        }))
                      }}
                      className="text-xs font-bold text-cbe-purple bg-white border border-slate-200 rounded px-2 py-1"
                    >
                      <option value="Pending">Pending Execution</option>
                      <option value="Executed">Executed</option>
                      <option value="Under Appeal">Under Appeal</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = investigation.closure.disciplinaryActions.filter((item) => item.id !== da.id)
                      updateState((prev) => ({
                        ...prev,
                        closure: { ...prev.closure, disciplinaryActions: next },
                      }))
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Systemic Corrective Measures */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-cbe-purple" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Institutional Corrective &amp; Policy Measures
                </h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddSystemicMeasure}
                className="text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Measure
              </Button>
            </div>

            <div className="space-y-3">
              {investigation.closure.systemicMeasures.map((sm, i) => (
                <div
                  key={sm.id}
                  className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                    <input
                      type="text"
                      value={sm.policyTitle}
                      onChange={(e) => {
                        const next = [...investigation.closure.systemicMeasures]
                        next[i] = { ...next[i], policyTitle: e.target.value }
                        updateState((prev) => ({
                          ...prev,
                          closure: { ...prev.closure, systemicMeasures: next },
                        }))
                      }}
                      placeholder="Policy / Control Measure"
                      className="text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 sm:col-span-2"
                    />
                    <select
                      value={sm.status}
                      onChange={(e) => {
                        const next = [...investigation.closure.systemicMeasures]
                        next[i] = { ...next[i], status: e.target.value as any }
                        updateState((prev) => ({
                          ...prev,
                          closure: { ...prev.closure, systemicMeasures: next },
                        }))
                      }}
                      className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Implemented">Implemented</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = investigation.closure.systemicMeasures.filter((item) => item.id !== sm.id)
                      updateState((prev) => ({
                        ...prev,
                        closure: { ...prev.closure, systemicMeasures: next },
                      }))
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Whistleblower Protection & Formal Closure */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-4 h-4 text-cbe-purple" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Reporter Feedback, Anti-Retaliation &amp; Final Case Closure
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feedback to Reporter */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Feedback to Whistleblower</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={investigation.closure.whistleblowerFeedbackProvided}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          closure: {
                            ...prev.closure,
                            whistleblowerFeedbackProvided: e.target.checked,
                            whistleblowerFeedbackDate: e.target.checked ? new Date().toLocaleDateString() : undefined,
                          },
                        }))
                      }
                      className="w-3.5 h-3.5 text-cbe-purple rounded"
                    />
                    <span className="text-[11px] font-semibold text-slate-700">Provided</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={investigation.closure.whistleblowerFeedbackNotes || ''}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      closure: { ...prev.closure, whistleblowerFeedbackNotes: e.target.value },
                    }))
                  }
                  placeholder="Record formal outcome notification notes (respecting subject privacy)..."
                  className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white"
                />
              </div>

              {/* Anti-Retaliation Monitoring */}
              <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Anti-Retaliation Monitoring</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={investigation.closure.antiRetaliationActive}
                      onChange={(e) =>
                        updateState((prev) => ({
                          ...prev,
                          closure: { ...prev.closure, antiRetaliationActive: e.target.checked },
                        }))
                      }
                      className="w-3.5 h-3.5 text-emerald-600 rounded"
                    />
                    <span className="text-[11px] font-semibold text-emerald-700">Active Protection</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  value={investigation.closure.antiRetaliationNotes || ''}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      closure: { ...prev.closure, antiRetaliationNotes: e.target.value },
                    }))
                  }
                  placeholder="Record ongoing protection protocols and status checks..."
                  className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white"
                />
              </div>
            </div>

            {/* Formal Case Closure & Program Review */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Formal Case Closure</span>
                <span className="text-[11px] text-slate-500 block">
                  Archive complete investigation file and conclude matter in FIRMS compliance registry.
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  updateState((prev) => ({
                    ...prev,
                    closure: {
                      ...prev.closure,
                      caseClosureFormal: true,
                      caseClosedAt: new Date().toISOString(),
                    },
                  }))
                  onSave()
                }}
                className={`text-xs font-semibold ${
                  investigation.closure.caseClosureFormal
                    ? 'bg-slate-800 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {investigation.closure.caseClosureFormal ? 'Case Formally Closed' : 'Finalize & Close Case'}
              </Button>
            </div>
          </div>

          {/* Step 5 Footer Nav */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveStep(4)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 4: Final Report
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Save Full Investigation Progress</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
