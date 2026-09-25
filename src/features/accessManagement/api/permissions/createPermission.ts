import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type {
    ApiResponse,
    CreatePermissionRequest,
    Permission,
} from '../../types';

export const createPermission = async (
    payload: CreatePermissionRequest
): Promise<Permission> => {
    const response = await apiClient.post<ApiResponse<Permission>>(
        '/api/Permissions',
        payload
    );

    return response.data.data;
};

export const useCreatePermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPermission,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['permissions'],
            });
        },
    });
};