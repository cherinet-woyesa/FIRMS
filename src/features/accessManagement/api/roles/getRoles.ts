import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type { ApiResponse, Role } from '../../types';

export const getRoles = async (): Promise<Role[]> => {
    const response = await apiClient.get<ApiResponse<Role[]>>('/api/Roles');

    return response.data.data;
};

export const useGetRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: getRoles,
    });
};