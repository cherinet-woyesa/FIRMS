import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Shield,
  Users,
  Send,
  Save,
  Check,
  FileText,
  X,
  Flame,
  Building,
  Globe,
  Database,
} from 'lucide-react'
import { fetchCaseById, updateCaseTriage, updateCaseFullInvestigation } from '../api/getCases'
import { PreliminaryAssessmentReportView } from './PreliminaryAssessmentReportView'
import { FullInvestigationWorkspace } from './FullInvestigationWorkspace'
import type { PreliminaryAssessmentReport, TriageWorkflowState } from '../types/triage.types'
import type { FullInvestigationState } from '../types/investigation.types'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'
import { ROUTES } from '@/config/routes'

export const InvestigationWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const caseId = id || 'case-02'

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case-detail', caseId],
    queryFn: () => fetchCaseById(caseId),
  })


  const { user } = useSelector((state: RootState) => state.auth)
  const userRoles = user?.roles || []
  const isPresident = userRoles.includes('President')
  const isVpIa = userRoles.some(r => r.includes('VP') || r.includes('VP-IA') || r.includes('VP–IA'))
  const isFiDirector = userRoles.includes('FI Director') || userRoles.includes('Director')
  const isFiManager = userRoles.includes('FI Manager') || (userRoles.includes('Manager') && !userRoles.includes('Follow-Up Manager') && !userRoles.includes('Manager - Follow-Up'))
  const isFollowUpManager = userRoles.includes('Follow-Up Manager') || userRoles.includes('Manager - Follow-Up')
  const isSarcSecretary = userRoles.includes('SARC Secretary')
  const canInitiateInvestigation = isPresident || isVpIa
  const isManager = isPresident || isVpIa || isFiDirector || isFiManager || userRoles.includes('Administrator')
  const isInvestigator = userRoles.some(r => r.includes('Investigator') || r.includes('Auditor') || r.includes('Team Leader'))
  const isEditable = !isFollowUpManager && !isSarcSecretary

  // Phase is strictly sequential: 'triage' (Phase 1) -> 'full-investigation' (Phase 2)
  const [currentPhase, setCurrentPhase] = useState<'triage' | 'full-investigation'>('triage')

  // Managers start at step 1. Investigators start at step 2.
  const [activeTriageStep, setActiveTriageStep] = useState<number>(isManager && !isInvestigator ? 1 : 2)

  const [triageState, setTriageState] = useState<TriageWorkflowState | null>(null)
  const [reportState, setReportState] = useState<PreliminaryAssessmentReport | null>(null)
  const [fullInvestigationState, setFullInvestigationState] = useState<FullInvestigationState | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showReportDrawer, setShowReportDrawer] = useState(false)

  useEffect(() => {
    if (caseData) {
      setTriageState(caseData.triageWorkflow || {
        isAcknowledged: false,
        legalHoldInitiated: false,
        noConflictSigned: false,
        isWithinJurisdiction: false,
        specificityRating: 'Medium',
        corroborationRating: 'Medium',
        severityRating: 'Medium',
        orgChartReviewed: false,
        osintReviewed: false,
        internalRecordsReviewed: false,
        predicationDetermination: 'Insufficient',
        recommendedAction: 'Full Investigation'
      })

      setReportState(caseData.preliminaryAssessmentReport || {
        caseId: caseData.referenceKey,
        dateReportReceipt: caseData.submittedAt,
        investigatorTeamAssigned: '',
        dateAssessmentCompletion: '',
        sourceReportingChannel: caseData.reportingMode || '',
        allegedSubjects: '',
        allegedOrganizationUnit: caseData.targetDepartment || '',
        typeOfMisconduct: caseData.category || '',
        allegedPeriodOfIncident: '',
        allegationSummary: caseData.summary,
        applicableLawPolicy: '',
        specificityAndDetail: '',
        evidenceProvided: '',
        initialReviewFindings: '',
        credibilityAssessment: '',
        severityAssessment: '',
        predicationDetermination: 'Insufficient',
        recommendedAction: 'Full Investigation',
        recommendedActionJustification: '',
        nextStepsInterimMeasures: ''
      })

      if (caseData.fullInvestigation) {
        setFullInvestigationState(caseData.fullInvestigation)
      } else {
        // Also provide a default for full investigation state just in case it's needed later
        setFullInvestigationState({
          currentStep: 1,
          planning: {
            isAuthorized: false,
            authorizedBy: '',
            authorizationDate: '',
            approvalScope: [],
            specificAllegations: '',
            investigationTimeframe: '',
            targetSubjects: '',
            requiredResources: '',
            workPlanFinalized: false,
            workPlanNotes: ''
          },
          evidence: {
            seizedRecords: [],
            forensicAuditEngaged: false,
            forensicAgency: '',
            fundsTracedETB: '',
            quantifiedLossesETB: '',
            illicitPatternsIdentified: '',
            covertExternalInquiries: []
          },
          interviews: {
            neutralWitnesses: [],
            keyWitnesses: [],
            subjects: []
          },
          report: {
            caseId: '',
            dateFinalSubmission: '',
            allegationSummary: '',
            investigativeFinding: 'Not Substantiated',
            estimatedFinancialImpact: '',
            recommendation: '',
            sourceOfReport: '',
            originalAllegationVerbatim: '',
            dateInvestigationCommenced: '',
            scopeOfInvestigation: '',
            investigativeTeam: '',
            documentReview: '',
            forensicAnalysis: '',
            interviewsConducted: '',
            findings: [],
            conclusionText: '',
            findingDetermination: 'Not Substantiated',
            policyLawViolated: '',
            disciplinaryLegalActions: [],
            systemicPreventativeMeasures: [],
            exhibits: [],
            investigatorSignature: '',
            signatureDate: '',
            reviewedAndApprovedBy: '',
            approvalDate: '',
            approvalStatus: 'Pending Review'
          },
          closure: {
            disciplinaryActions: [],
            systemicMeasures: [],
            whistleblowerFeedbackProvided: false,
            antiRetaliationActive: false,
            caseClosureFormal: false
          }
        })
      }

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

  const handleHandover = async () => {
    await handleSaveTriage()
    navigate(ROUTES.CASES)
  }

  const handleSaveFullInvestigation = async () => {
    if (fullInvestigationState) {
      await updateCaseFullInvestigation(caseId, fullInvestigationState)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }
  }

  const handleEscalateToFullInvestigation = async () => {
    await updateCaseTriage(caseId, triageState, reportState)
    if (fullInvestigationState) {
      await updateCaseFullInvestigation(caseId, fullInvestigationState)
    }
    setCurrentPhase('full-investigation')
  }

  const scrollToTop = () => {
    const mainEl = document.getElementById('main-content-scroll')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12">
      {/* 1. Sleek, Unified Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.CASES}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Back to Cases"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-lg text-slate-900 tracking-tight">
              {caseData.referenceKey}
            </span>
            <span className="text-slate-300 font-light hidden sm:inline">|</span>
            <span className="text-sm text-slate-500 font-medium hidden sm:inline">
              {currentPhase === 'full-investigation' ? 'Final Investigation Report' : 'Preliminary Assessment & Triage'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mr-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {caseData.status === 'INVESTIGATION_ACTIVE' ? 'Resolved' : caseData.status}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            {caseData.priority}
          </span>
          {currentPhase === 'full-investigation' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-cbe-purple border border-purple-200">
              Phase 2: Full Investigation
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReportDrawer(true)}
            className="text-xs flex items-center gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-700 ml-1"
            title="View full report intake details"
          >
            <FileText className="w-3.5 h-3.5 text-cbe-purple" />
            <span>Case Details</span>
          </Button>

          {isEditable && (
            <Button
              onClick={currentPhase === 'triage' ? handleSaveTriage : handleSaveFullInvestigation}
              className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Progress</span>
            </Button>
          )}
        </div>
      </div>

      {currentPhase === 'triage' && (
        <div className="space-y-4">
          <div>
            {/* STEP 1: Secure and Acknowledge */}
            {activeTriageStep === 1 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">1. Secure &amp; Acknowledge</h3>
                  </div>
                  <span className="text-xs font-bold text-cbe-purple bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                    {Number(triageState.isAcknowledged) +
                      Number(triageState.legalHoldInitiated) +
                      Number(Boolean(triageState.investigatorAssigned && triageState.noConflictSigned))}/3 Completed
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Action 1: Acknowledge Receipt */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${triageState.isAcknowledged
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                          }`}
                      >
                        {triageState.isAcknowledged ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-xs">Acknowledge Receipt</span>
                        <p className="text-[11px] text-slate-500">
                          {triageState.isAcknowledged && triageState.acknowledgedAt
                            ? `Sent on ${new Date(triageState.acknowledgedAt).toLocaleString()}`
                            : ' '}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={triageState.isAcknowledged}
                      onClick={() =>
                        setTriageState((prev) => ({
                          ...prev!,
                          isAcknowledged: true,
                          acknowledgedAt: new Date().toISOString(),
                        }))
                      }
                      className={
                        triageState.isAcknowledged
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-xs'
                          : 'bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs'
                      }
                    >
                      {triageState.isAcknowledged ? '✓ Acknowledged' : 'Send Acknowledgment'}
                    </Button>
                  </div>

                  {/* Action 2: Safeguard Evidence */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${triageState.legalHoldInitiated
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                          }`}
                      >
                        <Shield
                          className={`w-4 h-4 ${triageState.legalHoldInitiated ? 'text-emerald-600' : 'text-slate-500'
                            }`}
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-xs">Safeguard Evidence (Legal Hold)</span>
                        <p className="text-[11px] text-slate-500">
                          {triageState.legalHoldInitiated
                            ? `Active Notice Ref: ${triageState.legalHoldNoticeRef || 'LH-2026-092'}`
                            : ' '}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={triageState.legalHoldInitiated ? 'outline' : 'primary'}
                      onClick={() =>
                        setTriageState((prev) => ({
                          ...prev!,
                          legalHoldInitiated: true,
                          legalHoldNoticeRef:
                            prev?.legalHoldNoticeRef ||
                            `LH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                          legalHoldAt: new Date().toISOString(),
                        }))
                      }
                      className={
                        triageState.legalHoldInitiated
                          ? 'text-emerald-700 border-emerald-300 bg-emerald-50 text-xs'
                          : 'bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs'
                      }
                    >
                      {triageState.legalHoldInitiated ? '✓ Legal Hold Active' : 'Issue Legal Hold'}
                    </Button>
                  </div>

                  {/* Action 3: Assign Investigation Team */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${triageState.investigatorAssigned && triageState.noConflictSigned
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                          }`}
                      >
                        <Users
                          className={`w-4 h-4 ${triageState.investigatorAssigned && triageState.noConflictSigned
                            ? 'text-emerald-600'
                            : 'text-slate-500'
                            }`}
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-xs">Assign Investigation Team</span>
                        <p className="text-[11px] text-slate-500">
                          {triageState.investigatorAssigned
                            ? `Assigned Team: ${triageState.investigatorAssigned} • ${triageState.noConflictSigned ? 'No Conflict Confirmed' : 'Pending Conflict Review'
                            }`
                            : 'Select a team to handle this case'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={triageState.investigatorAssigned || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          setTriageState((prev) => ({ ...prev!, investigatorAssigned: val }))
                          handleUpdateReportField('investigatorTeamAssigned', val)
                        }}
                        className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white w-48 focus:ring-1 focus:ring-cbe-purple"
                      >
                        <option value="">Select Assignee...</option>
                        {isPresident ? (
                          <>
                            <option value="VP-IA (Vice President Internal Audit)">VP-IA (Vice President Internal Audit)</option>
                          </>
                        ) : isVpIa ? (
                          <>
                            <option value="FI Director (Fraud Investigation)">FI Director (Fraud Investigation)</option>
                          </>
                        ) : isFiDirector ? (
                          <>
                            <option value="FI Manager (Procurement & Logistics)">FI Manager (Procurement & Logistics)</option>
                            <option value="FI Manager (HR & Administration)">FI Manager (HR & Administration)</option>
                            <option value="FI Manager (Branch Operations)">FI Manager (Branch Operations)</option>
                          </>
                        ) : (
                          <>
                            <option value="Team Alpha (Procurement Fraud)">Team Alpha (Procurement Fraud)</option>
                            <option value="Team Beta (Internal Audit)">Team Beta (Internal Audit)</option>
                            <option value="Ad-Hoc Team Gamma">Ad-Hoc Investigation Team</option>
                          </>
                        )}
                      </select>

                      <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={triageState.noConflictSigned}
                          onChange={(e) =>
                            setTriageState((prev) => ({ ...prev!, noConflictSigned: e.target.checked }))
                          }
                          className="w-3.5 h-3.5 text-cbe-purple rounded"
                        />
                        <span>No Conflict</span>
                      </label>
                    </div>
                  </div>

                  {/* President's Directives */}
                  {isPresident ? (
                    <div className="mt-3 p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 flex flex-col gap-2">
                      <label className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cbe-purple" />
                        President's Directives & Instructions (for VP-IA)
                      </label>
                      <textarea
                        value={triageState.executiveDirectives || ''}
                        onChange={(e) => {
                          const val = e.target.value
                          setTriageState((prev) => ({ ...prev!, executiveDirectives: val }))
                          handleUpdateReportField('executiveDirectives', val)
                        }}
                        placeholder="Provide explicit instructions, boundaries, or specific requests for the VP-IA to carry out..."
                        className="text-xs border border-purple-200 rounded-lg p-2.5 bg-white min-h-[80px] focus:ring-1 focus:ring-cbe-purple w-full"
                      />
                    </div>
                  ) : triageState.executiveDirectives && (
                    <div className="mt-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex flex-col gap-2">
                      <label className="font-bold text-amber-900 text-xs flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-600" />
                        Directives & Instructions from President
                      </label>
                      <p className="text-xs text-amber-800 bg-white/50 p-2.5 rounded border border-amber-100 whitespace-pre-line">
                        {triageState.executiveDirectives}
                      </p>
                    </div>
                  )}
                </div>

                {/* Step Navigation */}
                <div className="flex justify-end pt-3 border-t border-slate-100">
                  {isManager && !isInvestigator && isEditable ? (
                    <Button
                      size="sm"
                      onClick={handleHandover}
                      className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>Save & Handover to Assigned Team</span>
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setActiveTriageStep(2)}
                      className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>Proceed to Step 2: Initial Review &amp; Triage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Initial Review & Triage */}
            {activeTriageStep === 2 && (
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
                      onClick={() => setTriageState((prev) => ({ ...prev!, isWithinJurisdiction: true }))}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${triageState.isWithinJurisdiction
                        ? 'border-cbe-purple bg-purple-50 text-cbe-purple shadow-2xs ring-1 ring-cbe-purple'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                      <span>Within Corruption &amp; Ethics Mandate</span>
                      {triageState.isWithinJurisdiction && <Check className="w-4 h-4 text-cbe-purple" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setTriageState((prev) => ({ ...prev!, isWithinJurisdiction: false }))}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition cursor-pointer ${!triageState.isWithinJurisdiction
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
                              setTriageState((prev) => ({ ...prev!, specificityRating: lvl }))
                              handleUpdateReportField('specificityAndDetail', `${lvl} – verified details.`)
                            }}
                            className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${triageState.specificityRating === lvl
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
                              setTriageState((prev) => ({ ...prev!, corroborationRating: lvl }))
                              handleUpdateReportField('credibilityAssessment', `${lvl} credibility.`)
                            }}
                            className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${triageState.corroborationRating === lvl
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
                              setTriageState((prev) => ({ ...prev!, severityRating: lvl }))
                              handleUpdateReportField('severityAssessment', `${lvl} risk.`)
                            }}
                            className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${triageState.severityRating === lvl
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
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">



                  <Button
                    size="sm"
                    onClick={() => setActiveTriageStep(3)}
                    className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>Covert Fact-Checking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: Covert Fact-Checking */}
            {activeTriageStep === 3 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">3. Covert Fact-Checking</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Item 1: Org Chart */}
                  <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-cbe-purple" />
                        <span className="text-xs font-bold text-slate-800">Organization &amp; Authority Review</span>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={triageState.orgChartReviewed}
                          onChange={(e) =>
                            setTriageState((prev) => ({ ...prev!, orgChartReviewed: e.target.checked }))
                          }
                          className="w-3.5 h-3.5 text-cbe-purple rounded"
                        />
                        <span>Verified</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={triageState.orgChartFindings || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setTriageState((prev) => ({ ...prev!, orgChartFindings: val }))
                        handleUpdateReportField('initialReviewFindings', val)
                      }}
                      placeholder="e.g. Subject has Tier-3 approval limit on clearing adjustments..."
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-1 focus:ring-cbe-purple"
                    />
                  </div>

                  {/* Item 2: OSINT */}
                  <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cbe-gold" />
                        <span className="text-xs font-bold text-slate-800">OSINT &amp; External Registries</span>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={triageState.osintReviewed}
                          onChange={(e) =>
                            setTriageState((prev) => ({ ...prev!, osintReviewed: e.target.checked }))
                          }
                          className="w-3.5 h-3.5 text-cbe-purple rounded"
                        />
                        <span>Verified</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={triageState.osintFindings || ''}
                      onChange={(e) =>
                        setTriageState((prev) => ({ ...prev!, osintFindings: e.target.value }))
                      }
                      placeholder="e.g. Corporate registry cross-check on recipient suppliers..."
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-1 focus:ring-cbe-purple"
                    />
                  </div>

                  {/* Item 3: Internal Ledgers */}
                  <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800">Core Banking &amp; General Ledger Audit</span>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-700">
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
                        <span>Verified</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={triageState.internalRecordsFindings || ''}
                      onChange={(e) =>
                        setTriageState((prev) => ({
                          ...prev!,
                          internalRecordsFindings: e.target.value,
                        }))
                      }
                      placeholder="e.g. General Ledger confirms unexplained clearing variance..."
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white focus:ring-1 focus:ring-cbe-purple"
                    />
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTriageStep(2)}
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 2
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

            {/* STEP 4: Assessment Report & Predication */}
            {activeTriageStep === 4 && (
              <div className="space-y-4">
                <PreliminaryAssessmentReportView
                  report={reportState}
                  onChangeReport={handleUpdateReportField}
                  isEditable={isEditable}
                />

                {/* ACTION: ONLY WHEN Predication is Sufficient & Full Investigation chosen, ESCALATE TO PHASE 2 */}
                {isEditable && reportState.predicationDetermination === 'Sufficient' &&
                  reportState.recommendedAction === 'Full Investigation' && (
                    <div className="p-5 rounded-2xl bg-purple-50/90 border-2 border-cbe-purple flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-cbe-purple flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-cbe-gold" />
                          Preliminary Assessment Complete — Predication Established
                        </span>
                        <p className="text-xs text-slate-700">
                          Sufficient grounds found. Ready to formally transition this case into <strong>Phase 2: Full Investigation</strong>.
                        </p>
                        {!canInitiateInvestigation && (
                          <p className="text-xs text-rose-500 font-bold mt-1">
                            Only the President or VP-IA can initiate a Full Investigation. This recommendation must be reviewed by them.
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        disabled={!canInitiateInvestigation}
                        onClick={handleEscalateToFullInvestigation}
                        className={`text-white text-xs font-bold flex items-center gap-2 shrink-0 px-4 py-2.5 shadow-sm ${canInitiateInvestigation
                          ? 'bg-cbe-purple hover:bg-cbe-purple-700'
                          : 'bg-slate-400 cursor-not-allowed'
                          }`}
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
                  {isEditable && (
                    <Button
                      size="sm"
                      onClick={handleSaveTriage}
                      className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Assessment</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )
      }

      {/* ========================================================================= */}
      {/* PHASE 2: FULL INVESTIGATION                                               */}
      {/* (Appears ONLY when escalated from Phase 1, or for active investigation cases) */}
      {/* ========================================================================= */}
      {
        currentPhase === 'full-investigation' && fullInvestigationState && (
          <div className="space-y-4">
          <div className="space-y-4">
            <FullInvestigationWorkspace
              investigation={fullInvestigationState}
              onUpdateInvestigation={setFullInvestigationState}
              onSave={handleSaveFullInvestigation}
              isEditable={isEditable || isSarcSecretary} // SARC Secretary needs to edit Step 5
            />
          </div>
          </div>
        )
      }

      {/* ========================================================================= */}
      {/* Slide-Over Drawer: Whistleblower Original Submission Details              */}
      {/* ========================================================================= */}
      {
        showReportDrawer && (
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
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Reference Number</div>
                  <div className="font-mono font-bold text-sm text-cbe-purple">{caseData.referenceKey}</div>
                  <div className="text-[11px] text-slate-500">
                    Submitted: {new Date(caseData.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Allegation Summary</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">{caseData.summary}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Detailed Statement</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line leading-relaxed">
                    {caseData.detailedNarrative}
                  </p>
                </div>

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

                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Accused Person(s) &amp; Department</span>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <p><strong>Names:</strong> {caseData.corruptedPersonNames}</p>
                    <p><strong>Position:</strong> {caseData.jobPositions}</p>
                    <p><strong>Unit:</strong> {caseData.divisionDepartmentBranch}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Evidence in Possession</span>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">{caseData.evidenceInPossession}</p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Return to Top Floating Button */}
      <div className="fixed bottom-6 right-8 z-30 print:hidden">
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/95 backdrop-blur-xs text-slate-700 hover:text-cbe-purple text-xs font-semibold rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
          title="Scroll back to top"
        >
          <ArrowUp className="w-3.5 h-3.5 text-cbe-purple" />
          <span>Back to Top</span>
        </button>
      </div>
    </div >
  )
}
