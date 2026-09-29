import React from 'react';
import { useWorkflowTransitions } from '../api';
import { ArrowRight, Loader2, Plus, X, GitMerge } from 'lucide-react';

interface TransitionListProps {
    stageId: string;
    isVersionLocked: boolean;
}

export const TransitionList: React.FC<TransitionListProps> = ({ stageId, isVersionLocked }) => {
    const { data: transitions, isLoading, isError } = useWorkflowTransitions(stageId);

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-[#95298E]" /></div>;
    }

    if (isError) {
        return <div className="p-3 text-sm text-red-500 border border-red-200 bg-red-50 rounded-lg">Failed to load transitions.</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GitMerge className="w-3.5 h-3.5" /> Routing Matrix
                </h4>
                
                {!isVersionLocked && (
                    <button className="flex items-center px-2 py-1 text-[10px] font-bold text-[#95298E] transition-colors bg-[#fbf6fd] rounded hover:bg-purple-100 border border-transparent hover:border-purple-200">
                        <Plus className="w-3 h-3 mr-1" /> Add Rule
                    </button>
                )}
            </div>

            {(!transitions || transitions.length === 0) ? (
                <div className="p-3 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 text-center bg-gray-50/50">
                    No outward actions. Workflow terminates here.
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {transitions.map((t) => {
                        const badgeBaseClasses = "group relative inline-flex flex-col justify-center px-2.5 py-1.5 rounded-md text-[11px] shadow-sm transition-all duration-200 overflow-hidden border bg-purple-50 text-[#95298E] border-purple-200 pr-7";
                        
                        return (
                            <span key={t.id} className={badgeBaseClasses}>
                                <span className="font-bold flex items-center">
                                    <ArrowRight className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                    {t.actionName}
                                </span>
                                <span className="text-[9px] text-gray-500 mt-0.5 ml-5">To: {t.toStageName || t.toStageId.substring(0, 8)}</span>
                                
                                <div className="flex flex-wrap gap-1 mt-1.5 ml-5">
                                    {t.requiresAssignment && <span className="px-1 py-0.5 bg-white rounded-[4px] border border-gray-200 text-[8px] text-gray-600 font-medium">Req. Assignment</span>}
                                    {t.requiresComment && <span className="px-1 py-0.5 bg-white rounded-[4px] border border-gray-200 text-[8px] text-gray-600 font-medium">Req. Comment</span>}
                                </div>

                                {!isVersionLocked && (
                                    <button 
                                        title="Remove routing rule"
                                        className="absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center bg-black/5 hover:bg-rose-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
