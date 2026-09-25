import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Modal } from "../components/Modal";
import { Permission } from "../types";
import { useDeletePermission } from "../api/permissions/deletePermission";

interface DeletePermissionModalProps {
    open: boolean;
    onClose: () => void;
    permission?: Permission | null;
}

export const DeletePermissionModal: React.FC<
    DeletePermissionModalProps
> = ({
    open,
    onClose,
    permission,
}) => {
        const deletePermission = useDeletePermission();

        const handleDelete = async () => {
            if (!permission) return;

            try {
                await deletePermission.mutateAsync(
                    permission.id
                );

                toast.success(
                    "Permission deleted successfully."
                );

                onClose();
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete permission."
                );
            }
        };

        return (
            <Modal
                open={open}
                onClose={
                    deletePermission.isPending
                        ? () => { }
                        : onClose
                }
                title="Delete Permission"
                description="This action cannot be undone."
                size="sm"
            >
                <div className="space-y-5">
                    <div className="flex gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Delete "{permission?.name}"?
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                                Make sure this permission is no longer
                                required before deleting it.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deletePermission.isPending}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={
                                deletePermission.isPending ||
                                !permission
                            }
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {deletePermission.isPending && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            Delete Permission
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };