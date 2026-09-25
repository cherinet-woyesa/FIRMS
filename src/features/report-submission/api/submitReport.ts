import type { CorruptionReportInput, ReportSubmissionResult } from '../types/report.types'
import { addSubmittedCaseToStorage } from '../../case-management/api/getCases'
import type { CaseDetailedInvestigation } from '../../case-management/api/getCases'
import type { PreliminaryAssessmentReport, TriageWorkflowState } from '../../case-management/types/triage.types'


/**
 * Submit encrypted corruption report to the ethics & compliance oversight system
 */
export async function submitWhistleblowerReport(
  payload: CorruptionReportInput
): Promise<ReportSubmissionResult> {
  // Simulate cryptographic encryption delay and network submission
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const randomRef = `CBE-ETH-${Math.floor(100000 + Math.random() * 900000)}`
  const newId = `case-${Date.now()}`

  // 1. Build the detailed case from payload
  const newDetailedCase: CaseDetailedInvestigation = {
    id: newId,
    referenceKey: randomRef,
    category: payload.corruptionType || payload.category || 'Bribery, Kickbacks & Corruption',
    targetDepartment: payload.targetDepartment || payload.divisionDepartmentBranch || 'Unknown',
    priority: 'HIGH', // default priority for new submissions
    status: 'UNDER_REVIEW', // initial status
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isAnonymous: payload.isAnonymous || payload.reportingMode === 'anonymous',
    reportingMode: payload.reportingMode || (payload.isAnonymous ? 'anonymous' : 'confidential'),
    relationship: payload.relationship || 'Whistleblower',
    fullName: payload.fullName,
    contactEmail: payload.contactEmail || payload.email,
    phoneNumber: payload.phoneNumber,
    physicalAddress: payload.physicalAddress,
    summary: payload.summary || payload.description || 'No summary provided',
    detailedNarrative: payload.detailedNarrative || 'No detailed narrative',
    incidentDate: payload.incidentDate || 'Unknown',
    incidentLocation: payload.incidentLocation || 'Unknown',
    howAware: payload.howAware || 'Unknown',
    whyCorrupt: payload.whyCorrupt || 'Unknown',
    divisionDepartmentBranch: payload.divisionDepartmentBranch || 'Unknown',
    departmentOffice: payload.departmentOffice,
    organizationAddress: payload.organizationAddress,
    corruptedPersonNames: payload.corruptedPersonNames || 'Unknown',
    jobPositions: payload.jobPositions || 'Unknown',
    otherIdentifyingInfo: payload.otherIdentifyingInfo,
    evidenceInPossession: payload.evidenceInPossession || 'None',
    evidenceNotInPossession: payload.evidenceNotInPossession,
    witnesses: payload.witnesses,
    attachedFiles: payload.attachedFiles,
    priorReports: payload.priorReports || 'None',
    resolutionSought: payload.resolutionSought || 'Investigation',
    reportRecipient: payload.reportRecipient || 'Risk Management & Compliance Division',
    
    // Default empty triage that the officer will fill out
    triageWorkflow: {
      isAcknowledged: false,
      legalHoldInitiated: false,
      orgChartReviewed: false,
      osintReviewed: false,
      internalRecordsReviewed: false,
    } as TriageWorkflowState,
    preliminaryAssessmentReport: {
      caseId: randomRef,
      dateReportReceipt: new Date().toISOString().split('T')[0],
      sourceReportingChannel: 'FIRMS Whistleblower Portal',
      allegedSubjects: payload.corruptedPersonNames || 'Unknown',
      allegedOrganizationUnit: payload.divisionDepartmentBranch || 'Unknown',
      typeOfMisconduct: payload.corruptionType || 'Unknown',
      allegedPeriodOfIncident: payload.incidentDate || 'Unknown',
      allegationSummary: payload.summary || 'Unknown',
    } as PreliminaryAssessmentReport,
  }

  // 2. Persist to storage
  addSubmittedCaseToStorage(newDetailedCase)

  return {
    caseReferenceKey: randomRef,
    submittedAt: new Date().toISOString(),
    category: payload.corruptionType || payload.category || 'Bribery, Kickbacks & Corruption',
    trackingUrl: `/track?case=${randomRef}`,
    reportingMode: payload.reportingMode || (payload.isAnonymous ? 'anonymous' : 'confidential'),
    divisionDepartmentBranch: payload.divisionDepartmentBranch || payload.targetDepartment,
    reportRecipient: payload.reportRecipient || 'Risk Management & Compliance Division',
  }
}
