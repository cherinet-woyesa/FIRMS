import React from "react";
import {
    MoreHorizontal,
    Pencil,
    Settings2,
    ShieldCheck,
    Trash2,
} from "lucide-react";

import type { Role } from "../types";

interface RoleTableProps {
    roles: Role[];
    isLoading?: boolean;
    onEdit: (role: Role) => void;
    onDelete: (role: Role) => void;
    onManagePermissions: (role: Role) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
    roles,
    isLoading = false,
    onEdit,
    onDelete,
    onManagePermissions,
}) => {
    if (isLoading) {
        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="flex items-center justify-between px-6 py-5"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />

                                <div className="space-y-2">
                                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                                    <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                                </div>
                            </div>

                            <div className="h-8 w-8 animate-pulse rounded bg-gray-100" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (roles.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <ShieldCheck className="h-6 w-6 text-gray-400" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                    No roles found
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                    There are no roles matching your search criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="w-full px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Role
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {roles.map((role) => (
                            <tr
                                key={role.id}
                                className="group transition-colors hover:bg-slate-50/80"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100 group-hover:text-purple-700">
                                            <ShieldCheck className="h-5 w-5 text-[#95298E]" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {role.name}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                    System Role
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-end">
                                        <div className="relative">
                                            <details className="group">
                                                <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </summary>

                                                <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onManagePermissions(role)
                                                        }
                                                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Settings2 className="h-4 w-4 text-[#95298E]" />
                                                        Manage Permissions
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(role)}
                                                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Pencil className="h-4 w-4 text-gray-500" />
                                                        Edit Role
                                                    </button>

                                                    <div className="my-1 border-t border-gray-100" />

                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(role)}
                                                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete Role
                                                    </button>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};