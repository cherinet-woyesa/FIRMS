// import React, { useEffect, useState } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';

// import { useCreateRole } from '../api/roles/createRole';

// interface CreateRoleModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
//     open,
//     onOpenChange,
// }) => {
//     const [name, setName] = useState('');

//     const createRole = useCreateRole();

//     useEffect(() => {
//         if (!open) {
//             setName('');
//             createRole.reset();
//         }
//     }, [open]);

//     const handleSubmit = (event: React.FormEvent) => {
//         event.preventDefault();

//         const trimmedName = name.trim();

//         if (!trimmedName) return;

//         createRole.mutate(
//             {
//                 name: trimmedName,
//             },
//             {
//                 onSuccess: () => {
//                     onOpenChange(false);
//                     setName('');
//                 },
//             }
//         );
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                     <DialogTitle>Create Role</DialogTitle>

//                     <DialogDescription>
//                         Create a new role that can be assigned to system users.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <div className="space-y-2">
//                         <label
//                             htmlFor="role-name"
//                             className="text-sm font-medium text-gray-900"
//                         >
//                             Role name
//                         </label>

//                         <input
//                             id="role-name"
//                             value={name}
//                             onChange={(event) => setName(event.target.value)}
//                             placeholder="e.g. Investigation Manager"
//                             autoFocus
//                             className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#95298E] focus:ring-2 focus:ring-[#95298E]/10"
//                         />
//                     </div>

//                     {createRole.isError && (
//                         <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
//                             {createRole.error instanceof Error
//                                 ? createRole.error.message
//                                 : 'Failed to create role.'}
//                         </p>
//                     )}

//                     <DialogFooter>
//                         <button
//                             type="button"
//                             onClick={() => onOpenChange(false)}
//                             className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={!name.trim() || createRole.isPending}
//                             className="rounded-lg bg-[#95298E] px-4 py-2 text-sm font-medium text-white hover:bg-[#7A1F73] disabled:cursor-not-allowed disabled:opacity-50"
//                         >
//                             {createRole.isPending ? 'Creating...' : 'Create Role'}
//                         </button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// };