import { useQuery } from '@tanstack/react-query';
import { GetUsersResponse, GetUsersQueryParams } from '../types';
import { apiClient } from '../../../lib/apiClient';

export const getUsers = async (params: GetUsersQueryParams): Promise<GetUsersResponse> => {
  // Filter out undefined or empty string values so we don't send them in query
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
  );

  const response = await apiClient.get('/api/Users', {
    params: filteredParams,
  });
  return response.data;
};

export const useGetUsers = (params: GetUsersQueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData, // keep previous data while fetching
  });
};
