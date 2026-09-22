import type { CaseStatusId, CasePriorityId } from '@/constants/caseStatus'

export interface User {
  id: string
  name: string
  email: string
  role: 'COMPLIANCE_OFFICER' | 'LEAD_INVESTIGATOR' | 'ADMIN'
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
