export interface WorkflowDefinition {
    id: string;
    code: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    createdBy: string | null;
}

export interface WorkflowVersion {
    id: string;
    workflowDefinitionId: string;
    versionNumber: number;
    isActive: boolean;
    effectiveFrom: string;
    effectiveTo: string | null;
}

export interface WorkflowStage {
    id: string;
    workflowVersionId: string;
    code: string;
    name: string;
    description: string | null;
    displayOrder: number;
    isInitial: boolean;
    isFinal: boolean;
}

export interface WorkflowTransition {
    id: string;
    workflowVersionId: string;
    fromStageId: string;
    toStageId: string;
    actionCode: string;
    actionName: string;
    description: string | null;
    requiredPermission: string | null;
    requiresComment: boolean;
    requiresApproval: boolean;
    requiresAssignment: boolean;
    slaHours: number | null;
    isActive: boolean;
}

export interface CreateWorkflowDefinitionDto {
    code: string;
    name: string;
    description?: string;
    isActive: boolean;
}

export interface CreateWorkflowVersionDto {
    workflowDefinitionId: string;
    versionNumber: number;
    effectiveFrom?: string;
    effectiveTo?: string | null;
    isActive: boolean;
}

export interface CreateWorkflowStageDto {
    workflowVersionId: string;
    code: string;
    name: string;
    description?: string;
    displayOrder: number;
    isInitial: boolean;
    isFinal: boolean;
}

export interface CreateWorkflowTransitionDto {
    workflowVersionId: string;
    fromStageId: string;
    toStageId: string;
    actionCode: string;
    actionName: string;
    description?: string;
    requiredPermission?: string;
    requiresComment: boolean;
    requiresApproval: boolean;
    requiresAssignment: boolean;
    slaHours?: number;
    isActive: boolean;
}

export interface UpdateWorkflowVersionDto {
    effectiveFrom?: string;
    effectiveTo?: string | null;
    isActive: boolean;
}

export interface UpdateWorkflowStageDto {
    name: string;
    description?: string | null;
    displayOrder: number;
    isInitial: boolean;
    isFinal: boolean;
}
