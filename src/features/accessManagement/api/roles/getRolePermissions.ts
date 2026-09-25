import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type {
    ApiResponse,
    RolePermissionsResponse,
} from '../../types';

export const getRolePermissions = async (
    roleId: string
): Promise<RolePermissionsResponse> => {
    const response = await apiClient.get<
        ApiResponse<RolePermissionsResponse>
    >(`/api/Roles/${roleId}/permissions`);

    return response.data.data;
};

export const useGetRolePermissions = (roleId?: string) => {
    return useQuery({
        queryKey: ['role-permissions', roleId],

        queryFn: () => getRolePermissions(roleId!),

        enabled: Boolean(roleId),
    });
};