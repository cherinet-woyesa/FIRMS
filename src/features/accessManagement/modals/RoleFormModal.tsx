import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Modal } from "../components/Modal";
import { Role } from "../types";
import { useCreateRole } from "../api/roles/createRole";
import { useUpdateRole } from "../api/roles/updateRole";

interface RoleFormModalProps {
    open: boolean;
    onClose: () => void;
    role?: Role | null;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
    open,
    onClose,
    role,
}) => {
    const [name, setName] = useState("");

    const isEdit = Boolean(role);

    const createRole = useCreateRole();
    const updateRole = useUpdateRole();

    const isPending =
        createRole.isPending || updateRole.isPending;

    useEffect(() => {
        if (open) {
            setName(role?.name ?? "");
        }
    }, [open, role]);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            toast.error("Role name is required.");
            return;
        }

        if (trimmedName.length < 2) {
            toast.error(
                "Role name must contain at least 2 characters."
            );
            return;
        }

        try {
            if (role) {
                await updateRole.mutateAsync({
                    roleId: role.id,
                    payload: {
                        name: trimmedName,
                    },
                });

                toast.success("Role updated successfully.");
            } else {
                await createRole.mutateAsync({
                    name: trimmedName,
                });

                toast.success("Role created successfully.");
            }

            onClose();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save role."
            );
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEdit ? "Edit Role" : "Create Role"}
            description={
                isEdit
                    ? "Update the role name."
                    : "Create a new role for the system."
            }
            size="sm"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="role-name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Role Name
                    </label>

                    <input
                        id="role-name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="e.g. Investigation Manager"
                        disabled={isPending}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10 disabled:bg-gray-100"
                    />
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 rounded-lg bg-[#95298E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#781D72] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}

                        {isEdit ? "Update Role" : "Create Role"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};