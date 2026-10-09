import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { WorkflowStage } from '../types';
import { useCreateWorkflowTransition } from '../api';
import { useGetPermissions } from '../../accessManagement/api/permissions/getPermissions';

const schema = z.object({
    toStageId: z.string().min(1, 'Destination stage is required'),
    actionName: z.string().min(2, 'Action Name is required').max(200),
    actionCode: z.string().min(2, 'Action Code is required').max(100),
    description: z.string().max(1000).optional(),
    requiredPermission: z.string().max(150).optional(),
    requiresComment: z.boolean().default(false),
    requiresApproval: z.boolean().default(false),
    requiresAssignment: z.boolean().default(false),
    slaHours: z.number().min(0).optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    fromStage: WorkflowStage;
    allStages: WorkflowStage[];
    versionId: string;
}

export const MapActionModal: React.FC<Props> = ({ isOpen, onClose, fromStage, allStages, versionId }) => {
    const { mutate, isPending } = useCreateWorkflowTransition();
    const { data: permissions } = useGetPermissions();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            requiresComment: false,
            requiresApproval: false,
            requiresAssignment: false
        }
    });

    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const availableDestinations = allStages.filter(s => s.id !== fromStage.id);

    const onSubmit = (data: FormData) => {
        const payload = {
            ...data,
            workflowVersionId: versionId,
            fromStageId: fromStage.id,
            slaHours: data.slaHours === '' ? undefined : Number(data.slaHours),
            isActive: true
        };

        mutate(payload, {
            onSuccess: () => onClose(),
            onError: (err: any) => alert(err.message || 'Failed to create transition')
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Map Routing Rule</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Define an outgoing action from <strong>{fromStage.name}</strong></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit as any)} className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Destination Stage</label>
                            <select
                                {...register('toStageId')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm"
                            >
                                <option value="">Select a destination...</option>
                                {availableDestinations.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                                ))}
                            </select>
                            {errors.toStageId && <p className="mt-1 text-xs text-rose-500">{errors.toStageId.message}</p>}
                            {availableDestinations.length === 0 && (
                                <p className="mt-1 text-xs text-amber-600">You must create other stages first before you can map a transition.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Action Name</label>
                            <input
                                {...register('actionName')}
                                type="text"
                                placeholder="e.g. Approve & Forward"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm"
                            />
                            {errors.actionName && <p className="mt-1 text-xs text-rose-500">{errors.actionName.message}</p>}
                            <p className="mt-1 text-[11px] text-gray-500">The button text shown to the end-user.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Action Code</label>
                            <input
                                {...register('actionCode')}
                                type="text"
                                placeholder="e.g. APPROVE_FWD"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm uppercase"
                            />
                            {errors.actionCode && <p className="mt-1 text-xs text-rose-500">{errors.actionCode.message}</p>}
                        </div>

                        <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Transition Rules</h4>
                            <div className="space-y-4">
                                <label className="flex items-start space-x-3 cursor-pointer group">
                                    <input type="checkbox" {...register('requiresComment')} className="mt-0.5 w-4 h-4 text-[#95298E] border-gray-300 rounded focus:ring-[#95298E]" />
                                    <div>
                                        <span className="text-sm font-bold text-gray-700">Requires Comment</span>
                                        <span className="text-[11px] text-gray-500 block">User must provide a justification or note when taking this action.</span>
                                    </div>
                                </label>

                                <label className="flex items-start space-x-3 cursor-pointer group">
                                    <input type="checkbox" {...register('requiresApproval')} className="mt-0.5 w-4 h-4 text-[#95298E] border-gray-300 rounded focus:ring-[#95298E]" />
                                    <div>
                                        <span className="text-sm font-bold text-gray-700">Requires Maker-Checker Approval</span>
                                        <span className="text-[11px] text-gray-500 block">This action will be pending until a secondary user approves it.</span>
                                    </div>
                                </label>

                                <label className="flex items-start space-x-3 cursor-pointer group">
                                    <input type="checkbox" {...register('requiresAssignment')} className="mt-0.5 w-4 h-4 text-[#95298E] border-gray-300 rounded focus:ring-[#95298E]" />
                                    <div>
                                        <span className="text-sm font-bold text-gray-700">Requires User Assignment</span>
                                        <span className="text-[11px] text-gray-500 block">User must explicitly assign the case to a specific investigator in the next stage.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Required Permission</label>
                            <select
                                {...register('requiredPermission')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm"
                            >
                                <option value="">None (Anyone assigned can execute)</option>
                                {permissions?.map(p => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                            <p className="mt-1 text-[11px] text-gray-500">User must possess this explicit permission to see this action.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">SLA Hours (Limit)</label>
                            <input
                                {...register('slaHours', { valueAsNumber: true })}
                                type="number"
                                placeholder="e.g. 48"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm"
                            />
                            <p className="mt-1 text-[11px] text-gray-500">Time expected to complete the destination stage.</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={isPending || availableDestinations.length === 0} className="px-4 py-2 text-sm font-bold text-white bg-[#95298E] rounded-lg hover:bg-purple-800 flex items-center min-w-[120px] justify-center disabled:bg-gray-300">
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Rule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
