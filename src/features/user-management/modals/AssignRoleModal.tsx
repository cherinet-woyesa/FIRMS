import React, { useEffect, useState } from 'react';
import { Modal } from '../../accessManagement/components/Modal';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { UserData } from '../types';
import { useGetRoles } from '../../accessManagement/api/roles/getRoles';
import { useAssignRoleToUser } from '../../accessManagement/api/roles/assignRoleToUser';

interface AssignRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserData | null;
}

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
    isOpen,
    onClose,
    user,
}) => {
    const [selectedRole, setSelectedRole] = useState('');

    const { data: roles = [], isLoading: isLoadingRoles } = useGetRoles();
    const assignRole = useAssignRoleToUser();

    useEffect(() => {
        if (isOpen) {
            setSelectedRole('');
            assignRole.reset();
        }
    }, [isOpen]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedRole || !user) {
            toast.error('Please select a role.');
            return;
        }

        try {
            await assignRole.mutateAsync({
                userId: user.id,
                payload: {
                    roleName: selectedRole,
                },
            });

            toast.success(`Role '${selectedRole}' assigned to ${user.firstName} successfully.`);
            onClose();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Failed to assign role.'
            );
        }
    };

    if (!user) return null;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Assign Role"
            description={`Select a role to assign to ${user.firstName} ${user.lastName}.`}
            size="sm"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label
                        htmlFor="role-select"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Select Role
                    </label>

                    {isLoadingRoles ? (
                        <div className="flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <select
                            id="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={assignRole.isPending}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10 disabled:bg-gray-100"
                        >
                            <option value="" disabled>
                                -- Choose a role --
                            </option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={assignRole.isPending}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={!selectedRole || assignRole.isPending}
                        className="flex items-center gap-2 rounded-lg bg-[#95298E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#781D72] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {assignRole.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Assign Role
                    </button>
                </div>
            </form>
        </Modal>
    );
};
