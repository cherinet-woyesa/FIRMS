import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type {
    ApiResponse,
    Role,
    UpdateRoleRequest,
} from '../../types';

interface UpdateRoleVariables {
    roleId: string;
    payload: UpdateRoleRequest;
}

export const updateRole = async ({
    roleId,
    payload,
}: UpdateRoleVariables): Promise<Role> => {
    const response = await apiClient.put<ApiResponse<Role>>(
        `/api/Roles/${roleId}`,
        payload
    );

    return response.data.data;
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRole,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['roles'],
            });
        },
    });
};