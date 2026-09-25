import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type {
    ApiResponse,
    Permission,
    UpdatePermissionRequest,
} from '../../types';

interface UpdatePermissionVariables {
    permissionId: string;
    payload: UpdatePermissionRequest;
}

export const updatePermission = async ({
    permissionId,
    payload,
}: UpdatePermissionVariables): Promise<Permission> => {
    const response = await apiClient.put<ApiResponse<Permission>>(
        `/api/Permissions/${permissionId}`,
        payload
    );

    return response.data.data;
};

export const useUpdatePermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePermission,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['permissions'],
            });
        },
    });
};