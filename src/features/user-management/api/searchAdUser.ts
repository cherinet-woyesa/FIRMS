import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';

interface AdUserPreview {
  empId: string;
  userName: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  company: string;
  department: string;
  manager: string;
}

export const searchAdUser = async (employeeId: string): Promise<AdUserPreview> => {
  const response = await apiClient.get(`/api/Auth/ad/employee/${employeeId}`);
  return response.data?.data || response.data;
};

export const useSearchAdUser = (employeeId: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['ad-user', employeeId],
    queryFn: () => searchAdUser(employeeId),
    enabled: enabled && !!employeeId,
    retry: false,
  });
};
