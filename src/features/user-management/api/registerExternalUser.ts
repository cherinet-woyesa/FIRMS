import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RegisterExternalRequest, RegisterResponse } from '../types';
import { apiClient } from '../../../lib/apiClient';

export const registerExternalUser = async (payload: RegisterExternalRequest): Promise<RegisterResponse> => {
  const response = await apiClient.post('/api/Auth/register/external', payload);
  return response.data;
};

export const useRegisterExternalUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerExternalUser,
    onSuccess: (data) => {
      // Invalidate users list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};