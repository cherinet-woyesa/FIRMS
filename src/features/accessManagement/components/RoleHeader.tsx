import React from 'react';
import { Edit3, Shield } from 'lucide-react';

interface RoleHeaderProps {
    roleName: string;
    onEdit: () => void;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({
    roleName,
    onEdit,
}) => {
    return (
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#95298E]/10">
                    <Shield className="h-5 w-5 text-[#95298E]" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {roleName}
                    </h2>

                    <p className="mt-0.5 text-sm text-gray-500">
                        Manage permissions assigned to this role.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
                <Edit3 className="h-4 w-4" />
                Edit Role
            </button>
        </div>
    );
};