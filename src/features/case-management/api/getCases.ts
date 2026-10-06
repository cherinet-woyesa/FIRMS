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
    const response = await apiClient.get<{ success: boolean; data: CaseSummary[] }>('/api/Cases')
    if (response.data.success) {
      return response.data.data
    }
    return []
  } catch (error) {
    console.error('Error fetching cases from backend:', error)
    return []
  }
}

export async function fetchCaseById(id: string): Promise<CaseDetailedInvestigation | null> {
  try {
    const response = await apiClient.get<{ success: boolean; data: CaseDetailedInvestigation }>(`/api/Cases/${id}`)
    if (response.data.success) {
      return response.data.data
    }
    return null
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

export async function updateCaseTriage(
  _id: string,
  _triageWorkflow: TriageWorkflowState,
  _report: PreliminaryAssessmentReport
): Promise<boolean> {
  // TODO: Create a PUT /api/Cases/{id}/triage endpoint in the backend.
  console.warn('Backend updateCaseTriage is not yet fully implemented.')
  return true
}

export async function updateCaseFullInvestigation(
  _id: string,
  _fullInvestigation: FullInvestigationState
): Promise<boolean> {
  // TODO: Create a PUT /api/Cases/{id}/investigation endpoint in the backend.
  console.warn('Backend updateCaseFullInvestigation is not yet fully implemented.')
  return true
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
