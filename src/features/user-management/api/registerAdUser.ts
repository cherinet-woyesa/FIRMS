import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RegisterAdRequest, RegisterResponse } from '../types';
import { apiClient } from '../../../lib/apiClient'; // Update path as needed

export const registerAdUser = async (payload: RegisterAdRequest): Promise<RegisterResponse> => {
  // Axios automatically parses the JSON response into 'data'
  const response = await apiClient.post('/api/Auth/register/ad', payload);
  return response.data;
};

export const useRegisterAdUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerAdUser,
    onSuccess: (data) => {
      // Invalidate users list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};