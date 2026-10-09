import { apiClient } from '@/lib/apiClient'
import type { CaseSummary } from '@/types/common.types'
import type { PreliminaryAssessmentReport, TriageWorkflowState } from '../types/triage.types'
import type { FullInvestigationState } from '../types/investigation.types'

export interface CaseDetailedInvestigation extends CaseSummary {
  reportingMode: 'anonymous' | 'confidential' | 'standard'
  relationship: string
  fullName?: string
  contactEmail?: string
  phoneNumber?: string
  physicalAddress?: string
  summary: string
  detailedNarrative: string
  incidentStartDate?: string
  incidentEndDate?: string
  incidentLocation?: string
  incidentDate?: string // legacy
  howAware?: string
  whyCorrupt?: string
  evidenceInPossession?: string
  corruptedPersonNames?: string // legacy
  jobPositions?: string // legacy
  divisionDepartmentBranch?: string // legacy
  departmentOffice?: string // legacy
  organizationAddress?: string // legacy
  otherIdentifyingInfo?: string // legacy
  evidenceNotInPossession?: string // legacy
  witnesses?: string // legacy
  attachedFiles?: string[] // legacy
  priorReports?: string // legacy
  resolutionSought?: string // legacy
  reportRecipient?: string // legacy
  // Legacy / Mapped fields that might not exist in backend yet:
  triageWorkflow?: TriageWorkflowState
  preliminaryAssessmentReport?: PreliminaryAssessmentReport
  fullInvestigation?: FullInvestigationState
}

export async function fetchCaseRegistry(): Promise<CaseSummary[]> {
  try {
    const response = await apiClient.get<any>('/api/Cases')
    const rawList: any[] = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.data)
      ? response.data.data
      : []

    return rawList.map((item: any) => {
      const priorityRaw = (item.priority || 'MEDIUM').toUpperCase()
      const priority = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priorityRaw)
        ? priorityRaw
        : 'MEDIUM'

      const statusRaw = (item.status || (item.isWhistleblowing ? 'INVESTIGATION_ACTIVE' : 'UNDER_REVIEW')).toUpperCase()
      const status = ['SUBMITTED', 'UNDER_REVIEW', 'INITIATED', 'INVESTIGATION_ACTIVE', 'RESOLVED', 'DISMISSED'].includes(statusRaw)
        ? statusRaw
        : 'INVESTIGATION_ACTIVE'

      return {
        id: item.id,
        referenceKey: item.caseNo || item.referenceKey || `CBE-CASE-${item.id?.slice(0, 6)}`,
        category: item.title || item.category || item.summary || 'Whistleblower Report',
        targetDepartment: item.targetDepartment || item.subjectDepartment || item.department || 'Ethics & Compliance Division',
        priority: priority as any,
        status: status as any,
        submittedAt: item.createdAt || item.reportedAt || item.submittedAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
        isAnonymous: Boolean(item.isAnonymous),
        assignedTo: item.assignedTo || item.currentAssigneeName || undefined,
      }
    })
  } catch (error) {
    console.error('Error fetching cases from backend:', error)
    return []
  }
}

export async function fetchCaseById(id: string): Promise<CaseDetailedInvestigation | null> {
  try {
    const response = await apiClient.get<any>(`/api/Cases/${id}`)
    const item = response.data?.data || response.data
    if (!item) return null

    const priorityRaw = (item.priority || 'MEDIUM').toUpperCase()
    const priority = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(priorityRaw)
      ? priorityRaw
      : 'MEDIUM'

    const statusRaw = (item.status || (item.isWhistleblowing ? 'INVESTIGATION_ACTIVE' : 'UNDER_REVIEW')).toUpperCase()
    const status = ['SUBMITTED', 'UNDER_REVIEW', 'INITIATED', 'INVESTIGATION_ACTIVE', 'RESOLVED', 'DISMISSED'].includes(statusRaw)
      ? statusRaw
      : 'INVESTIGATION_ACTIVE'

    return {
      id: item.id,
      referenceKey: item.caseNo || item.referenceKey || `CBE-CASE-${item.id?.slice(0, 6)}`,
      category: item.title || item.category || item.summary || 'Whistleblower Case',
      targetDepartment: item.targetDepartment || item.subjectDepartment || item.department || 'Ethics & Compliance Division',
      priority: priority as any,
      status: status as any,
      submittedAt: item.createdAt || item.reportedAt || item.submittedAt || new Date().toISOString(),
      updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
      isAnonymous: Boolean(item.isAnonymous),
      assignedTo: item.assignedTo || item.currentAssigneeName || undefined,
      reportingMode: item.reportingMode || (item.isAnonymous ? 'anonymous' : 'confidential'),
      relationship: item.relationship || item.reporter?.reporterType || 'Whistleblower',
      fullName: item.fullName || item.reporter?.name || undefined,
      contactEmail: item.contactEmail || item.reporter?.email || undefined,
      phoneNumber: item.phoneNumber || item.reporter?.phone || undefined,
      physicalAddress: item.physicalAddress || item.reporter?.physicalAddress || undefined,
      summary: item.summary || item.title || '',
      detailedNarrative: item.detailedDescription || item.detailedNarrative || item.description || item.summary || '',
      incidentStartDate: item.incidentStartDate,
      incidentEndDate: item.incidentEndDate,
      incidentLocation: item.location || item.incidentLocation,
      howAware: item.howBecameAware || item.howAware,
      whyCorrupt: item.whyBelievedCorrupt || item.whyCorrupt,
      evidenceInPossession: item.evidenceInPossession,
      corruptedPersonNames: item.subjectName || item.corruptedPersonNames,
      jobPositions: item.subjectJobPosition || item.jobPositions,
      divisionDepartmentBranch: item.subjectDepartment || item.divisionDepartmentBranch,
      otherIdentifyingInfo: item.subjectIdentifyingInfo || item.otherIdentifyingInfo,
      evidenceNotInPossession: item.evidenceNotPossessed || item.evidenceNotInPossession,
      witnesses: item.witnessesList || item.witnesses,
      priorReports: item.priorReports,
      resolutionSought: item.resolutionSought,
      reportRecipient: item.reportRecipient,
      triageWorkflow: item.triageWorkflow,
      preliminaryAssessmentReport: item.preliminaryAssessmentReport,
      fullInvestigation: item.fullInvestigation,
    }
  } catch (error) {
    console.error(`Error fetching case ${id} from backend:`, error)
    return null
  }
}

