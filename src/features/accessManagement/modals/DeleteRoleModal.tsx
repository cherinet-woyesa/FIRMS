import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Modal } from "../components/Modal";
import { Role } from "../types";
import { useDeleteRole } from "../api/roles/deleteRole";

interface DeleteRoleModalProps {
    open: boolean;
    onClose: () => void;
    role?: Role | null;
}

export const DeleteRoleModal: React.FC<
    DeleteRoleModalProps
> = ({ open, onClose, role }) => {
    const deleteRole = useDeleteRole();

    const handleDelete = async () => {
        if (!role) return;

        try {
            await deleteRole.mutateAsync(role.id);

            toast.success("Role deleted successfully.");
            onClose();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete role."
            );
        }
    };

    return (
        <Modal
            open={open}
            onClose={
                deleteRole.isPending ? () => { } : onClose
            }
            title="Delete Role"
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
                            Delete "{role?.name}"?
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                            Users assigned to this role may lose their
                            associated access.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleteRole.isPending}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={
                            deleteRole.isPending || !role
                        }
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleteRole.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}

                        Delete Role
                    </button>
                </div>
            </div>
        </Modal>
    );
};