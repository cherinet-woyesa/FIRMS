import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Check,
    KeyRound,
    Loader2,
    Search,
    ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import { Modal } from "../components/Modal";
import {
    Permission,
    Role,
} from "../types";

import {
    useAssignPermissionToRole,
} from "../api/roles/assignPermissionToRole";

import {
    useGetPermissions,
} from "../api/permissions/getPermissions";
import {
    useRemovePermissionFromRole,
} from "../api/roles/removePermissionFromRole";
import {
    useGetRolePermissions,
} from "../api/roles/getRolePermissions";

interface ManageRolePermissionsModalProps {
    open: boolean;
    onClose: () => void;
    role?: Role | null;
}

export const ManageRolePermissionsModal: React.FC<
    ManageRolePermissionsModalProps
> = ({
    open,
    onClose,
    role,
}) => {
        const [search, setSearch] = useState("");

        const [
            assignedIds,
            setAssignedIds,
        ] = useState<Set<string>>(
            new Set<string>()
        );

        const [
            pendingPermissionId,
            setPendingPermissionId,
        ] = useState<string | null>(null);

        const {
            data: rolePermissionsResponse,
            isLoading:
            isRolePermissionsLoading,
        } = useGetRolePermissions(
            role?.id ?? ""
        );

        const {
            data: permissionsResponse,
            isLoading:
            isPermissionsLoading,
        } = useGetPermissions();

        const assignPermission =
            useAssignPermissionToRole();

        const removePermission =
            useRemovePermissionFromRole();

        const permissions: Permission[] =
            permissionsResponse ?? [];

        const rolePermissions =
            rolePermissionsResponse?.permissions ?? [];

        useEffect(() => {
            if (!open) {
                setSearch("");
                setAssignedIds(new Set());
                return;
            }

            const ids = new Set<string>(
                rolePermissions.map(
                    (permission: any) =>
                        permission.permissionId
                )
            );

            setAssignedIds(ids);
        }, [
            open,
            rolePermissionsResponse,
        ]);

        const filteredPermissions =
            useMemo(() => {
                const searchValue =
                    search.toLowerCase().trim();

                if (!searchValue) {
                    return permissions;
                }

                return permissions.filter(
                    (permission) =>
                        permission.name
                            .toLowerCase()
                            .includes(searchValue) ||
                        permission.description
                            .toLowerCase()
                            .includes(searchValue)
                );
            }, [permissions, search]);

        const handlePermissionChange =
            async (
                permission: Permission,
                checked: boolean
            ) => {
                if (!role) return;

                const permissionId =
                    permission.id;

                setPendingPermissionId(
                    permissionId
                );

                // Optimistic update
                setAssignedIds((current) => {
                    const next = new Set(
                        current
                    );

                    if (checked) {
                        next.add(permissionId);
                    } else {
                        next.delete(permissionId);
                    }

                    return next;
                });

                try {
                    if (checked) {
                        await assignPermission.mutateAsync(
                            {
                                roleId: role.id,
                                payload: {
                                    permissionId,
                                },
                            }
                        );

                        toast.success(
                            `"${permission.name}" assigned to ${role.name}.`
                        );
                    } else {
                        await removePermission.mutateAsync(
                            {
                                roleId: role.id,
                                permissionId,
                            }
                        );

                        toast.success(
                            `"${permission.name}" removed from ${role.name}.`
                        );
                    }
                } catch (error) {
                    // Rollback
                    setAssignedIds((current) => {
                        const next = new Set(
                            current
                        );

                        if (checked) {
                            next.delete(
                                permissionId
                            );
                        } else {
                            next.add(
                                permissionId
                            );
                        }

                        return next;
                    });

                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to update permission."
                    );
                } finally {
                    setPendingPermissionId(
                        null
                    );
                }
            };

        const isLoading =
            isRolePermissionsLoading ||
            isPermissionsLoading;

        return (
            <Modal
                open={open}
                onClose={onClose}
                title="Manage Role Permissions"
                description={
                    role
                        ? `Configure the permissions assigned to ${role.name}.`
                        : undefined
                }
                size="xl"
            >
                <div className="space-y-5">
                    {/* Role information */}
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#95298E]/10">
                            <ShieldCheck className="h-5 w-5 text-[#95298E]" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                                {role?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {assignedIds.size} permission
                                {assignedIds.size === 1
                                    ? ""
                                    : "s"} assigned
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search permissions..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10"
                        />
                    </div>

                    {/* Permissions */}
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-14">
                                <Loader2 className="h-6 w-6 animate-spin text-[#95298E]" />
                            </div>
                        ) : filteredPermissions.length === 0 ? (
                            <div className="px-6 py-14 text-center">
                                <KeyRound className="mx-auto h-8 w-8 text-gray-300" />

                                <p className="mt-3 text-sm font-medium text-gray-900">
                                    No permissions found
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Try a different search term.
                                </p>
                            </div>
                        ) : (
                            <div className="max-h-[420px] divide-y divide-gray-100 overflow-y-auto">
                                {filteredPermissions.map(
                                    (permission) => {
                                        const isAssigned =
                                            assignedIds.has(
                                                permission.id
                                            );

                                        const isPending =
                                            pendingPermissionId ===
                                            permission.id;

                                        return (
                                            <div
                                                key={
                                                    permission.id
                                                }
                                                className={`flex items-start gap-4 p-4 transition ${isAssigned
                                                    ? "bg-[#95298E]/5"
                                                    : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                <button
                                                    type="button"
                                                    disabled={
                                                        isPending
                                                    }
                                                    onClick={() =>
                                                        handlePermissionChange(
                                                            permission,
                                                            !isAssigned
                                                        )
                                                    }
                                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${isAssigned
                                                        ? "border-[#95298E] bg-[#95298E] text-white"
                                                        : "border-gray-300 bg-white"
                                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                                    aria-label={
                                                        isAssigned
                                                            ? `Remove ${permission.name}`
                                                            : `Assign ${permission.name}`
                                                    }
                                                >
                                                    {isPending ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        isAssigned && (
                                                            <Check className="h-3.5 w-3.5" />
                                                        )
                                                    )}
                                                </button>

                                                <div className="min-w-0">
                                                    <p className="font-mono text-sm font-medium text-gray-900">
                                                        {
                                                            permission.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {
                                                            permission.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };