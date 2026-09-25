import { useQuery } from '@tanstack/react-query';
import { RegisterResponse } from '../../user-management/types'; // Reusing this since the 'data' structure matches
import { apiClient } from '../../../lib/apiClient';

export const getCurrentUser = async (): Promise<RegisterResponse> => {
    const response = await apiClient.get('/api/Auth/me');
    return response.data;
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
        // Typically you don't want to retry fetching the user if they are just logged out
        retry: false,
    });
};