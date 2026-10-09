import { apiClient } from '@/lib/apiClient'
import type {
  WorkflowTransitionAction,
  ExecuteWorkflowTransitionRequest,
  WorkflowExecutionResult,
  WorkflowHistoryItem,
} from '../types/workflow.types'

/**
 * Retrieves the available transitions for the authenticated user on a specific case.
 * GET /api/WorkflowExecution/cases/{caseId}/available-actions
 */
export async function getAvailableWorkflowActions(caseId: string): Promise<WorkflowTransitionAction[]> {
  try {
    const response = await apiClient.get<WorkflowTransitionAction[]>(
      `/api/WorkflowExecution/cases/${caseId}/available-actions`
    )
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error(`Failed to fetch available workflow actions for case ${caseId}:`, error)
    return []
  }
}

/**
 * Retrieves the full workflow audit history for a specific case.
 * GET /api/WorkflowExecution/cases/{caseId}/history
 */
export async function getCaseWorkflowHistory(caseId: string): Promise<WorkflowHistoryItem[]> {
  try {
    const response = await apiClient.get<WorkflowHistoryItem[]>(
      `/api/WorkflowExecution/cases/${caseId}/history`
    )
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error(`Failed to fetch workflow history for case ${caseId}:`, error)
    return []
  }
}

/**
 * Executes a workflow transition on a case using the specified ActionCode.
 * POST /api/WorkflowExecution/cases/{caseId}/transitions
 */
export async function executeWorkflowTransition(
  caseId: string,
  request: ExecuteWorkflowTransitionRequest
): Promise<WorkflowExecutionResult> {
  try {
    const response = await apiClient.post<WorkflowExecutionResult>(
      `/api/WorkflowExecution/cases/${caseId}/transitions`,
      request
    )
    return response.data
  } catch (error: any) {
    console.error(`Failed to execute workflow transition for case ${caseId}:`, error)
    const errMessage = error?.response?.data?.error || error?.message || 'Transition failed'
    return {
      success: false,
      error: errMessage,
      transitionId: '',
      actionCode: request.actionCode,
      actionName: '',
      fromStageId: '',
      fromStageCode: '',
      fromStageName: '',
      toStageId: '',
      toStageCode: '',
      toStageName: '',
    }
  }
}
