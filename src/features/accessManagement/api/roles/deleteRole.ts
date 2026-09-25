import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';

export const deleteRole = async (roleId: string): Promise<void> => {
    await apiClient.delete(`/api/Roles/${roleId}`);
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRole,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['roles'],
            });
        },
    });
};