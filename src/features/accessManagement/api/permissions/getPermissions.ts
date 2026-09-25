import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/apiClient';
import type {
    ApiResponse,
    Permission,
} from '../../types';

export const getPermissions = async (): Promise<Permission[]> => {
    const response = await apiClient.get<ApiResponse<Permission[]>>(
        '/api/Permissions'
    );

    return response.data.data;
};

export const useGetPermissions = () => {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: getPermissions,
    });
};