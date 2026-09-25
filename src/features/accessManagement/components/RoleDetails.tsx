// import React, { useState } from 'react';
// import { Plus } from 'lucide-react';

// import { useGetRolePermissions } from '../api/roles/getRolePermissions';
// import { useRemovePermissionFromRole } from '../api/roles/removePermissionFromRole';

// import type { RolePermission } from '../types';

// import { RoleHeader } from './RoleHeader';
// import { AssignedPermissionList } from './AssignedPermissionList';
// import { EditRoleModal } from '../modals';
// import { AssignPermissionModal } from '../modals/AssignPermissionModal';
// import { RemovePermissionModal } from '../modals/RemovePermissionModal';

// interface RoleDetailsProps {
//     roleId?: string;
//     onRoleDeleted?: () => void;
// }

// export const RoleDetails: React.FC<RoleDetailsProps> = ({
//     roleId,
// }) => {
//     const [editOpen, setEditOpen] = useState(false);
//     const [assignOpen, setAssignOpen] = useState(false);
//     const [permissionToRemove, setPermissionToRemove] =
//         useState<RolePermission | null>(null);

//     const {
//         data: roleData,
//         isLoading,
//         isError,
//         error,
//     } = useGetRolePermissions(roleId);

//     const removePermission = useRemovePermissionFromRole();

//     if (!roleId) {
//         return null;
//     }

//     if (isLoading) {
//         return (
//             <div className="space-y-6">
//                 <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
//                 <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
//             </div>
//         );
//     }

//     if (isError) {
//         return (
//             <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
//                 {error instanceof Error
//                     ? error.message
//                     : 'Failed to load role permissions.'}
//             </div>
//         );
//     }

//     if (!roleData) {
//         return null;
//     }

//     const handleRemovePermission = () => {
//         if (!permissionToRemove) return;

//         removePermission.mutate(
//             {
//                 roleId,
//                 permissionId: permissionToRemove.permissionId,
//             },
//             {
//                 onSuccess: () => {
//                     setPermissionToRemove(null);
//                 },
//             }
//         );
//     };

//     return (
//         <>
//             <div className="space-y-6">
//                 {/* Role information */}
//                 <div className="rounded-xl border border-gray-200 bg-white">
//                     <RoleHeader
//                         roleName={roleData.roleName}
//                         onEdit={() => setEditOpen(true)}
//                     />
//                 </div>

//                 {/* Permissions */}
//                 <div className="rounded-xl border border-gray-200 bg-white">
//                     <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
//                         <div>
//                             <h3 className="text-sm font-semibold text-gray-900">
//                                 Assigned permissions
//                             </h3>

//                             <p className="mt-1 text-xs text-gray-500">
//                                 {roleData.permissions.length}{' '}
//                                 {roleData.permissions.length === 1
//                                     ? 'permission'
//                                     : 'permissions'}{' '}
//                                 assigned
//                             </p>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={() => setAssignOpen(true)}
//                             className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#95298E] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#7A1F73] focus:outline-none focus:ring-2 focus:ring-[#95298E]/30"
//                         >
//                             <Plus className="h-4 w-4" />
//                             Add Permission
//                         </button>
//                     </div>

//                     <div className="p-5">
//                         <AssignedPermissionList
//                             permissions={roleData.permissions}
//                             onRemove={setPermissionToRemove}
//                         />
//                     </div>
//                 </div>
//             </div>

//             <EditRoleModal
//                 open={editOpen}
//                 onOpenChange={setEditOpen}
//                 roleId={roleData.roleId}
//                 currentName={roleData.roleName}
//             />

//             <AssignPermissionModal
//                 open={assignOpen}
//                 onOpenChange={setAssignOpen}
//                 roleId={roleId}
//                 assignedPermissionIds={new Set(
//                     roleData.permissions.map(
//                         (permission) => permission.permissionId
//                     )
//                 )}
//             />

//             <RemovePermissionModal
//                 open={Boolean(permissionToRemove)}
//                 onOpenChange={(open) => {
//                     if (!open) {
//                         setPermissionToRemove(null);
//                     }
//                 }}
//                 permission={permissionToRemove}
//                 onConfirm={handleRemovePermission}
//                 isPending={removePermission.isPending}
//             />
//         </>
//     );
// };