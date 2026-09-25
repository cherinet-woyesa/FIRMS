import React, {
    useMemo,
    useState,
} from "react";

import {
    KeyRound,
    Plus,
    Search,
} from "lucide-react";

import { Permission } from "../types";

import {
    useGetPermissions,
} from "../api/permissions/getPermissions";

import { PermissionTable } from "../components/PermissionTable";

import { PermissionFormModal } from "../modals/PermissionFormModal";

import { DeletePermissionModal } from "../modals/DeletePermissionModal";

export const PermissionsPage: React.FC =
    () => {
        const [search, setSearch] =
            useState("");

        const [
            statusFilter,
            setStatusFilter,
        ] = useState<
            "all" | "active" | "inactive"
        >("all");

        const [
            formModalOpen,
            setFormModalOpen,
        ] = useState(false);

        const [
            deleteModalOpen,
            setDeleteModalOpen,
        ] = useState(false);

        const [
            selectedPermission,
            setSelectedPermission,
        ] = useState<Permission | null>(
            null
        );

        const {
            data,
            isLoading,
            isError,
            error,
        } = useGetPermissions();

        const permissions: Permission[] =
            data ?? [];

        const filteredPermissions =
            useMemo(() => {
                const searchValue =
                    search
                        .toLowerCase()
                        .trim();

                return permissions.filter(
                    (permission) => {
                        const matchesSearch =
                            !searchValue ||
                            permission.name
                                .toLowerCase()
                                .includes(searchValue) ||
                            permission.description
                                .toLowerCase()
                                .includes(searchValue);

                        const matchesStatus =
                            statusFilter === "all" ||
                            (statusFilter ===
                                "active" &&
                                permission.isActive) ||
                            (statusFilter ===
                                "inactive" &&
                                !permission.isActive);

                        return (
                            matchesSearch &&
                            matchesStatus
                        );
                    }
                );
            }, [
                permissions,
                search,
                statusFilter,
            ]);

        const handleCreate = () => {
            setSelectedPermission(
                null
            );

            setFormModalOpen(true);
        };

        const handleEdit = (
            permission: Permission
        ) => {
            setSelectedPermission(
                permission
            );

            setFormModalOpen(true);
        };

        const handleDelete = (
            permission: Permission
        ) => {
            setSelectedPermission(
                permission
            );

            setDeleteModalOpen(true);
        };

        const closeFormModal = () => {
            setFormModalOpen(false);
            setSelectedPermission(
                null
            );
        };

        const closeDeleteModal = () => {
            setDeleteModalOpen(false);
            setSelectedPermission(
                null
            );
        };

        return (
            <div className="space-y-6">
                {/* Heading */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#95298E]/10">
                            <KeyRound className="h-5 w-5 text-[#95298E]" />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Permissions
                            </h2>

                            <p className="text-sm text-gray-500">
                                Define actions that can be granted to roles.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCreate}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#95298E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#781D72]"
                    >
                        <Plus className="h-4 w-4" />
                        Create Permission
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-sm">
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
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="permission-status"
                            className="text-sm text-gray-500"
                        >
                            Status
                        </label>

                        <select
                            id="permission-status"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target
                                        .value as
                                    | "all"
                                    | "active"
                                    | "inactive"
                                )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10"
                        >
                            <option value="all">
                                All
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>

                        <span className="ml-2 text-sm text-gray-500">
                            {
                                filteredPermissions.length
                            }{" "}
                            permission
                            {filteredPermissions.length ===
                                1
                                ? ""
                                : "s"}
                        </span>
                    </div>
                </div>

                {/* Error */}
                {isError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm font-medium text-red-800">
                            Failed to load permissions
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong while loading permissions."}
                        </p>
                    </div>
                )}

                {/* Table */}
                <PermissionTable
                    permissions={
                        filteredPermissions
                    }
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Create / Edit */}
                <PermissionFormModal
                    open={formModalOpen}
                    onClose={closeFormModal}
                    permission={
                        selectedPermission
                    }
                />

                {/* Delete */}
                <DeletePermissionModal
                    open={deleteModalOpen}
                    onClose={closeDeleteModal}
                    permission={
                        selectedPermission
                    }
                />
            </div>
        );
    };