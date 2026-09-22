export const CASE_STATUSES = {
  SUBMITTED: {
    id: 'SUBMITTED',
    label: 'Submitted',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  UNDER_REVIEW: {
    id: 'UNDER_REVIEW',
    label: 'Under Review',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  INVESTIGATION_ACTIVE: {
    id: 'INVESTIGATION_ACTIVE',
    label: 'Investigation Active',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  RESOLVED: {
    id: 'RESOLVED',
    label: 'Resolved',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  DISMISSED: {
    id: 'DISMISSED',
    label: 'Closed / Dismissed',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
  },
} as const

export const CASE_PRIORITIES = {
  LOW: { id: 'LOW', label: 'Low', color: 'bg-slate-100 text-slate-700' },
  MEDIUM: { id: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  HIGH: { id: 'HIGH', label: 'High', color: 'bg-amber-100 text-amber-800' },
  CRITICAL: { id: 'CRITICAL', label: 'Critical', color: 'bg-rose-100 text-rose-800' },
} as const

export type CaseStatusId = keyof typeof CASE_STATUSES
export type CasePriorityId = keyof typeof CASE_PRIORITIES
