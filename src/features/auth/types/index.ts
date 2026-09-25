export interface LoginRequest {
    username?: string;
    password?: string;
}

export interface AuthUser {
    userId: string;
    userName: string;
    employeeId?: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: AuthUser;
}