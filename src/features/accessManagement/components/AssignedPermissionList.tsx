import React from 'react';
import { KeyRound } from 'lucide-react';

import type { RolePermission } from '../types';
import { AssignedPermissionItem } from './AssignedPermissionItem';

interface AssignedPermissionListProps {
    permissions: RolePermission[];
    onRemove: (permission: RolePermission) => void;
}

export const AssignedPermissionList: React.FC<
    AssignedPermissionListProps
> = ({ permissions, onRemove }) => {
    if (permissions.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-900">
                    No permissions assigned
                </p>

                <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">
                    This role does not have any permissions yet. Add permissions
                    to define what users with this role can do.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {permissions.map((permission) => (
                <AssignedPermissionItem
                    key={permission.permissionId}
                    permission={permission}
                    onRemove={() => onRemove(permission)}
                />
            ))}
        </div>
    );
};