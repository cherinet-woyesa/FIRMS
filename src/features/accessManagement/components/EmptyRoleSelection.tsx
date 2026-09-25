import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const EmptyRoleSelection: React.FC = () => {
    return (
        <div className="flex min-h-[520px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
            <div className="px-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#95298E]/10">
                    <ShieldCheck className="h-6 w-6 text-[#95298E]" />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-gray-900">
                    Select a role
                </h2>

                <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                    Select a role from the list to view and manage its
                    permissions.
                </p>
            </div>
        </div>
    );
};