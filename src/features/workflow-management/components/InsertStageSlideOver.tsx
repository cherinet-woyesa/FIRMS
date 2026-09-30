import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { useCreateWorkflowStage } from '../api';

const schema = z.object({
    code: z.string().min(2, 'Code is required').max(100),
    name: z.string().min(3, 'Name is required').max(200),
    description: z.string().max(1000).optional(),
    isInitial: z.boolean().default(false),
    isFinal: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    versionId: string;
    nextDisplayOrder: number;
}

export const InsertStageSlideOver: React.FC<Props> = ({ isOpen, onClose, versionId, nextDisplayOrder }) => {
    const { mutate, isPending } = useCreateWorkflowStage();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            isInitial: false,
            isFinal: false
        }
    });

    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const onSubmit = (data: FormData) => {
        mutate(
            {
                ...data,
                workflowVersionId: versionId,
                displayOrder: nextDisplayOrder
            },
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (err: any) => {
                    alert(err.message || 'Failed to create workflow stage');
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
                <div className="w-full h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Insert Pipeline Stage</h2>
                            <p className="text-xs text-gray-500 mt-1">Add a new sequential step to your workflow.</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Stage Name
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="e.g. Initial Review"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm"
                            />
                            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Stage Code
                            </label>
                            <input
                                {...register('code')}
                                type="text"
                                placeholder="e.g. INITIAL_REVIEW"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm uppercase"
                            />
                            {errors.code && <p className="mt-1 text-xs text-rose-500">{errors.code.message}</p>}
                            <p className="mt-1 text-[11px] text-gray-500">A unique uppercase identifier without spaces.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Description <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                placeholder="What happens in this stage..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm resize-none"
                            />
                            {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Stage Properties</h4>
                            
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        {...register('isInitial')}
                                        className="w-4 h-4 text-[#95298E] border-gray-300 rounded focus:ring-[#95298E]"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">Mark as Initial Stage</span>
                                    <span className="text-[11px] text-gray-500 leading-relaxed">Cases will enter the workflow at this stage. Only one initial stage is allowed.</span>
                                </div>
                            </label>

                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        {...register('isFinal')}
                                        className="w-4 h-4 text-[#95298E] border-gray-300 rounded focus:ring-[#95298E]"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">Mark as Final Stage</span>
                                    <span className="text-[11px] text-gray-500 leading-relaxed">The workflow terminates when a case reaches this stage.</span>
                                </div>
                            </label>
                        </div>
                    </form>

                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isPending}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#95298E] rounded-lg hover:bg-purple-800 transition-colors flex items-center justify-center min-w-[140px]"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Pipeline Stage'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
