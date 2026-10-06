import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { RootState } from '@/store/store'
import { ROUTES } from '@/config/routes'
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
import { PlanningAuthorizationStep } from './full-investigation/PlanningAuthorizationStep'
import { EvidenceForensicsStep } from './full-investigation/EvidenceForensicsStep'
import { InterviewsStep } from './full-investigation/InterviewsStep'
import { ClosureStep } from './full-investigation/ClosureStep'

interface Props {
  investigation: FullInvestigationState
  onUpdateInvestigation: (updated: FullInvestigationState) => void
  onSave: () => void
  isSaving?: boolean
  isEditable?: boolean
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
  isEditable = true,
}) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSelector((state: RootState) => state.auth)
  const isSarcSecretary = user?.roles?.includes('SARC Secretary') || false
  const userRoles = user?.roles || []
  const isVpIa = userRoles.some(r => r.includes('VP') || r.includes('VP-IA') || r.includes('VP–IA'))

  const stepParam = Number(searchParams.get('step'))
  const [activeStep, setActiveStep] = useState<number>(
    stepParam >= 1 && stepParam <= 5 ? stepParam : investigation.currentStep || 1
  )

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

  const handleRemoveExternalInquiry = (id: string) => {
    updateState((prev) => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        covertExternalInquiries: prev.evidence.covertExternalInquiries.filter((inq) => inq.id !== id),
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

  const handleRemoveWitness = (type: 'neutral' | 'key', id: string) => {
    updateState((prev) => ({
      ...prev,
      interviews: {
        ...prev.interviews,
        [type === 'neutral' ? 'neutralWitnesses' : 'keyWitnesses']: prev.interviews[
          type === 'neutral' ? 'neutralWitnesses' : 'keyWitnesses'
        ].filter((w) => w.id !== id),
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

  const handleRemoveSubjectInterview = (id: string) => {
    updateState((prev) => ({
      ...prev,
      interviews: {
        ...prev.interviews,
        subjects: prev.interviews.subjects.filter((s) => s.id !== id),
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

  const handleRemoveDisciplinary = (id: string) => {
    updateState((prev) => ({
      ...prev,
      closure: {
        ...prev.closure,
        disciplinaryActions: prev.closure.disciplinaryActions.filter((d) => d.id !== id),
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

  const handleRemoveSystemicMeasure = (id: string) => {
    updateState((prev) => ({
      ...prev,
      closure: {
        ...prev.closure,
        systemicMeasures: prev.closure.systemicMeasures.filter((m) => m.id !== id),
      },
    }))
  }

  const handleFinalizeCase = () => {
    updateState((prev) => ({
      ...prev,
      closure: {
        ...prev.closure,
        caseClosureFormal: true,
        caseClosedAt: new Date().toISOString(),
      },
    }))
    onSave()
    setTimeout(() => navigate(ROUTES.REPORT_REPOSITORY), 500)
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
        <PlanningAuthorizationStep
          planning={investigation.planning}
          onChangePlanning={(updater) =>
            updateState((prev) => ({ ...prev, planning: updater(prev.planning) }))
          }
          onToggleScope={handleToggleScope}
          isEditable={isEditable}
          isSarcSecretary={isSarcSecretary}
          onProceedNext={() => setActiveStep(2)}
        />
      )}

      {/* Step 2: Evidence & Forensics */}
      {activeStep === 2 && (
        <EvidenceForensicsStep
          evidence={investigation.evidence}
          onChangeEvidence={(updater) =>
            updateState((prev) => ({ ...prev, evidence: updater(prev.evidence) }))
          }
          onAddSeizedRecord={handleAddSeizedRecord}
          onRemoveSeizedRecord={handleRemoveSeizedRecord}
          onAddExternalInquiry={handleAddExternalInquiry}
          onRemoveExternalInquiry={handleRemoveExternalInquiry}
          isEditable={isEditable}
          onBack={() => setActiveStep(1)}
          onNext={() => setActiveStep(3)}
        />
      )}

      {/* Step 3: Witness & Subject Interviews */}
      {activeStep === 3 && (
        <InterviewsStep
          interviews={investigation.interviews}
          onChangeInterviews={(updater) =>
            updateState((prev) => ({ ...prev, interviews: updater(prev.interviews) }))
          }
          onAddWitness={handleAddWitness}
          onRemoveWitness={handleRemoveWitness}
          onAddSubject={handleAddSubjectInterview}
          onRemoveSubject={handleRemoveSubjectInterview}
          isEditable={isEditable}
          onBack={() => setActiveStep(2)}
          onNext={() => setActiveStep(4)}
        />
      )}

      {/* Step 4: Final Investigation Report */}
      {activeStep === 4 && (
        <FinalInvestigationReportView
          report={investigation.report}
          onChangeReport={(field, value) =>
            updateState((prev) => ({
              ...prev,
              report: { ...prev.report, [field]: value },
            }))
          }
          isEditable={isEditable}
        />
      )}

      {/* Step 5: Action & Case Closure */}
      {activeStep === 5 && (
        <ClosureStep
          closure={investigation.closure}
          onChangeClosure={(updater) =>
            updateState((prev) => ({ ...prev, closure: updater(prev.closure) }))
          }
          onAddDisciplinary={handleAddDisciplinary}
          onRemoveDisciplinary={handleRemoveDisciplinary}
          onAddSystemicMeasure={handleAddSystemicMeasure}
          onRemoveSystemicMeasure={handleRemoveSystemicMeasure}
          isEditable={isEditable}
          isSarcSecretary={isSarcSecretary}
          isVpIa={isVpIa}
          onBack={() => setActiveStep(4)}
          onSaveProgress={onSave}
          onFinalizeCase={handleFinalizeCase}
        />
      )}
    </div>
  )
}
