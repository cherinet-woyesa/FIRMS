import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2, Workflow, Shield, Settings2 } from 'lucide-react';
import { WorkflowStage, WorkflowVersion } from '../types';
import { useUpdateWorkflowStage } from '../api';

const editStageSchema = z.object({
    name: z.string().min(2, "Name is required").max(200),
    description: z.string().max(1000).optional(),
    displayOrder: z.number().min(1),
    isInitial: z.boolean(),
    isFinal: z.boolean(),
});

type EditStageFormValues = z.infer<typeof editStageSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    stage: WorkflowStage | null;
}

export const EditStageSlideOver: React.FC<Props> = ({ isOpen, onClose, stage }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'rules' | 'advanced'>('details');
    const { mutate: updateStage, isPending } = useUpdateWorkflowStage();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<EditStageFormValues>({
        resolver: zodResolver(editStageSchema),
        defaultValues: {
            name: '',
            description: '',
            displayOrder: 1,
            isInitial: false,
            isFinal: false,
        }
    });

    useEffect(() => {
        if (stage && isOpen) {
            reset({
                name: stage.name,
                description: stage.description || '',
                displayOrder: stage.displayOrder,
                isInitial: stage.isInitial,
                isFinal: stage.isFinal,
            });
            setActiveTab('details');
        }
    }, [stage, isOpen, reset]);

    if (!isOpen || !stage) return null;

    const onSubmit = (data: EditStageFormValues) => {
        updateStage(
            { id: stage.id, dto: data },
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (err: any) => {
                    alert(err.message || 'Failed to update stage');
                }
            }
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />

            {/* Slide-over panel */}
            <div className="fixed inset-y-0 right-0 z-50 w-[450px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-[#95298E] shadow-sm">
                                <Workflow className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Edit Stage Node</h2>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {stage.code}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-200 mt-2">
                        <button 
                            onClick={() => setActiveTab('details')}
                            className={`text-sm font-semibold pb-2 transition-colors ${activeTab === 'details' ? 'text-[#95298E] border-b-2 border-[#95298E]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Details
                        </button>
                        <button 
                            onClick={() => setActiveTab('rules')}
                            className={`text-sm font-semibold pb-2 transition-colors ${activeTab === 'rules' ? 'text-[#95298E] border-b-2 border-[#95298E]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Rules & Actions
                        </button>
                        <button 
                            onClick={() => setActiveTab('advanced')}
                            className={`text-sm font-semibold pb-2 transition-colors ${activeTab === 'advanced' ? 'text-[#95298E] border-b-2 border-[#95298E]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Advanced
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {activeTab === 'details' && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Name</label>
                                    <input 
                                        type="text" 
                                        {...register('name')}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#95298E] focus:ring-[#95298E] sm:text-sm" 
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stage Code</label>
                                    <input 
                                        type="text" 
                                        value={stage.code}
                                        disabled
                                        className="w-full border-gray-200 bg-gray-100 text-gray-500 rounded-md shadow-sm sm:text-sm cursor-not-allowed" 
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Stage codes cannot be changed after creation.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                    <textarea 
                                        {...register('description')}
                                        rows={4} 
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#95298E] focus:ring-[#95298E] sm:text-sm" 
                                    />
                                </div>

                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="flex items-center">
                                        <Shield className="w-5 h-5 text-[#95298E] mr-2" />
                                        <h3 className="text-sm font-bold text-gray-900">Visibility (Coming Soon)</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        Assignee groups and role-based visibility are pending backend architecture implementation.
                                    </p>
                                    <select disabled className="w-full mt-3 text-sm border-gray-300 bg-gray-100 text-gray-400 rounded-md shadow-sm cursor-not-allowed">
                                        <option>Select an Assignee Group...</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === 'rules' && (
                            <div className="flex flex-col items-center justify-center h-48 text-center animate-in fade-in duration-200">
                                <Settings2 className="w-10 h-10 text-gray-300 mb-3" />
                                <h3 className="text-sm font-bold text-gray-900">Rules & Actions</h3>
                                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                    Manage transition rules directly from the Map Action Modal on the Timeline view.
                                </p>
                            </div>
                        )}

                        {activeTab === 'advanced' && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Order</label>
                                    <input 
                                        type="number" 
                                        {...register('displayOrder', { valueAsNumber: true })}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#95298E] focus:ring-[#95298E] sm:text-sm" 
                                    />
                                </div>

                                <div className="space-y-3 pt-2">
                                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                        <input 
                                            type="checkbox" 
                                            {...register('isInitial')}
                                            className="h-4 w-4 text-[#95298E] focus:ring-[#95298E] border-gray-300 rounded" 
                                        />
                                        <div className="ml-3">
                                            <span className="block text-sm font-medium text-gray-900">Initial Stage</span>
                                            <span className="block text-xs text-gray-500">Cases enter the workflow here.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                        <input 
                                            type="checkbox" 
                                            {...register('isFinal')}
                                            className="h-4 w-4 text-[#95298E] focus:ring-[#95298E] border-gray-300 rounded" 
                                        />
                                        <div className="ml-3">
                                            <span className="block text-sm font-medium text-gray-900">Final Stage</span>
                                            <span className="block text-xs text-gray-500">Cases reaching this stage are closed.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#95298E] hover:bg-[#7a2274] rounded-md shadow-sm transition-colors disabled:opacity-50 min-w-[120px]"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};
