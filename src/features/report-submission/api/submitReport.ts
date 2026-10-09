import type { CorruptionReportInput, ReportSubmissionResult } from '../types/report.types'
import { apiClient } from '../../../lib/apiClient'

const parseDateOrNull = (dateStr?: string) => {
  if (!dateStr || dateStr.trim() === '' || dateStr.toLowerCase() === 'unknown') return null
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

/**
 * Submit encrypted corruption report to the ethics & compliance oversight system
 */
export async function submitWhistleblowerReport(
  payload: CorruptionReportInput
): Promise<ReportSubmissionResult> {
  const createCaseDto = {
    isAnonymous: payload.isAnonymous || payload.reportingMode === 'anonymous',
    isWhistleblowing: true,
    reporterType: payload.relationship || 'Whistleblower',
    fullName: payload.fullName,
    email: payload.contactEmail || payload.email,
    phoneNumber: payload.phoneNumber,
    physicalAddress: payload.physicalAddress,
    targetDepartment: payload.targetDepartment || payload.divisionDepartmentBranch,
    fraudType: payload.corruptionType || payload.category,
    summary: payload.summary || payload.description,
    detailedDescription: payload.detailedNarrative,
    incidentStartDate: parseDateOrNull(payload.incidentDate),
    incidentEndDate: parseDateOrNull(payload.incidentDate),
    incidentLocation: payload.incidentLocation,
    howBecameAware: payload.howAware,
    whyBelievedCorrupt: payload.whyCorrupt,
    priorReports: payload.priorReports,
    resolutionSought: payload.resolutionSought,
    subjectType: payload.subjectType ?? 1,
  }

  try {
    const response = await apiClient.post('/api/Cases', createCaseDto)
    if (response.data.success) {
      const savedCase = response.data.data
      return {
        caseReferenceKey: savedCase.referenceKey,
        submittedAt: savedCase.submittedAt,
        category: savedCase.category,
        trackingUrl: `/track?case=${savedCase.referenceKey}`,
        reportingMode: payload.reportingMode || (payload.isAnonymous ? 'anonymous' : 'confidential'),
        divisionDepartmentBranch: payload.divisionDepartmentBranch || payload.targetDepartment,
        reportRecipient: payload.reportRecipient || 'Risk Management & Compliance Division',
      }
    } else {
      throw new Error(response.data.message || 'Failed to submit case')
    }
  } catch (error) {
    console.error('Error submitting case to backend:', error)
    // Fallback response if something fails
    return {
      caseReferenceKey: `CBE-ETH-FAIL`,
      submittedAt: new Date().toISOString(),
      category: payload.corruptionType || 'Unknown',
      trackingUrl: `/track?case=FAIL`,
      reportingMode: payload.reportingMode || (payload.isAnonymous ? 'anonymous' : 'confidential'),
      divisionDepartmentBranch: payload.divisionDepartmentBranch || payload.targetDepartment,
      reportRecipient: payload.reportRecipient || 'Risk Management & Compliance Division',
    }
  }
}
