import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';

export const deletePermission = async (
    permissionId: string
): Promise<void> => {
    await apiClient.delete(`/api/Permissions/${permissionId}`);
};

export const useDeletePermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePermission,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['permissions'],
            });
        },
    });
};