import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type {
    ApiResponse,
    AssignPermissionRequest,
    RolePermissionsResponse,
} from '../../types';

interface AssignPermissionVariables {
    roleId: string;
    payload: AssignPermissionRequest;
}

export const assignPermissionToRole = async ({
    roleId,
    payload,
}: AssignPermissionVariables): Promise<RolePermissionsResponse> => {
    const response = await apiClient.post<
        ApiResponse<RolePermissionsResponse>
    >(`/api/Roles/${roleId}/permissions`, payload);

    return response.data.data;
};

export const useAssignPermissionToRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: assignPermissionToRole,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['role-permissions', variables.roleId],
            });
        },
    });
};