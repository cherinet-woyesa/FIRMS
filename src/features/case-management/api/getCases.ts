import type { CaseSummary } from '@/types/common.types'

const MOCK_REGISTRY_CASES: CaseSummary[] = [
  {
    id: 'case-01',
    referenceKey: 'WB-892144',
    category: 'Financial Misconduct / Accounting Fraud',
    targetDepartment: 'Finance & Accounts',
    priority: 'CRITICAL',
    status: 'INVESTIGATION_ACTIVE',
    submittedAt: '2026-09-20T08:30:00Z',
    updatedAt: '2026-09-21T15:10:00Z',
    isAnonymous: true,
    assignedTo: 'Lead Investigator Sarah V.',
  },
  {
    id: 'case-02',
    referenceKey: 'WB-734120',
    category: 'Bribery, Kickbacks & Corruption',
    targetDepartment: 'Procurement',
    priority: 'HIGH',
    status: 'UNDER_REVIEW',
    submittedAt: '2026-09-19T14:15:00Z',
    updatedAt: '2026-09-19T14:15:00Z',
    isAnonymous: true,
    assignedTo: 'Unassigned',
  },
  {
    id: 'case-03',
    referenceKey: 'WB-619042',
    category: 'Health, Safety & Environmental Violations',
    targetDepartment: 'Factory Operations',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    submittedAt: '2026-09-15T11:20:00Z',
    updatedAt: '2026-09-18T16:00:00Z',
    isAnonymous: false,
    assignedTo: 'Officer Michael K.',
  },
  {
    id: 'case-04',
    referenceKey: 'WB-441908',
    category: 'Data Leakage & Intellectual Property Theft',
    targetDepartment: 'Engineering R&D',
    priority: 'CRITICAL',
    status: 'SUBMITTED',
    submittedAt: '2026-09-22T06:45:00Z',
    updatedAt: '2026-09-22T06:45:00Z',
    isAnonymous: true,
    assignedTo: 'Unassigned',
  },
]

export async function fetchCaseRegistry(): Promise<CaseSummary[]> {
  // In production: const { data } = await apiClient.get<CaseSummary[]>('/officer/cases')
  await new Promise((resolve) => setTimeout(resolve, 400))
  return MOCK_REGISTRY_CASES
}
