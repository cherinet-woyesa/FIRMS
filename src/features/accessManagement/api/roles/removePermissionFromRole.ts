import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';

interface RemovePermissionVariables {
    roleId: string;
    permissionId: string;
}

export const removePermissionFromRole = async ({
    roleId,
    permissionId,
}: RemovePermissionVariables): Promise<void> => {
    await apiClient.delete(
        `/api/Roles/${roleId}/permissions/${permissionId}`
    );
};

export const useRemovePermissionFromRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removePermissionFromRole,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['role-permissions', variables.roleId],
            });
        },
    });
};