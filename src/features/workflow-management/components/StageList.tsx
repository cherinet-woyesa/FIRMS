import React from 'react';
import { WorkflowVersion } from '../types';
import { useWorkflowStages } from '../api';
import { StageNode } from './StageNode';
import { Lock, AlertCircle, Plus } from 'lucide-react';

interface StageListProps {
    version: WorkflowVersion;
}

export const StageList: React.FC<StageListProps> = ({ version }) => {
    const { data: stages, isLoading, isError } = useWorkflowStages(version.id);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#95298E]"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center p-6 text-red-600 bg-red-50 rounded-lg border border-red-200 mt-6">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Failed to load workflow stages.</span>
            </div>
        );
    }

    const sortedStages = stages ? [...stages].sort((a, b) => a.displayOrder - b.displayOrder) : [];

    return (
        <div className="mt-4 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Active Workflow Pipeline
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Review or modify the sequential stages and routing logic.
                    </p>
                </div>
                <button
                    disabled={version.isActive}
                    className={`px-4 py-2.5 text-[13px] font-bold rounded-lg transition-colors shadow-sm flex items-center
                        ${version.isActive 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#95298E] hover:bg-purple-800 text-white'
                        }`}
                >
                    <Plus className="w-4 h-4 mr-2" /> Insert Pipeline Stage
                </button>
            </div>

            {/* Warning Banner for Active Versions */}
            {version.isActive && (
                <div className="mb-8 p-4 bg-[#fbf6fd] border border-[#e4d3eb] rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#95298E] bg-opacity-10 p-1.5 rounded-full mr-3 flex-shrink-0 mt-0.5">
                        <Lock className="w-4 h-4 text-[#95298E]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">Production Version Locked</h4>
                        <p className="text-xs text-gray-600 mt-1">
                            This workflow version is currently active and routing cases. To edit stages or transitions, create a new draft version.
                        </p>
                    </div>
                </div>
            )}

            {/* Pipeline Timeline */}
            <div className="relative py-4">
                {/* Vertical Line */}
                <div className="absolute top-0 bottom-0 left-[28px] w-[2px] bg-gray-200 rounded-full" />

                <div className="space-y-8 relative">
                    {sortedStages.length === 0 ? (
                        <div className="ml-20 p-8 text-center bg-white border border-gray-200 border-dashed rounded-2xl">
                            <div className="text-gray-400 mb-2 font-medium">No stages defined for this version.</div>
                            {!version.isActive && (
                                <button className="text-[#95298E] hover:underline text-sm font-bold mt-2">
                                    Insert your first stage
                                </button>
                            )}
                        </div>
                    ) : (
                        sortedStages.map((stage, index) => (
                            <StageNode 
                                key={stage.id} 
                                stage={stage} 
                                isVersionLocked={version.isActive}
                                index={index}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
