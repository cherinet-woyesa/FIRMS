import type { CaseStatusId, CasePriorityId } from '@/constants/caseStatus'

export interface CaseStatusInfo {
  referenceKey: string
  category: string
  status: CaseStatusId
  priority: CasePriorityId
  submittedAt: string
  lastUpdatedAt: string
  assignedInvestigator?: string
  messages: {
    id: string
    sender: 'INVESTIGATOR' | 'REPORTER'
    content: string
    timestamp: string
  }[]
}
