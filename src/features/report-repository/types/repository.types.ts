export type ReportSourceType = 'historical-archive' | 'system-finalized'

export type ReportDisposition =
  | 'Substantiated - Criminal Prosecution'
  | 'Substantiated - Internal Recovery / Restitution'
  | 'Substantiated - Administrative Sanction'
  | 'Unsubstantiated / Inconclusive'
  | 'Closed - Full Restitution Paid'

export interface AttachedDossierFile {
  fileName: string
  fileSize: string
  fileType: string
  uploadedAt: string
  fileHash: string
}

export interface HistoricalReportDossier {
  id: string
  docketNumber: string
  title: string
  incidentYear: number
  reportDate: string
  category: string
  sourceType: ReportSourceType
  victimName: string
  accountNumbers: string[]
  branch: string
  district: string
  amountETB: number
  amountUSD?: number
  leadInvestigator: string
  investigatingTeam?: string
  subjectNames: string
  disposition: ReportDisposition
  allegationSummary: string
  factualFindings: string[]
  modusOperandi: string
  correctiveMeasures: string[]
  legalViolations: string
  attachedDossierFile?: AttachedDossierFile
  createdAt: string
  isRestitutionSecured: boolean
  restitutionAmountETB?: number
}

export interface NewHistoricalReportInput {
  docketNumber: string
  title: string
  incidentYear: number
  reportDate: string
  category: string
  victimName: string
  accountNumbers: string
  branch: string
  district: string
  amountETB: string
  amountUSD?: string
  leadInvestigator: string
  investigatingTeam?: string
  subjectNames: string
  disposition: ReportDisposition
  allegationSummary: string
  factualFindings: string
  modusOperandi: string
  correctiveMeasures: string
  legalViolations: string
  fileName?: string
  fileSize?: string
  fileType?: string
}

export interface RepositoryFilterState {
  searchQuery: string
  incidentYear: string // 'all' or '2022' | '2023' | '2024' | '2025' | '2026'
  sourceType: 'all' | ReportSourceType
  category: string // 'all' or category
  district: string // 'all' or district
  disposition: string // 'all' or disposition
  minAmount?: number
  maxAmount?: number
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'docket-asc'
}

export interface RepositoryStats {
  totalReports: number
  totalAmountETB: number
  historicalCount: number
  finalizedCount: number
  restitutionRecoveredETB: number
  oldestYear: number
  newestYear: number
}
