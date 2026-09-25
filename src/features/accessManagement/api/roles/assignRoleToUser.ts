import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type { ApiResponse, AssignRoleToUserRequest } from '../../types';

interface AssignRoleToUserVariables {
    userId: string;
    payload: AssignRoleToUserRequest;
}

export const assignRoleToUser = async ({
    userId,
    payload,
}: AssignRoleToUserVariables): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(
        `/api/Roles/users/${userId}/roles`,
        payload
    );

    return response.data.data;
};

export const useAssignRoleToUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: assignRoleToUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });
};
