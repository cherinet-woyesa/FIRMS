import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import { useGetRoles } from '../api/roles/getRoles';
import { RoleListItem } from './RoleListItem';

interface RoleListProps {
    selectedRoleId?: string;
    onSelectRole: (roleId: string) => void;
    onCreateRole: () => void;
}

export const RoleList: React.FC<RoleListProps> = ({
    selectedRoleId,
    onSelectRole,
    onCreateRole,
}) => {
    const [search, setSearch] = useState('');

    const {
        data: roles = [],
        isLoading,
        isError,
        error,
    } = useGetRoles();

    const filteredRoles = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        if (!searchTerm) {
            return roles;
        }

        return roles.filter((role) =>
            role.name.toLowerCase().includes(searchTerm)
        );
    }, [roles, search]);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                        Roles
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                        {roles.length} {roles.length === 1 ? 'role' : 'roles'}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCreateRole}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#95298E] transition hover:bg-[#95298E]/10"
                    aria-label="Create role"
                    title="Create role"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Search */}
            <div className="border-b border-gray-100 p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search roles..."
                        className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#95298E] focus:bg-white focus:ring-2 focus:ring-[#95298E]/10"
                    />
                </div>
            </div>

            {/* Role list */}
            <div className="max-h-[620px] overflow-y-auto p-2">
                {isLoading && (
                    <div className="space-y-2 p-1">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-11 animate-pulse rounded-lg bg-gray-100"
                            />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                        {error instanceof Error
                            ? error.message
                            : 'Failed to load roles.'}
                    </div>
                )}

                {!isLoading &&
                    !isError &&
                    filteredRoles.map((role) => (
                        <RoleListItem
                            key={role.id}
                            role={role}
                            selected={selectedRoleId === role.id}
                            onClick={() => onSelectRole(role.id)}
                        />
                    ))}

                {!isLoading && !isError && filteredRoles.length === 0 && (
                    <div className="px-4 py-10 text-center">
                        <p className="text-sm font-medium text-gray-900">
                            No roles found
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Try adjusting your search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};