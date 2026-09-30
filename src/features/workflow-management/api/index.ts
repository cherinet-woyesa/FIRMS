import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { WorkflowDefinition, WorkflowVersion, WorkflowStage, WorkflowTransition, CreateWorkflowDefinitionDto } from '../types';

// --- API Calls ---

export const getWorkflowDefinitions = async (): Promise<WorkflowDefinition[]> => {
    const { data } = await apiClient.get('/api/WorkflowDefinitions');
    return data;
};

export const createWorkflowDefinition = async (dto: CreateWorkflowDefinitionDto): Promise<WorkflowDefinition> => {
    const { data } = await apiClient.post('/api/WorkflowDefinitions', dto);
    return data;
};

export const createWorkflowVersion = async (dto: import('../types').CreateWorkflowVersionDto): Promise<WorkflowVersion> => {
    const { data } = await apiClient.post('/api/WorkflowVersions', dto);
    return data;
};

export const updateWorkflowVersion = async ({ id, dto }: { id: string, dto: import('../types').UpdateWorkflowVersionDto }): Promise<WorkflowVersion> => {
    const { data } = await apiClient.put(`/api/WorkflowVersions/${id}`, dto);
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

export const createWorkflowStage = async (dto: import('../types').CreateWorkflowStageDto): Promise<WorkflowStage> => {
    const { data } = await apiClient.post('/api/WorkflowStages', dto);
    return data;
};

export const updateWorkflowStage = async ({ id, dto }: { id: string, dto: import('../types').UpdateWorkflowStageDto }): Promise<WorkflowStage> => {
    const { data } = await apiClient.put(`/api/WorkflowStages/${id}`, dto);
    return data;
};

export const createWorkflowTransition = async (dto: import('../types').CreateWorkflowTransitionDto): Promise<WorkflowTransition> => {
    const { data } = await apiClient.post('/api/WorkflowTransitions', dto);
    return data;
};

export const getWorkflowTransitions = async (stageId: string): Promise<WorkflowTransition[]> => {
    const { data } = await apiClient.get(`/api/WorkflowTransitions/stage/${stageId}`);
    return data;
};

export const getWorkflowTransitionsByVersion = async (versionId: string): Promise<WorkflowTransition[]> => {
    const { data } = await apiClient.get(`/api/WorkflowTransitions/version/${versionId}`);
    return data;
};

// --- React Query Hooks ---

export const useWorkflowDefinitions = () => {
    return useQuery({
        queryKey: ['workflowDefinitions'],
        queryFn: getWorkflowDefinitions,
    });
};

export const useCreateWorkflowDefinition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWorkflowDefinition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflowDefinitions'] });
        },
    });
};

export const useCreateWorkflowVersion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWorkflowVersion,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workflowVersions', variables.workflowDefinitionId] });
        },
    });
};

export const useCreateWorkflowStage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWorkflowStage,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workflowStages', variables.workflowVersionId] });
        },
    });
};

export const useCreateWorkflowTransition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWorkflowTransition,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workflowTransitions', variables.fromStageId] });
        },
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

export const useUpdateWorkflowVersion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateWorkflowVersion,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['workflowVersions', data.workflowDefinitionId] });
        },
    });
};

export const useWorkflowTransitionsByVersion = (versionId: string | null) => {
    return useQuery({
        queryKey: ['workflowTransitionsByVersion', versionId],
        queryFn: () => getWorkflowTransitionsByVersion(versionId as string),
        enabled: !!versionId,
    });
};

export const useUpdateWorkflowStage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateWorkflowStage,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['workflowStages', data.workflowVersionId] });
        },
    });
};
