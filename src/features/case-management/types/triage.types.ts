export interface TriageWorkflowState {
  // Step 1: Secure and Acknowledge
  isAcknowledged: boolean
  acknowledgedAt?: string
  legalHoldInitiated: boolean
  legalHoldNoticeRef?: string
  legalHoldAt?: string
  investigatorAssigned?: string
  investigatorDepartment?: string
  noConflictSigned: boolean

  // Step 2: Initial Review & Triage
  isWithinJurisdiction: boolean
  jurisdictionNotes?: string
  referralAuthority?: string
  specificityRating: 'High' | 'Medium' | 'Low'
  corroborationRating: 'High' | 'Medium' | 'Low'
  severityRating: 'High' | 'Medium' | 'Low'

  // Step 3: Initial Fact-Checking (Covert)
  orgChartReviewed: boolean
  orgChartFindings?: string
  osintReviewed: boolean
  osintFindings?: string
  internalRecordsReviewed: boolean
  internalRecordsFindings?: string

  // Step 4: Decision & Predication
  predicationDetermination: 'Sufficient' | 'Insufficient'
  recommendedAction: 'Full Investigation' | 'Referral' | 'Case Closure'
  recommendedActionJustification?: string
  referralTarget?: string
  nextStepsInterimMeasures?: string
}

export interface PreliminaryAssessmentReport {
  // 1. Case Information
  caseId: string
  dateReportReceipt: string
  investigatorTeamAssigned: string
  dateAssessmentCompletion: string
  sourceReportingChannel: string

  // 2. Allegation Details
  allegedSubjects: string
  allegedOrganizationUnit: string
  typeOfMisconduct: string
  allegedPeriodOfIncident: string
  allegationSummary: string
  applicableLawPolicy: string

  // 3. Initial Assessment & Findings
  specificityAndDetail: string
  evidenceProvided: string
  initialReviewFindings: string
  credibilityAssessment: string
  severityAssessment: string

  // 4. Conclusion and Recommendation
  predicationDetermination: 'Sufficient' | 'Insufficient'
  recommendedAction: 'Full Investigation' | 'Referral' | 'Case Closure'
  recommendedActionJustification: string
  referralTarget?: string
  nextStepsInterimMeasures: string
}
