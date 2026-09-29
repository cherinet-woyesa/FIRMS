import React from 'react';
import { WorkflowStage } from '../types';
import { PlayCircle, StopCircle, Trash2, CheckSquare } from 'lucide-react';
import { TransitionList } from './TransitionList';

interface StageNodeProps {
    stage: WorkflowStage;
    isVersionLocked: boolean;
    index: number;
}

export const StageNode: React.FC<StageNodeProps> = ({ stage, isVersionLocked, index }) => {
    return (
        <div className="relative flex items-start gap-6 group transition-all duration-300">
            {/* Timeline Node */}
            <div className="flex flex-col items-center z-10 shrink-0 mt-1.5">
                <div className="w-[58px] h-[58px] rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-lg font-black text-[#95298E] group-hover:border-[#95298E] group-hover:shadow-md transition-all">
                    {stage.displayOrder || index + 1}
                </div>
            </div>

            {/* Stage Content Card */}
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {stage.name}
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 tracking-wider">
                                {stage.code}
                            </span>
                            
                            {stage.isInitial && (
                                <span className="flex items-center text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                                    <PlayCircle className="w-3 h-3 mr-1" /> Initial
                                </span>
                            )}
                            {stage.isFinal && (
                                <span className="flex items-center text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                                    <StopCircle className="w-3 h-3 mr-1" /> Final
                                </span>
                            )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {stage.description || <span className="italic text-gray-400">No description provided</span>}
                        </p>
                    </div>

                    {!isVersionLocked && (
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 hover:text-[#95298E] transition-colors">
                                Edit Stage
                            </button>
                            <button className="p-1.5 text-gray-400 bg-white border border-gray-200 rounded hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    {/* Left Column: Stage Config Summary */}
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                            <CheckSquare className="w-3.5 h-3.5" /> Stage Properties
                        </h4>
                        <div className="space-y-2.5">
                            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/50 border border-gray-100">
                                <div>
                                    <div className="text-[13px] font-bold text-gray-900">Visibility</div>
                                    <div className="text-[11px] text-gray-500">Visible to all assigned users</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Routing Matrix */}
                    <div>
                        <TransitionList stageId={stage.id} isVersionLocked={isVersionLocked} />
                    </div>
                </div>
            </div>
        </div>
    );
};
