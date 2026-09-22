import type { CaseSummary, CaseDetail } from '@/types/common.types'

export type CaseListFilter = {
  status?: string
  priority?: string
  search?: string
}

export type { CaseSummary, CaseDetail }
