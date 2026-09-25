export interface Role {
    id: string;
    name: string;
}

export interface Permission {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
}

export interface RolePermission {
    permissionId: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface RolePermissionsResponse {
    roleId: string;
    roleName: string;
    permissions: RolePermission[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface CreateRoleRequest {
    name: string;
}

export interface UpdateRoleRequest {
    name: string;
}

export interface CreatePermissionRequest {
    name: string;
    description: string;
}

export interface UpdatePermissionRequest {
    name: string;
    description: string;
    isActive: boolean;
}

export interface AssignPermissionRequest {
    permissionId: string;
}

export interface AssignRoleToUserRequest {
    roleName: string;
}