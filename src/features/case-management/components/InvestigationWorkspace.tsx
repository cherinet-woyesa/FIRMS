import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowUp,
  Save,
  Check,
  FileText,
  GitBranch,
  Zap,
} from 'lucide-react'
import { fetchCaseById, fetchCaseAssessment, updateCaseTriage, updateCaseFullInvestigation, handoverCase } from '../api/getCases'
import { getAvailableWorkflowActions, executeWorkflowTransition } from '../api/workflowExecutionApi'
import { FullInvestigationWorkspace } from './FullInvestigationWorkspace'
import { TriageStep1Secure } from './triage/TriageStep1Secure'
import { TriageStep2Review } from './triage/TriageStep2Review'
import { TriageStep3FactCheck } from './triage/TriageStep3FactCheck'
import { TriageStep4Assessment } from './triage/TriageStep4Assessment'
import { WhistleblowerDetailsDrawer } from './triage/WhistleblowerDetailsDrawer'
import type { PreliminaryAssessmentReport, TriageWorkflowState } from '../types/triage.types'
import type { FullInvestigationState } from '../types/investigation.types'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'
import { ROUTES } from '@/config/routes'

export const InvestigationWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const caseId = id || 'case-02'

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case-detail', caseId],
    queryFn: () => fetchCaseById(caseId),
  })

  const { data: assessmentData } = useQuery({
    queryKey: ['case-assessment', caseId],
    queryFn: () => fetchCaseAssessment(caseId),
    enabled: !!caseId,
  })

  const { data: availableActions = [], refetch: refetchActions } = useQuery({
    queryKey: ['case-workflow-actions', caseId],
    queryFn: () => getAvailableWorkflowActions(caseId),
    enabled: !!caseId,
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
  const initialPhaseParam = searchParams.get('phase')
  const [currentPhase, setCurrentPhase] = useState<'triage' | 'full-investigation'>(
    initialPhaseParam === 'full-investigation' ? 'full-investigation' : 'triage'
  )

  // Managers start at step 1. Investigators start at step 2.
  const [activeTriageStep, setActiveTriageStep] = useState<number>(isManager && !isInvestigator ? 1 : 2)

  const [triageState, setTriageState] = useState<TriageWorkflowState | null>(null)
  const [reportState, setReportState] = useState<PreliminaryAssessmentReport | null>(null)
  const [fullInvestigationState, setFullInvestigationState] = useState<FullInvestigationState | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showReportDrawer, setShowReportDrawer] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleExecuteTransition = async (
    actionCode: string,
    comment?: string,
    onSuccess?: () => void
  ) => {
    setIsTransitioning(true)
    try {
      const res = await executeWorkflowTransition(caseId, {
        actionCode,
        comment: comment || `Action ${actionCode} executed from workspace.`,
        assignedUserId: user?.userId,
      })

      if (res.success) {
        toast.success(res.actionName ? `${res.actionName} executed successfully.` : 'Workflow updated.')
        await refetchActions()
        if (onSuccess) onSuccess()
      } else {
        if (res.error) {
          toast.error(res.error)
        }
        // Still allow step progression in the UI
        if (onSuccess) onSuccess()
      }
    } catch (err: any) {
      toast.error(err?.message || 'Workflow transition failed.')
      if (onSuccess) onSuccess()
    } finally {
      setIsTransitioning(false)
    }
  }

  useEffect(() => {
    if (caseData) {
      setTriageState(caseData.triageWorkflow || {
        isAcknowledged: false,
        legalHoldInitiated: false,
        noConflictSigned: false,
        isWithinJurisdiction: false,
        specificityRating: (assessmentData?.specificityRating as any) || 'Medium',
        corroborationRating: 'Medium',
        severityRating: assessmentData?.severityAssessment?.includes('High')
          ? 'High'
          : assessmentData?.severityAssessment?.includes('Low')
          ? 'Low'
          : 'Medium',
        orgChartReviewed: false,
        osintReviewed: false,
        internalRecordsReviewed: false,
        predicationDetermination: (assessmentData?.predicationDetermination as any) || 'Insufficient',
        recommendedAction: (assessmentData?.recommendedAction as any) || 'Full Investigation',
      })

      setReportState(caseData.preliminaryAssessmentReport || {
        caseId: caseData.referenceKey,
        dateReportReceipt: caseData.submittedAt,
        investigatorTeamAssigned: assessmentData?.assignedInvestigatorName || '',
        dateAssessmentCompletion: assessmentData?.dateOfAssessmentCompletion || '',
        sourceReportingChannel: caseData.reportingMode || '',
        allegedSubjects: '',
        allegedOrganizationUnit: caseData.targetDepartment || '',
        typeOfMisconduct: caseData.category || '',
        allegedPeriodOfIncident: '',
        allegationSummary: caseData.summary,
        applicableLawPolicy: '',
        specificityAndDetail: assessmentData?.specificityRating || '',
        evidenceProvided: assessmentData?.evidenceProvidedSummary || '',
        initialReviewFindings: assessmentData?.initialReviewFindings || '',
        credibilityAssessment: assessmentData?.credibilityAssessment || '',
        severityAssessment: assessmentData?.severityAssessment || '',
        predicationDetermination: (assessmentData?.predicationDetermination as any) || 'Insufficient',
        recommendedAction: (assessmentData?.recommendedAction as any) || 'Full Investigation',
        recommendedActionJustification: assessmentData?.recommendedActionJustification || '',
        nextStepsInterimMeasures: assessmentData?.nextSteps || '',
      })

      if (caseData.fullInvestigation) {
        setFullInvestigationState(caseData.fullInvestigation)
      } else {
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
            workPlanNotes: '',
          },
          evidence: {
            seizedRecords: [],
            forensicAuditEngaged: false,
            forensicAgency: '',
            fundsTracedETB: '',
            quantifiedLossesETB: '',
            illicitPatternsIdentified: '',
            covertExternalInquiries: [],
          },
          interviews: {
            neutralWitnesses: [],
            keyWitnesses: [],
            subjects: [],
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
            approvalStatus: 'Pending Review',
          },
          closure: {
            disciplinaryActions: [],
            systemicMeasures: [],
            whistleblowerFeedbackProvided: false,
            antiRetaliationActive: false,
            caseClosureFormal: false,
          },
        })
      }

      if (searchParams.get('phase') === 'full-investigation') {
        setCurrentPhase('full-investigation')
      } else if (
        caseData.status === 'INVESTIGATION_ACTIVE' ||
        caseData.status === 'RESOLVED' ||
        caseData.status?.toUpperCase().includes('INVESTIGATION')
      ) {
        setCurrentPhase('full-investigation')
      } else if (searchParams.get('phase') === 'triage') {
        setCurrentPhase('triage')
      }
    }
  }, [caseData, searchParams])

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
    await handoverCase(caseId)
    await handleExecuteTransition('START_TRIAGE', 'Handed over to investigation team.')
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
      {/* 1. Unified Slimline Command Bar (Matching Figma Design System) */}
      <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Left: Back button + Case Reference + Status Badges */}
        <div className="flex items-center gap-2.5">
          <Link
            to={ROUTES.CASES}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition"
            title="Back to Cases"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-slate-900 tracking-tight">
              {caseData.referenceKey}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {caseData.status === 'INVESTIGATION_ACTIVE' ? 'Resolved' : caseData.status}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {caseData.priority}
            </span>
          </div>
        </div>

        {/* Center: Compact Segmented Phase Switcher */}
        <div className="flex items-center p-0.5 bg-slate-100/90 rounded-lg border border-slate-200/70 self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setCurrentPhase('triage')
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                next.set('phase', 'triage')
                return next
              })
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              currentPhase === 'triage'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Phase 1: Triage
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPhase('full-investigation')
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                next.set('phase', 'full-investigation')
                return next
              })
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              currentPhase === 'full-investigation'
                ? 'bg-cbe-purple text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Phase 2: Full Investigation</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                currentPhase === 'full-investigation'
                  ? 'bg-white/25 text-white'
                  : 'bg-purple-100 text-cbe-purple'
              }`}
            >
              Report
            </span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mr-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.CASE_INTAKE_DETAILS(caseId))}
            className="text-xs h-8 px-2.5 flex items-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
            title="View original whistleblower intake"
          >
            <FileText className="w-3.5 h-3.5 text-cbe-purple" />
            <span>Details</span>
          </Button>

          {isEditable && (
            <Button
              size="sm"
              onClick={currentPhase === 'triage' ? handleSaveTriage : handleSaveFullInvestigation}
              className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs h-8 px-3 flex items-center gap-1.5 shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Backend Workflow Transitions Bar */}
      {availableActions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50/80 via-white to-amber-50/60 border border-purple-200/80 rounded-2xl p-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cbe-purple text-white flex items-center justify-center shrink-0">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Current Stage: {availableActions[0]?.fromStageName || caseData.status}
                </span>
                <span className="text-[10px] font-semibold text-cbe-purple bg-purple-100/70 px-2 py-0.5 rounded-full">
                  {availableActions.length} {availableActions.length === 1 ? 'Action' : 'Actions'} Available
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Backend workflow state transitions permitted for your role:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {availableActions.map((action) => (
              <Button
                key={action.transitionId || action.actionCode}
                size="sm"
                disabled={isTransitioning}
                onClick={() =>
                  handleExecuteTransition(
                    action.actionCode,
                    `Transition ${action.actionName} initiated by ${user?.userName || 'auditor'}.`
                  )
                }
                className="text-xs h-7 px-3 bg-white hover:bg-cbe-purple hover:text-white text-slate-800 border border-slate-300 font-semibold shadow-2xs transition cursor-pointer"
                title={action.description || action.actionName}
              >
                <Zap className="w-3 h-3 text-cbe-gold shrink-0 mr-1" />
                <span>{action.actionName}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 1: TRIAGE WORKFLOW */}
      {currentPhase === 'triage' && (
        <div className="space-y-4">
          {/* STEP 1: Secure and Acknowledge */}
          {activeTriageStep === 1 && (
            <TriageStep1Secure
              triageState={triageState}
              onChangeTriage={(updater) => setTriageState((prev) => (prev ? updater(prev) : prev))}
              onUpdateReportField={handleUpdateReportField}
              isPresident={isPresident}
              isVpIa={isVpIa}
              isFiDirector={isFiDirector}
              isManager={isManager}
              isInvestigator={isInvestigator}
              isEditable={isEditable}
              onHandover={handleHandover}
              onNext={() =>
                handleExecuteTransition('START_TRIAGE', 'Triage commenced.', () => setActiveTriageStep(2))
              }
            />
          )}

          {/* STEP 2: Initial Review & Triage */}
          {activeTriageStep === 2 && (
            <TriageStep2Review
              triageState={triageState}
              onChangeTriage={(updater) => setTriageState((prev) => (prev ? updater(prev) : prev))}
              onUpdateReportField={handleUpdateReportField}
              onNext={() =>
                handleExecuteTransition(
                  'PROCEED_FACT_CHECKING',
                  'Proceeding to initial fact-checking.',
                  () => setActiveTriageStep(3)
                )
              }
            />
          )}

          {/* STEP 3: Covert Fact-Checking */}
          {activeTriageStep === 3 && (
            <TriageStep3FactCheck
              triageState={triageState}
              onChangeTriage={(updater) => setTriageState((prev) => (prev ? updater(prev) : prev))}
              onUpdateReportField={handleUpdateReportField}
              onPrev={() => setActiveTriageStep(2)}
              onNext={() =>
                handleExecuteTransition(
                  'SUBMIT_PREDICATION',
                  'Preliminary fact checking submitted for predication decision.',
                  () => setActiveTriageStep(4)
                )
              }
            />
          )}

          {/* STEP 4: Assessment Report & Predication */}
          {activeTriageStep === 4 && (
            <TriageStep4Assessment
              reportState={reportState}
              onUpdateReportField={handleUpdateReportField}
              isEditable={isEditable}
              canInitiateInvestigation={canInitiateInvestigation}
              isInvestigator={isInvestigator}
              onEscalateToFullInvestigation={() =>
                handleExecuteTransition(
                  'FULL_INVESTIGATION',
                  reportState.recommendedActionJustification || 'Predication sufficient. Escalating to Full Investigation.',
                  () => handleEscalateToFullInvestigation()
                )
              }
              onSaveTriage={handleSaveTriage}
              onSendToManager={async () => {
                await handleSaveTriage()
                await handleExecuteTransition(
                  'SUBMIT_PREDICATION',
                  'Assessment report sent to Manager for review.',
                  () => navigate(ROUTES.CASES)
                )
              }}
              onPrev={() => setActiveTriageStep(3)}
            />
          )}
        </div>
      )}

      {/* PHASE 2: FULL INVESTIGATION */}
      {currentPhase === 'full-investigation' && fullInvestigationState && (
        <div className="space-y-4">
          <FullInvestigationWorkspace
            caseId={caseId}
            investigation={fullInvestigationState}
            onUpdateInvestigation={setFullInvestigationState}
            onSave={handleSaveFullInvestigation}
            isEditable={isEditable || isSarcSecretary}
          />
        </div>
      )}

      {/* Slide-Over Drawer: Whistleblower Original Submission Details */}
      <WhistleblowerDetailsDrawer
        isOpen={showReportDrawer}
        onClose={() => setShowReportDrawer(false)}
        caseData={caseData}
      />

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
    </div>
  )
}
