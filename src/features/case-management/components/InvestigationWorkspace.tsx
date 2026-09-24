import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  FileCheck2,
  Search,
  Users,
  Send,
  Save,
  Check,
  FileText,
  X,
  Briefcase,
  Flame,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import { fetchCaseById, updateCaseTriage, updateCaseFullInvestigation } from '../api/getCases'
import { PreliminaryAssessmentReportView } from './PreliminaryAssessmentReportView'
import { FullInvestigationWorkspace } from './FullInvestigationWorkspace'
import type { PreliminaryAssessmentReport, TriageWorkflowState } from '../types/triage.types'
import type { FullInvestigationState } from '../types/investigation.types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'
import { ROUTES } from '@/config/routes'

const TRIAGE_STEPS = [
  { id: 1, label: '1. Secure & Acknowledge' },
  { id: 2, label: '2. Initial Review & Triage' },
  { id: 3, label: '3. Covert Fact-Checking' },
  { id: 4, label: '4. Assessment Report' },
]

export const InvestigationWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const caseId = id || 'case-02'

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case-detail', caseId],
    queryFn: () => fetchCaseById(caseId),
  })

  // Phase is strictly sequential: 'triage' (Phase 1) -> 'full-investigation' (Phase 2)
  const [currentPhase, setCurrentPhase] = useState<'triage' | 'full-investigation'>('triage')
  const [activeTriageStep, setActiveTriageStep] = useState<number>(1)
  const [triageState, setTriageState] = useState<TriageWorkflowState | null>(null)
  const [reportState, setReportState] = useState<PreliminaryAssessmentReport | null>(null)
  const [fullInvestigationState, setFullInvestigationState] = useState<FullInvestigationState | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showReportDrawer, setShowReportDrawer] = useState(false)
  const [showPredicationModal, setShowPredicationModal] = useState(false)

  React.useEffect(() => {
    if (caseData) {
      setTriageState(caseData.triageWorkflow)
      setReportState(caseData.preliminaryAssessmentReport)
      if (caseData.fullInvestigation) {
        setFullInvestigationState(caseData.fullInvestigation)
      }
      // If case was already escalated or in active investigation, open Phase 2
      if (caseData.status === 'INVESTIGATION_ACTIVE' || caseData.status === 'RESOLVED') {
        setCurrentPhase('full-investigation')
      } else {
        setCurrentPhase('triage')
      }
    }
  }, [caseData])

  if (isLoading || !caseData || !triageState || !reportState) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Spinner size="lg" />
        <p className="text-xs">Loading case details...</p>
      </div>
    )
  }

  const handleUpdateReportField = (field: keyof PreliminaryAssessmentReport, value: string) => {
    setReportState((prev) => (prev ? { ...prev, [field]: value } : prev))
    if (field === 'recommendedAction') {
      setTriageState((prev) =>
        prev
          ? {
              ...prev,
              recommendedAction: value as 'Full Investigation' | 'Referral' | 'Case Closure',
            }
          : prev
      )
    }
    if (field === 'predicationDetermination') {
      setTriageState((prev) =>
        prev ? { ...prev, predicationDetermination: value as 'Sufficient' | 'Insufficient' } : prev
      )
    }
    if (field === 'referralTarget') {
      setTriageState((prev) => (prev ? { ...prev, referralTarget: value } : prev))
    }
    if (field === 'nextStepsInterimMeasures') {
      setTriageState((prev) => (prev ? { ...prev, nextStepsInterimMeasures: value } : prev))
    }
  }

  const handleSaveTriage = async () => {
    await updateCaseTriage(caseId, triageState, reportState)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleSaveFullInvestigation = async () => {
    if (fullInvestigationState) {
      await updateCaseFullInvestigation(caseId, fullInvestigationState)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }
  }

  // Sent from Phase 1 toward Phase 2
  const handleEscalateToFullInvestigation = async () => {
    await updateCaseTriage(caseId, triageState, reportState)
    if (fullInvestigationState) {
      await updateCaseFullInvestigation(caseId, fullInvestigationState)
    }
    setCurrentPhase('full-investigation')
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12">
      {/* 1. Sleek, Unified Top Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.CASES}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Back to Cases"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-base text-cbe-purple">
              {caseData.referenceKey}
            </span>
            <Badge variant="default">{caseData.status}</Badge>
            <Badge
              variant={
                caseData.priority === 'CRITICAL'
                  ? 'danger'
                  : caseData.priority === 'HIGH'
                  ? 'warning'
                  : 'neutral'
              }
            >
              {caseData.priority}
            </Badge>

            {/* Current Phase Badge */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                currentPhase === 'full-investigation'
                  ? 'bg-cbe-purple text-white'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {currentPhase === 'full-investigation' ? (
                <>
                  <Briefcase className="w-3 h-3 text-cbe-gold" />
                  Phase 2: Full Investigation
                </>
              ) : (
                <>
                  <Search className="w-3 h-3 text-cbe-purple" />
                  Phase 1: Preliminary Assessment &amp; Triage
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          {/* On-demand Case Details button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReportDrawer(true)}
            className="text-xs flex items-center gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-700"
            title="View full report intake details"
          >
            <FileText className="w-3.5 h-3.5 text-cbe-purple" />
            <span>Case Details</span>
          </Button>

          {currentPhase === 'full-investigation' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPredicationModal(true)}
              className="text-xs flex items-center gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Predication Note</span>
            </Button>
          )}

          <Button
            onClick={currentPhase === 'triage' ? handleSaveTriage : handleSaveFullInvestigation}
            className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Progress</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHASE 1: PRELIMINARY ASSESSMENT & TRIAGE                                  */}
      {/* (Appears ONLY during triage stage until escalated to Phase 2)             */}
      {/* ========================================================================= */}
      {currentPhase === 'triage' && (
        <div className="space-y-4">
          {/* Phase 1 Stepper Navigation */}
          <div className="flex border-b border-slate-200 gap-1 bg-white p-1 rounded-lg">
            {TRIAGE_STEPS.map((tab) => {
              const isActive = activeTriageStep === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTriageStep(tab.id)}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                    isActive
                      ? 'bg-cbe-purple text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Active Step Panel */}
          <div>
            {/* STEP 1: Secure and Acknowledge */}
            {activeTriageStep === 1 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Acknowledge Receipt */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-800">1. Acknowledge Receipt</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            triageState.isAcknowledged
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {triageState.isAcknowledged ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      {triageState.isAcknowledged && triageState.acknowledgedAt && (
                        <p className="text-[11px] text-slate-500 mb-3">
                          Sent: {new Date(triageState.acknowledgedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        setTriageState((prev) => ({
                          ...prev!,
                          isAcknowledged: true,
                          acknowledgedAt: new Date().toISOString(),
                        }))
                      }
                      disabled={triageState.isAcknowledged}
                      className="w-full bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-medium"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      {triageState.isAcknowledged ? 'Acknowledged' : 'Send Acknowledgment'}
                    </Button>
                  </div>

                  {/* 2. Safeguard Evidence */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-800">2. Safeguard Evidence</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            triageState.legalHoldInitiated
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {triageState.legalHoldInitiated ? 'Active Hold' : 'Inactive'}
                        </span>
                      </div>
                      {triageState.legalHoldInitiated && triageState.legalHoldNoticeRef && (
                        <p className="text-[11px] text-slate-500 mb-3">
                          Ref: {triageState.legalHoldNoticeRef}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={triageState.legalHoldInitiated ? 'outline' : 'primary'}
                      onClick={() =>
                        setTriageState((prev) => ({
                          ...prev!,
                          legalHoldInitiated: true,
                          legalHoldNoticeRef: `LH-${new Date().getFullYear()}-${Math.floor(
                            100 + Math.random() * 900
                          )}`,
                          legalHoldAt: new Date().toISOString(),
                        }))
                      }
                      className="w-full text-xs font-medium"
                    >
                      <Shield className="w-3.5 h-3.5 mr-1 text-cbe-gold" />
                      {triageState.legalHoldInitiated ? 'Legal Hold Active' : 'Issue Legal Hold'}
                    </Button>
                  </div>

                  {/* 3. Appoint Investigator */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">3. Appoint Investigator</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            triageState.investigatorAssigned
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {triageState.investigatorAssigned ? 'Assigned' : 'Unassigned'}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Investigator or team name"
                        value={triageState.investigatorAssigned || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          setTriageState((prev) => ({ ...prev!, investigatorAssigned: val }))
                          handleUpdateReportField('investigatorTeamAssigned', val)
                        }}
                        className="w-full text-xs border border-slate-300 rounded p-1.5 bg-white"
                      />
                      <label className="flex items-center gap-1.5 cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          checked={triageState.noConflictSigned}
                          onChange={(e) =>
                            setTriageState((prev) => ({ ...prev!, noConflictSigned: e.target.checked }))
                          }
                          className="w-3.5 h-3.5 text-cbe-purple rounded"
                        />
                        <span className="text-[11px] text-slate-700 font-medium">
                          No Conflict of Interest
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
                  <Button
                    size="sm"
                    onClick={() => setActiveTriageStep(2)}
                    className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Proceed to Step 2: Initial Review &amp; Triage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Initial Review & Triage */}
            {activeTriageStep === 2 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
                {/* Jurisdiction */}
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-semibold text-slate-700">Jurisdiction</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jurisdiction"
                        checked={triageState.isWithinJurisdiction}
                        onChange={() => setTriageState((prev) => ({ ...prev!, isWithinJurisdiction: true }))}
                        className="text-cbe-purple"
                      />
                      <span className="text-xs text-slate-800 font-medium">
                        Within Corruption Mandate
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jurisdiction"
                        checked={!triageState.isWithinJurisdiction}
                        onChange={() => setTriageState((prev) => ({ ...prev!, isWithinJurisdiction: false }))}
                        className="text-cbe-purple"
                      />
                      <span className="text-xs text-slate-800 font-medium">
                        Outside Mandate (Referral Required)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Triage Criteria */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-semibold text-slate-700">Specificity</label>
                    <select
                      value={triageState.specificityRating}
                      onChange={(e) => {
                        const val = e.target.value as 'High' | 'Medium' | 'Low'
                        setTriageState((prev) => ({ ...prev!, specificityRating: val }))
                        handleUpdateReportField('specificityAndDetail', `${val} – verified details.`)
                      }}
                      className="w-full text-xs border border-slate-300 rounded p-2 bg-white font-medium"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-semibold text-slate-700">Corroboration</label>
                    <select
                      value={triageState.corroborationRating}
                      onChange={(e) => {
                        const val = e.target.value as 'High' | 'Medium' | 'Low'
                        setTriageState((prev) => ({ ...prev!, corroborationRating: val }))
                        handleUpdateReportField('credibilityAssessment', `${val} credibility based on proof.`)
                      }}
                      className="w-full text-xs border border-slate-300 rounded p-2 bg-white font-medium"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-semibold text-slate-700">Severity</label>
                    <select
                      value={triageState.severityRating}
                      onChange={(e) => {
                        const val = e.target.value as 'High' | 'Medium' | 'Low'
                        setTriageState((prev) => ({ ...prev!, severityRating: val }))
                        handleUpdateReportField('severityAssessment', `${val} impact.`)
                      }}
                      className="w-full text-xs border border-slate-300 rounded p-2 bg-white font-medium"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTriageStep(1)}
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Step 1</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActiveTriageStep(3)}
                    className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Proceed to Step 3: Covert Fact-Checking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Covert Fact-Checking */}
            {activeTriageStep === 3 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="space-y-3">
                  {/* Org Chart */}
                  <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cbe-purple" />
                        Organization &amp; Role Review
                      </span>
                      <input
                        type="checkbox"
                        checked={triageState.orgChartReviewed}
                        onChange={(e) =>
                          setTriageState((prev) => ({ ...prev!, orgChartReviewed: e.target.checked }))
                        }
                        className="w-3.5 h-3.5 text-cbe-purple rounded"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={triageState.orgChartFindings || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setTriageState((prev) => ({ ...prev!, orgChartFindings: val }))
                        handleUpdateReportField('initialReviewFindings', val)
                      }}
                      placeholder="Record role, reporting lines, and system access..."
                      className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                    />
                  </div>

                  {/* OSINT */}
                  <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-cbe-gold" />
                        Open Source Intelligence (OSINT)
                      </span>
                      <input
                        type="checkbox"
                        checked={triageState.osintReviewed}
                        onChange={(e) =>
                          setTriageState((prev) => ({ ...prev!, osintReviewed: e.target.checked }))
                        }
                        className="w-3.5 h-3.5 text-cbe-purple rounded"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={triageState.osintFindings || ''}
                      onChange={(e) =>
                        setTriageState((prev) => ({ ...prev!, osintFindings: e.target.value }))
                      }
                      placeholder="Record public records, corporate registries, and red flags..."
                      className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                    />
                  </div>

                  {/* Internal Records */}
                  <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                        Internal Records Review
                      </span>
                      <input
                        type="checkbox"
                        checked={triageState.internalRecordsReviewed}
                        onChange={(e) =>
                          setTriageState((prev) => ({
                            ...prev!,
                            internalRecordsReviewed: e.target.checked,
                          }))
                        }
                        className="w-3.5 h-3.5 text-cbe-purple rounded"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={triageState.internalRecordsFindings || ''}
                      onChange={(e) =>
                        setTriageState((prev) => ({
                          ...prev!,
                          internalRecordsFindings: e.target.value,
                        }))
                      }
                      placeholder="Audit reports, ledger checks, logs..."
                      className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                    />
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTriageStep(2)}
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Step 2</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActiveTriageStep(4)}
                    className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Proceed to Step 4: Assessment Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: Assessment Report */}
            {activeTriageStep === 4 && (
              <div className="space-y-4">
                <PreliminaryAssessmentReportView
                  report={reportState}
                  onChangeReport={handleUpdateReportField}
                  isEditable={true}
                />

                {/* ACTION: If Sufficient Predication & Full Investigation chosen, ESCALATE to Phase 2 */}
                {reportState.predicationDetermination === 'Sufficient' &&
                  reportState.recommendedAction === 'Full Investigation' && (
                    <div className="p-5 rounded-xl bg-purple-50/80 border-2 border-cbe-purple flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-cbe-purple flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-cbe-gold" />
                          Preliminary Assessment Complete — Predication Established
                        </span>
                        <p className="text-xs text-slate-700">
                          Sufficient grounds found. Send case to <strong>Phase 2: Full Investigation</strong> for formal planning, forensic seizure, and witness interviews.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleEscalateToFullInvestigation}
                        className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-bold flex items-center gap-1.5 shrink-0 px-4 py-2"
                      >
                        <span>Escalate to Full Investigation</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                {/* Step Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTriageStep(3)}
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Step 3: Fact-Checking</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveTriage}
                    className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Assessment</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: FULL INVESTIGATION                                               */}
      {/* (Appears ONLY when sent from Phase 1, or for active investigation cases)  */}
      {/* ========================================================================= */}
      {currentPhase === 'full-investigation' && fullInvestigationState && (
        <div className="space-y-4">
          <FullInvestigationWorkspace
            investigation={fullInvestigationState}
            onUpdateInvestigation={setFullInvestigationState}
            onSave={handleSaveFullInvestigation}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* Slide-Over Drawer: Whistleblower Original Submission Details              */}
      {/* ========================================================================= */}
      {showReportDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowReportDrawer(false)}
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cbe-purple" />
                <h3 className="font-bold text-sm text-slate-900">
                  Original Whistleblower Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReportDrawer(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* Reference */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Reference Number</div>
                <div className="font-mono font-bold text-sm text-cbe-purple">{caseData.referenceKey}</div>
                <div className="text-[11px] text-slate-500">
                  Submitted: {new Date(caseData.submittedAt).toLocaleString()}
                </div>
              </div>

              {/* Allegation Summary */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Allegation Summary</span>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">{caseData.summary}</p>
              </div>

              {/* Detailed Narrative */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Detailed Statement</span>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line leading-relaxed">
                  {caseData.detailedNarrative}
                </p>
              </div>

              {/* Incident Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Incident Date</span>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">{caseData.incidentDate}</div>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Incident Location</span>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">{caseData.incidentLocation}</div>
                </div>
              </div>

              {/* Subject Information */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block">Accused Subject(s)</span>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Names</span>
                    <strong>{caseData.corruptedPersonNames}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Positions</span>
                    <strong>{caseData.jobPositions}</strong>
                  </div>
                </div>
              </div>

              {/* Evidence Provided */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block">Evidence In Possession</span>
                <p className="bg-slate-50 p-2.5 rounded border border-slate-100">{caseData.evidenceInPossession}</p>
                {caseData.attachedFiles && caseData.attachedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500">Attached Files:</span>
                    {caseData.attachedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-cbe-purple font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* How Aware & Why Corrupt */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 block">How Reporter Became Aware</span>
                  <p className="text-slate-600 mt-0.5">{caseData.howAware}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Why Alleged Corrupt</span>
                  <p className="text-slate-600 mt-0.5">{caseData.whyCorrupt}</p>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div>Reporting Mode: <strong className="text-slate-700 capitalize">{caseData.reportingMode}</strong></div>
                <div>Recipient: <strong className="text-slate-700">{caseData.reportRecipient}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: View Phase 1 Predication Note (When in Phase 2)                    */}
      {/* ========================================================================= */}
      {showPredicationModal && reportState && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowPredicationModal(false)}
          />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col z-10 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cbe-purple" />
                <h3 className="font-bold text-sm text-slate-900">
                  Approved Preliminary Assessment &amp; Predication Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPredicationModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <PreliminaryAssessmentReportView
                report={reportState}
                isEditable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