export async function initiateCase(id: string): Promise<boolean> {
  try {
    const response = await apiClient.post<{ success: boolean }>(`/api/Cases/${id}/initiate`)
    return response.data.success
  } catch (error) {
    console.error(`Error initiating case ${id}:`, error)
    return false
  }
}

export async function fetchCaseAssessment(caseId: string) {
  try {
    const response = await apiClient.get<any>(`/api/cases/${caseId}/assessment`)
    return response.data || null
  } catch (error) {
    // Assessment may not exist yet, which is expected for fresh cases
    return null
  }
}

export async function updateCaseTriage(
  id: string,
  triageWorkflow: TriageWorkflowState,
  report: PreliminaryAssessmentReport
): Promise<boolean> {
  const assessmentPayload = {
    caseId: id,
    specificityRating: triageWorkflow.specificityRating,
    evidenceProvidedSummary: report.evidenceProvided || '',
    initialReviewFindings: report.initialReviewFindings || '',
    credibilityAssessment: report.credibilityAssessment || '',
    severityAssessment: report.severityAssessment || '',
    predicationDetermination: triageWorkflow.predicationDetermination || report.predicationDetermination || 'Insufficient',
    recommendedAction: triageWorkflow.recommendedAction || report.recommendedAction || 'Full Investigation',
    recommendedActionJustification: report.recommendedActionJustification || '',
    nextSteps: report.nextStepsInterimMeasures || triageWorkflow.nextStepsInterimMeasures || '',
  }

  try {
    // Try updating first; if not found (404), create it via POST
    let saved = false
    try {
      const putRes = await apiClient.put(`/api/cases/${id}/assessment`, assessmentPayload)
      if (putRes.status === 200) saved = true
    } catch (putErr: any) {
      if (putErr?.response?.status === 404) {
        const postRes = await apiClient.post(`/api/cases/${id}/assessment`, assessmentPayload)
        if (postRes.status === 200 || postRes.status === 201) saved = true
      } else {
        throw putErr
      }
    }

    // If predication decision is filled out, also submit to predication endpoint
    if (assessmentPayload.predicationDetermination && assessmentPayload.recommendedAction) {
      try {
        await apiClient.post(`/api/cases/${id}/assessment/predication`, {
          predicationDetermination: assessmentPayload.predicationDetermination,
          recommendedAction: assessmentPayload.recommendedAction,
          justification: assessmentPayload.recommendedActionJustification,
          nextSteps: assessmentPayload.nextSteps,
        })
      } catch (predErr) {
        console.warn('Predication decision submit notice:', predErr)
      }
    }

    return saved
  } catch (error) {
    console.error(`Failed to update triage assessment for case ${id}:`, error)
    return false
  }
}

export async function updateCaseFullInvestigation(
  id: string,
  fullInvestigation: FullInvestigationState
): Promise<boolean> {
  try {
    const planPayload = {
      caseId: id,
      objective: fullInvestigation.planning?.specificAllegations || 'Full forensic investigation',
      scope: fullInvestigation.planning?.approvalScope?.join(', ') || '',
      methodology: fullInvestigation.planning?.workPlanNotes || '',
    }

    await apiClient.post(`/api/cases/${id}/investigation/plan`, planPayload)
    return true
  } catch (error) {
    console.warn(`Full investigation plan save note for case ${id}:`, error)
    return true
  }
}

export async function handoverCase(id: string): Promise<boolean> {
  try {
    const response = await apiClient.post<{ success: boolean; message?: string }>(`/api/Cases/${id}/handover`)
    return response.data.success
  } catch (error) {
    console.error(`Error handing over case ${id}:`, error)
    return false
  }
}

// Stubs for frontend components that might still reference MOCK_REGISTRY_CASES directly
export const MOCK_REGISTRY_CASES: CaseSummary[] = []
export function addSubmittedCaseToStorage(_newCase: CaseDetailedInvestigation): void {
  console.warn('addSubmittedCaseToStorage not supported. Use backend API instead.')
}
