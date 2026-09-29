import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { WorkflowDefinition, WorkflowVersion, WorkflowStage, WorkflowTransition } from '../types';

// --- API Calls ---

export const getWorkflowDefinitions = async (): Promise<WorkflowDefinition[]> => {
    const { data } = await apiClient.get('/api/WorkflowDefinitions');
    return data;
};

export const getWorkflowVersions = async (definitionId: string): Promise<WorkflowVersion[]> => {
    const { data } = await apiClient.get(`/api/WorkflowDefinitions/${definitionId}/versions`);
    return data;
};

export const getWorkflowStages = async (versionId: string): Promise<WorkflowStage[]> => {
    const { data } = await apiClient.get(`/api/WorkflowStages/version/${versionId}`);
    return data;
};

export const getWorkflowTransitions = async (stageId: string): Promise<WorkflowTransition[]> => {
    const { data } = await apiClient.get(`/api/WorkflowTransitions/stage/${stageId}`);
    return data;
};

// --- React Query Hooks ---

export const useWorkflowDefinitions = () => {
    return useQuery({
        queryKey: ['workflowDefinitions'],
        queryFn: getWorkflowDefinitions,
    });
};

export const useWorkflowVersions = (definitionId: string | null) => {
    return useQuery({
        queryKey: ['workflowVersions', definitionId],
        queryFn: () => getWorkflowVersions(definitionId as string),
        enabled: !!definitionId, // Only run if we have an ID
    });
};

export const useWorkflowStages = (versionId: string | null) => {
    return useQuery({
        queryKey: ['workflowStages', versionId],
        queryFn: () => getWorkflowStages(versionId as string),
        enabled: !!versionId,
    });
};

export const useWorkflowTransitions = (stageId: string | null) => {
    return useQuery({
        queryKey: ['workflowTransitions', stageId],
        queryFn: () => getWorkflowTransitions(stageId as string),
        enabled: !!stageId,
    });
};
