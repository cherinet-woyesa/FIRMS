import React from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import type { RolePermission } from '../types';

interface AssignedPermissionItemProps {
    permission: RolePermission;
    onRemove: () => void;
}

export const AssignedPermissionItem: React.FC<
    AssignedPermissionItemProps
> = ({ permission, onRemove }) => {
    return (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 transition hover:border-gray-300">
            <div className="flex min-w-0 gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                <div className="min-w-0">
                    <p className="break-all font-mono text-sm font-medium text-gray-900">
                        {permission.name}
                    </p>

                    <p className="mt-1 text-sm leading-5 text-gray-500">
                        {permission.description}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onRemove}
                className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label={`Remove ${permission.name}`}
                title="Remove permission"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
};