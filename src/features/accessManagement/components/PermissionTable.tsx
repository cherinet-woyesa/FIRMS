import React from "react";
import {
    KeyRound,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";

import type { Permission } from "../types";

interface PermissionTableProps {
    permissions: Permission[];
    isLoading?: boolean;
    onEdit: (permission: Permission) => void;
    onDelete: (permission: Permission) => void;
}

export const PermissionTable: React.FC<
    PermissionTableProps
> = ({
    permissions,
    isLoading = false,
    onEdit,
    onDelete,
}) => {
        const formatDate = (value: string) => {
            if (!value) return "-";

            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {
                return "-";
            }

            return date.toLocaleDateString();
        };

        if (isLoading) {
            return (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="divide-y divide-gray-100">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="px-6 py-5"
                            >
                                <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                                <div className="mt-2 h-3 w-96 max-w-full animate-pulse rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (permissions.length === 0) {
            return (
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <KeyRound className="h-6 w-6 text-gray-400" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-gray-900">
                        No permissions found
                    </h3>

                    <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
                        There are no permissions matching your search
                        criteria.
                    </p>
                </div>
            );
        }

        return (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Permission
                                </th>

                                <th className="w-full px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Description
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Created
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {permissions.map((permission) => (
                                <tr
                                    key={permission.id}
                                    className="group transition-colors hover:bg-slate-50/80"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100 group-hover:text-purple-700">
                                                <KeyRound className="h-5 w-5 text-[#95298E]" />
                                            </div>

                                            <span className="font-mono text-sm font-semibold text-slate-900">
                                                {permission.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="max-w-md px-6 py-4">
                                        <p className="truncate text-sm text-gray-600">
                                            {permission.description}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        {permission.isActive ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(permission.createdAt)}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end">
                                            <details className="group relative">
                                                <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </summary>

                                                <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => onEdit(permission)}
                                                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Pencil className="h-4 w-4 text-gray-500" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(permission)}
                                                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </details>
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