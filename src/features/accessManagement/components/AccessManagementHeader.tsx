import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AccessManagementHeaderProps {
    onCreateRole: () => void;
}

export const AccessManagementHeader: React.FC<
    AccessManagementHeaderProps
> = ({ onCreateRole }) => {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#95298E]/10">
                    <ShieldCheck className="h-5 w-5 text-[#95298E]" />
                </div>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                        Access Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage roles, permissions, and system access.
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onCreateRole}
                className="inline-flex items-center justify-center rounded-lg bg-[#95298E] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#7A1F73] focus:outline-none focus:ring-2 focus:ring-[#95298E]/30"
            >
                Create Role
            </button>
        </div>
    );
};