// The user object returned inside 'data'
export interface UserData {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: "Employee" | "External";
  isActive: boolean;
  createdAt: string;
  roles?: string[];
  employeeId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// The generic API response wrapper
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<UserData>;
}

export interface GetUsersQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean | string;
  userType?: string;
}

// Active Directory Request Payload
export interface RegisterAdRequest {
  employeeId: string;
}

// External User Request Payload
export interface RegisterExternalRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password?: string;
  confirmPassword?: string;
}
