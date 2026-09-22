import type { CaseStatusInfo } from '../types/caseTracking.types'

/**
 * Anonymous case lookup using the confidential reference key
 */
export async function getCaseStatusByKey(referenceKey: string): Promise<CaseStatusInfo | null> {
  // In production: const { data } = await apiClient.get<CaseStatusInfo>(`/reports/track/${referenceKey}`)
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (!referenceKey || referenceKey.trim().length < 5) {
    return null
  }

  return {
    referenceKey: referenceKey.toUpperCase(),
    category: 'Financial Misconduct / Accounting Fraud',
    status: 'INVESTIGATION_ACTIVE',
    priority: 'HIGH',
    submittedAt: '2026-09-18T10:14:00Z',
    lastUpdatedAt: '2026-09-21T14:30:00Z',
    assignedInvestigator: 'Special Investigator #04',
    messages: [
      {
        id: 'msg-1',
        sender: 'INVESTIGATOR',
        content:
          'Thank you for your report. The internal audit committee has commenced preliminary review. Could you upload the invoice referenced in paragraph 2?',
        timestamp: '2026-09-19T11:00:00Z',
      },
    ],
  }
}
