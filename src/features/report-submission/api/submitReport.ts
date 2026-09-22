import type { ReportSubmissionInput, ReportSubmissionResult } from '../types/report.types'

/**
 * Submit encrypted whistleblower report to the backend
 */
export async function submitWhistleblowerReport(
  payload: ReportSubmissionInput
): Promise<ReportSubmissionResult> {
  // In production: const { data } = await apiClient.post<ApiResponse<ReportSubmissionResult>>('/reports', payload)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const randomRef = `WB-${Math.floor(100000 + Math.random() * 900000)}`

  return {
    caseReferenceKey: randomRef,
    submittedAt: new Date().toISOString(),
    category: payload.category,
    trackingUrl: `/track?case=${randomRef}`,
  }
}
