export interface PlanningAndAuthorization {
  isAuthorized: boolean
  authorizedBy: string
  authorizationDate: string
  approvalScope: string[]
  specificAllegations: string
  investigationTimeframe: string
  targetSubjects: string
  requiredResources: string
  workPlanFinalized: boolean
  workPlanNotes: string
}

export interface SeizedRecordItem {
  id: string
  category: 'Financial' | 'Digital' | 'Procurement' | 'Personnel'
  title: string
  dateSeized: string
  custodyRef: string
  notes?: string
}

export interface ExternalInquiryItem {
  id: string
  inquiryType: 'Public Records' | 'Vendor License (FEACC)' | 'Travel Records' | 'Other'
  details: string
  findings: string
}

export interface EvidenceAndForensics {
  seizedRecords: SeizedRecordItem[]
  forensicAuditEngaged: boolean
  forensicAgency: string
  fundsTracedETB: string
  quantifiedLossesETB: string
  illicitPatternsIdentified: string
  covertExternalInquiries: ExternalInquiryItem[]
}

export interface InterviewRecord {
  id: string
  name: string
  role: string
  date: string
  summary: string
  exhibitsCorroborated: string
}

export interface SubjectInterviewRecord {
  id: string
  name: string
  role: string
  date: string
  legalCounselPresent: boolean
  rightsInformed: boolean
  recordedDefense: string
}

export interface InterviewsWorkflow {
  neutralWitnesses: InterviewRecord[]
  keyWitnesses: InterviewRecord[]
  subjects: SubjectInterviewRecord[]
}

export interface FactualFindingItem {
  id: string
  findingNumber: string
  title: string
  fact: string
  evidence: string
}

export type FindingItem = FactualFindingItem

export interface ExhibitItem {
  id: string
  exhibitLetter: string
  title: string
  description: string
}

export interface FinalInvestigationReport {
  // 1. Executive Summary
  caseId: string
  dateFinalSubmission: string
  allegationSummary: string
  investigativeFinding: 'Substantiated' | 'Not Substantiated' | 'Unfounded'
  estimatedFinancialImpact: string
  recommendation: string

  // 2. Background and Scope
  sourceOfReport: string
  originalAllegationVerbatim: string
  dateInvestigationCommenced: string
  scopeOfInvestigation: string
  investigativeTeam: string

  // 3. Methodology
  documentReview: string
  forensicAnalysis: string
  interviewsConducted: string

  // 4. Factual Findings (Evidence-Based)
  findings: FactualFindingItem[]

  // 5. Conclusion and Determination
  conclusionText: string
  findingDetermination: 'Substantiated' | 'Not Substantiated' | 'Unfounded'
  policyLawViolated: string

  // 6. Recommendations
  disciplinaryLegalActions: string[]
  systemicPreventativeMeasures: string[]

  // 7. Exhibits (Appendices)
  exhibits: ExhibitItem[]

  // 8. Sign-Off
  investigatorSignature: string
  signatureDate: string
  reviewedAndApprovedBy: string
  approvalDate: string
  approvalStatus: 'Approved' | 'Pending Review' | 'Revision Requested'
}

export interface DisciplinaryActionItem {
  id: string
  actionType: string
  targetSubject: string
  authority: string
  status: 'Pending' | 'Executed' | 'Under Appeal'
}

export interface SystemicMeasureItem {
  id: string
  policyTitle: string
  responsibleUnit: string
  status: 'In Progress' | 'Implemented'
}

export interface ResolutionAndClosure {
  disciplinaryActions: DisciplinaryActionItem[]
  systemicMeasures: SystemicMeasureItem[]
  whistleblowerFeedbackProvided: boolean
  whistleblowerFeedbackDate?: string
  whistleblowerFeedbackNotes?: string
  antiRetaliationActive: boolean
  antiRetaliationNotes?: string
  caseClosureFormal: boolean
  caseClosedAt?: string
  programReviewNotes?: string
}

export interface FullInvestigationState {
  currentStep: number // 1 to 5
  planning: PlanningAndAuthorization
  evidence: EvidenceAndForensics
  interviews: InterviewsWorkflow
  report: FinalInvestigationReport
  closure: ResolutionAndClosure
}
