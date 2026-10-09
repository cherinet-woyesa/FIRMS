import type { CorruptionReportInput, ReportSubmissionResult } from '../types/report.types'
import { apiClient } from '../../../lib/apiClient'
import { fetchIntakeChannels, fetchCaseTypes, fetchFraudTypes } from './lookupsApi'

const parseDateOrNull = (dateStr?: string) => {
  if (!dateStr || dateStr.trim() === '' || dateStr.toLowerCase() === 'unknown') return null
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

/**
 * Submit encrypted corruption report to the ethics & compliance oversight system
 * via POST /api/Cases/whistleblower [multipart/form-data]
 */
export async function submitWhistleblowerReport(
  payload: CorruptionReportInput,
  files?: File[]
): Promise<ReportSubmissionResult> {
  // 1. Resolve dynamic lookups from backend
  const [intakeChannels, caseTypes, fraudTypes] = await Promise.all([
    fetchIntakeChannels(),
    fetchCaseTypes(),
    fetchFraudTypes(),
  ])

  // Resolve Intake Channel (prefer WHISTLEBLOWER or WHISTLEBLOWING code)
  const whistleblowerChannel =
    intakeChannels.find((c) => c.code?.toUpperCase().includes('WHISTLEBLOW')) ||
    intakeChannels.find((c) => c.isActive !== false) ||
    intakeChannels[0]

  // Resolve Case Type (prefer ETHICS or FRAUD)
  const resolvedCaseType =
    caseTypes.find((t) => t.code?.toUpperCase() === 'ETHICS') ||
    caseTypes.find((t) => t.code?.toUpperCase() === 'FRAUD') ||
    caseTypes.find((t) => t.isActive !== false) ||
    caseTypes[0]

  // Resolve Fraud Type by user-selected corruptionType
  const matchedFraudType = fraudTypes.find(
    (f) =>
      f.name.toLowerCase() === payload.corruptionType?.toLowerCase() ||
      f.name.toLowerCase().includes(payload.corruptionType?.toLowerCase() || '')
  )

  const isAnonymous = payload.reportingMode === 'anonymous' || Boolean(payload.isAnonymous)
  const protectIdentity = payload.reportingMode === 'confidential' || isAnonymous

  // 2. Build multipart/form-data
  const formData = new FormData()

  const titleRaw = payload.summary || payload.corruptionType || 'Whistleblower Report'
  const title = titleRaw.length > 200 ? titleRaw.slice(0, 197) + '...' : titleRaw

  formData.append('Title', title)
  formData.append('Summary', payload.summary || '')
  formData.append('Description', payload.detailedNarrative || payload.summary || '')

  if (payload.incidentDate) {
    const parsedDate = parseDateOrNull(payload.incidentDate)
    if (parsedDate) {
      formData.append('IncidentStartDate', parsedDate)
      formData.append('IncidentEndDate', parsedDate)
    }
  }

  if (resolvedCaseType?.id) {
    formData.append('CaseTypeId', resolvedCaseType.id)
  }
  if (whistleblowerChannel?.id) {
    formData.append('IntakeChannelId', whistleblowerChannel.id)
  }
  if (matchedFraudType?.id) {
    formData.append('FraudTypeId', matchedFraudType.id)
  }

  formData.append('Priority', 'MEDIUM')
  formData.append('SubjectType', String(payload.subjectType ?? 1))
  formData.append('SubjectName', payload.corruptedPersonNames || 'Unknown Subject')
  formData.append('SubjectJobPosition', payload.jobPositions || '')
  formData.append('SubjectDepartment', payload.divisionDepartmentBranch || payload.departmentOffice || '')
  formData.append('SubjectIdentifyingInfo', payload.otherIdentifyingInfo || '')
  formData.append('Location', payload.incidentLocation || payload.organizationAddress || '')
  formData.append('HowBecameAware', payload.howAware || '')
  formData.append('WhyBelievedCorrupt', payload.whyCorrupt || '')
  formData.append('PriorReports', payload.priorReports || '')

  const resolution = payload.customResolutionDetails
    ? `${payload.resolutionSought} - ${payload.customResolutionDetails}`
    : payload.resolutionSought || ''
  formData.append('ResolutionSought', resolution)
  formData.append('WitnessesList', payload.witnesses || '')
  formData.append('EvidenceNotPossessed', payload.evidenceNotInPossession || '')
  formData.append('AllegationSummary', payload.summary || '')

  // Reporter details
  formData.append('Reporter.ReporterType', payload.relationship || 'Whistleblower')
  formData.append('Reporter.IsAnonymous', String(isAnonymous))
  formData.append('Reporter.ProtectIdentity', String(protectIdentity))
  formData.append('Reporter.Name', isAnonymous ? 'Anonymous' : payload.fullName || 'Confidential Reporter')
  formData.append('Reporter.Email', isAnonymous ? '' : payload.contactEmail || payload.email || '')
  formData.append('Reporter.Phone', isAnonymous ? '' : payload.phoneNumber || '')
  formData.append('Reporter.PhysicalAddress', isAnonymous ? '' : payload.physicalAddress || '')

  // Append any raw binary files
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('Attachments', file)
    })
  }

  try {
    const response = await apiClient.post('/api/Cases/whistleblower', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const responseData = response.data
    const savedCase = responseData?.data || responseData

    const reference = savedCase?.caseNo || savedCase?.referenceKey || savedCase?.id || `CBE-ETH-${Date.now().toString().slice(-6)}`
    const timestamp = savedCase?.createdAt || savedCase?.submittedAt || new Date().toISOString()

    return {
      caseReferenceKey: reference,
      submittedAt: timestamp,
      category: payload.corruptionType || savedCase?.category || 'Whistleblower Allegation',
      trackingUrl: `/track?case=${reference}`,
      reportingMode: payload.reportingMode || (isAnonymous ? 'anonymous' : 'confidential'),
      divisionDepartmentBranch: payload.divisionDepartmentBranch || payload.targetDepartment,
      reportRecipient: payload.reportRecipient || 'Risk Management & Compliance Division',
    }
  } catch (error: any) {
    console.error('Error submitting whistleblower report to backend:', error)
    const backendMessage = error?.response?.data?.message || error?.response?.data || error?.message
    throw new Error(backendMessage || 'Failed to submit report. Please check required fields.')
  }
}
