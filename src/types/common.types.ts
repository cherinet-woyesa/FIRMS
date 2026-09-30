import type { CaseStatusId, CasePriorityId } from '@/constants/caseStatus'

export type SystemRole =
  | 'PRESIDENT'
  | 'VP_IA'
  | 'FI_DIRECTOR'
  | 'FI_MANAGER_OPS'
  | 'FI_MANAGER_FOLLOWUP'
  | 'TEAM_LEAD_AUDITOR'
  | 'SARC_SECRETARY'
  | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: SystemRole | 'COMPLIANCE_OFFICER' | 'LEAD_INVESTIGATOR' | 'ADMIN'
  department: string
}

export interface CaseSummary {
  id: string
  referenceKey: string
  category: string
  targetDepartment?: string
  priority: CasePriorityId
  status: CaseStatusId
  submittedAt: string
  updatedAt: string
  isAnonymous: boolean
  assignedTo?: string
}

export interface CaseDetail extends CaseSummary {
  description: string
  evidenceFiles: {
    id: string
    fileName: string
    fileSize: number
    mimeType: string
    uploadedAt: string
  }[]
  timeline: {
    id: string
    timestamp: string
    action: string
    actor: string
    notes?: string
  }[]
}
