import { useMutation } from '@tanstack/react-query';
import { LoginRequest, LoginResponse } from '../types';
import { apiClient } from '../../../lib/apiClient';

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/api/Auth/login', payload);
    return response.data;
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: async (payload: LoginRequest) => await loginUser(payload),
    });
};