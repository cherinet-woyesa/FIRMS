import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type {
    ApiResponse,
    CreateRoleRequest,
    Role,
} from '../../types';

export const createRole = async (
    payload: CreateRoleRequest
): Promise<Role> => {
    const response = await apiClient.post<ApiResponse<Role>>(
        '/api/Roles',
        payload
    );

    return response.data.data;
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRole,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['roles'],
            });
        },
    });
};