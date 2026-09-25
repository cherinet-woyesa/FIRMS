import React, {
    useMemo,
    useState,
} from "react";

import {
    Plus,
    Search,
    ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import { Role } from "../types";

import {
    useGetRoles,
} from "../api/roles/getRoles";

import { RoleTable } from "../components/RoleTable";

import { RoleFormModal } from "../modals/RoleFormModal";
import { DeleteRoleModal } from "../modals/DeleteRoleModal";
import { ManageRolePermissionsModal } from "../modals/ManageRolePermissionsModal";

export const RolesPage: React.FC = () => {
    const [search, setSearch] =
        useState("");

    const [
        createModalOpen,
        setCreateModalOpen,
    ] = useState(false);

    const [
        editModalOpen,
        setEditModalOpen,
    ] = useState(false);

    const [
        deleteModalOpen,
        setDeleteModalOpen,
    ] = useState(false);

    const [
        permissionsModalOpen,
        setPermissionsModalOpen,
    ] = useState(false);

    const [
        selectedRole,
        setSelectedRole,
    ] = useState<Role | null>(
        null
    );

    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetRoles();

    const roles: Role[] =
        data ?? [];

    const filteredRoles =
        useMemo(() => {
            const searchValue =
                search.toLowerCase().trim();

            if (!searchValue) {
                return roles;
            }

            return roles.filter(
                (role) =>
                    role.name
                        .toLowerCase()
                        .includes(searchValue)
            );
        }, [roles, search]);

    const handleCreate = () => {
        setSelectedRole(null);
        setCreateModalOpen(true);
    };

    const handleEdit = (
        role: Role
    ) => {
        setSelectedRole(role);
        setEditModalOpen(true);
    };

    const handleDelete = (
        role: Role
    ) => {
        setSelectedRole(role);
        setDeleteModalOpen(true);
    };

    const handleManagePermissions = (
        role: Role
    ) => {
        setSelectedRole(role);
        setPermissionsModalOpen(
            true
        );
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedRole(null);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedRole(null);
    };

    const closePermissionsModal = () => {
        setPermissionsModalOpen(
            false
        );
        setSelectedRole(null);
    };

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#95298E]/10">
                            <ShieldCheck className="h-5 w-5 text-[#95298E]" />
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Roles
                            </h2>

                            <p className="text-sm text-gray-500">
                                Define roles and manage their system access.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#95298E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#781D72]"
                >
                    <Plus className="h-4 w-4" />
                    Create Role
                </button>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search roles..."
                        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10"
                    />
                </div>

                <p className="text-sm text-gray-500">
                    {filteredRoles.length} role
                    {filteredRoles.length === 1
                        ? ""
                        : "s"}
                </p>
            </div>

            {/* Error */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-800">
                        Failed to load roles
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        {error instanceof Error
                            ? error.message
                            : "Something went wrong while loading roles."}
                    </p>
                </div>
            )}

            {/* Table */}
            <RoleTable
                roles={filteredRoles}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onManagePermissions={
                    handleManagePermissions
                }
            />

            {/* Create */}
            <RoleFormModal
                open={createModalOpen}
                onClose={closeCreateModal}
            />

            {/* Edit */}
            <RoleFormModal
                open={editModalOpen}
                onClose={closeEditModal}
                role={selectedRole}
            />

            {/* Delete */}
            <DeleteRoleModal
                open={deleteModalOpen}
                onClose={closeDeleteModal}
                role={selectedRole}
            />

            {/* Permissions */}
            <ManageRolePermissionsModal
                open={permissionsModalOpen}
                onClose={closePermissionsModal}
                role={selectedRole}
            />
        </div>
    );
};