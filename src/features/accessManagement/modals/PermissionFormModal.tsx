import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Modal } from "../components/Modal";
import { Permission } from "../types";

import {
    useCreatePermission,
} from "../api/permissions/createPermission";
import { useUpdatePermission } from "../api/permissions/updatePermission";

interface PermissionFormModalProps {
    open: boolean;
    onClose: () => void;
    permission?: Permission | null;
}

export const PermissionFormModal: React.FC<
    PermissionFormModalProps
> = ({
    open,
    onClose,
    permission,
}) => {
        const [name, setName] = useState("");
        const [description, setDescription] = useState("");
        const [isActive, setIsActive] = useState(true);

        const isEdit = Boolean(permission);

        const createPermission = useCreatePermission();
        const updatePermission = useUpdatePermission();

        const isPending =
            createPermission.isPending ||
            updatePermission.isPending;

        useEffect(() => {
            if (open) {
                setName(permission?.name ?? "");
                setDescription(permission?.description ?? "");
                setIsActive(permission?.isActive ?? true);
            }
        }, [open, permission]);

        const handleSubmit = async (
            event: React.FormEvent<HTMLFormElement>
        ) => {
            event.preventDefault();

            const trimmedName = name.trim();
            const trimmedDescription = description.trim();

            if (!trimmedName) {
                toast.error("Permission name is required.");
                return;
            }

            if (!trimmedDescription) {
                toast.error(
                    "Permission description is required."
                );
                return;
            }

            try {
                if (permission) {
                    await updatePermission.mutateAsync({
                        permissionId: permission.id,
                        payload: {
                            name: trimmedName,
                            description: trimmedDescription,
                            isActive,
                        },
                    });

                    toast.success(
                        "Permission updated successfully."
                    );
                } else {
                    await createPermission.mutateAsync({
                        name: trimmedName,
                        description: trimmedDescription,
                    });

                    toast.success(
                        "Permission created successfully."
                    );
                }

                onClose();
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to save permission."
                );
            }
        };

        return (
            <Modal
                open={open}
                onClose={onClose}
                title={
                    isEdit
                        ? "Edit Permission"
                        : "Create Permission"
                }
                description={
                    isEdit
                        ? "Update the permission details."
                        : "Create a permission that can be assigned to roles."
                }
                size="md"
            >
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="permission-name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Permission Name
                        </label>

                        <input
                            id="permission-name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="e.g. cases.review"
                            disabled={isPending}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm outline-none focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10 disabled:bg-gray-100"
                        />

                        <p className="mt-1.5 text-xs text-gray-500">
                            Example: cases.review, cases.assign,
                            users.manage
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="permission-description"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="permission-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Describe what this permission allows the user to do."
                            rows={4}
                            disabled={isPending}
                            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10 disabled:bg-gray-100"
                        />
                    </div>

                    {isEdit && (
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(event) =>
                                    setIsActive(
                                        event.target.checked
                                    )
                                }
                                disabled={isPending}
                                className="h-4 w-4 accent-[#95298E]"
                            />

                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Active
                                </p>

                                <p className="text-xs text-gray-500">
                                    Inactive permissions cannot be used for
                                    new assignments.
                                </p>
                            </div>
                        </label>
                    )}

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 rounded-lg bg-[#95298E] px-4 py-2 text-sm font-medium text-white hover:bg-[#781D72] disabled:opacity-60"
                        >
                            {isPending && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {isEdit
                                ? "Update Permission"
                                : "Create Permission"}
                        </button>
                    </div>
                </form>
            </Modal>
        );
    };