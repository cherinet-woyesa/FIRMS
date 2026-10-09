export interface WorkflowTransitionAction {
  transitionId: string
  actionCode: string
  actionName: string
  description?: string
  fromStageId: string
  fromStageCode: string
  fromStageName: string
  toStageId: string
  toStageCode: string
  toStageName: string
  requiresComment: boolean
  requiresApproval: boolean
  requiresAssignment: boolean
  slaHours?: number
  requiredPermission?: string
}

export interface ExecuteWorkflowTransitionRequest {
  actionCode: string
  comment?: string
  assignedUserId?: string
  assignedRoleId?: string
  assignedOrgUnitId?: string
  dueAt?: string
}

export interface WorkflowExecutionResult {
  success: boolean
  error?: string
  transitionId: string
  actionCode: string
  actionName: string
  fromStageId: string
  fromStageCode: string
  fromStageName: string
  toStageId: string
  toStageCode: string
  toStageName: string
  comment?: string
  statusCode?: number
}

export interface WorkflowHistoryItem {
  id: string
  caseId: string
  workflowVersionId: string
  fromStageId?: string
  fromStageCode?: string
  fromStageName?: string
  toStageId: string
  toStageCode?: string
  toStageName?: string
  transitionId?: string
  actionCode: string
  actionName: string
  performedByUserId: string
  performedByUserName?: string
  performedAt: string
  comment?: string
  metadata?: string
}
