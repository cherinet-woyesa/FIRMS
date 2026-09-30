import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { useCreateWorkflowDefinition } from '../api';

const schema = z.object({
    code: z.string().min(2, 'Code is required').max(50),
    name: z.string().min(3, 'Name is required').max(100),
    description: z.string().optional(),
    isActive: z.boolean().default(true)
});

type FormData = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (id: string) => void;
}

export const CreateDefinitionModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
    const { mutate, isPending } = useCreateWorkflowDefinition();
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            isActive: true
        }
    });

    if (!isOpen) return null;

    const onSubmit = (data: FormData) => {
        mutate(data, {
            onSuccess: (newDef) => {
                reset();
                onSuccess(newDef.id);
            },
            onError: (err: any) => {
                alert(err.message || 'Failed to create workflow definition');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Create New Workflow</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isPending}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex-1 overflow-y-auto">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Workflow Name
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="e.g. Whistleblower Investigation"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm"
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Workflow Code
                            </label>
                            <input
                                {...register('code')}
                                type="text"
                                placeholder="e.g. WB-INV-01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm uppercase"
                            />
                            {errors.code && (
                                <p className="mt-1 text-xs text-rose-500">{errors.code.message}</p>
                            )}
                            <p className="mt-1 text-[11px] text-gray-500">A unique short code to identify this workflow.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Description <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                placeholder="Briefly describe the purpose of this workflow..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] text-sm resize-none"
                            ></textarea>
                            {errors.description && (
                                <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
                            )}
                        </div>

                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="w-4 h-4 text-[#95298E] border-gray-300 rounded focus:ring-[#95298E]"
                            />
                            <div>
                                <span className="text-sm font-semibold text-gray-700 block">Active Status</span>
                                <span className="text-[11px] text-gray-500 block">If disabled, this workflow cannot be assigned to new cases.</span>
                            </div>
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#95298E] rounded-lg hover:bg-purple-800 transition-colors flex items-center justify-center min-w-[120px]"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Workflow'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
