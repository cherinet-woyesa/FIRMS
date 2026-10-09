import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { Play, CheckSquare, MessageSquare, UserPlus, CornerDownRight } from 'lucide-react';

export const CustomTransitionEdge: React.FC<EdgeProps> = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 24, // Smoother corners
    });

    const actionName = data?.actionName as string;
    const requiresComment = data?.requiresComment as boolean;
    const requiresApproval = data?.requiresApproval as boolean;
    const requiresAssignment = data?.requiresAssignment as boolean;

    // Detect if this is a backward edge (target is to the left of source)
    const isBackward = targetX < sourceX;

    const strokeColor = isBackward ? '#4f46e5' : '#95298E';

    return (
        <>
            <BaseEdge 
                path={edgePath} 
                markerEnd={markerEnd} 
                style={{ 
                    ...style, 
                    strokeWidth: 1.5, 
                    stroke: strokeColor,
                    strokeDasharray: isBackward ? '5,5' : 'none' 
                }} 
            />
            
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                        zIndex: isHovered ? 50 : 10,
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative">
                        <button 
                            className={`bg-white border text-xs font-medium px-3 py-1.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer
                                ${isBackward ? 'border-indigo-200 text-indigo-700' : 'border-purple-200 text-[#95298E]'}
                                hover:shadow-md hover:scale-105`}
                        >
                            {isBackward ? (
                                <CornerDownRight className="w-3 h-3 scale-x-[-1]" />
                            ) : (
                                <Play className="w-3 h-3 fill-current" />
                            )}
                            {actionName}
                        </button>

                        {isHovered && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 p-3 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action Rules</span>
                                </div>
                                
                                {requiresComment && (
                                    <div className="flex items-center gap-2 text-[11px] text-gray-700 bg-gray-50 px-2 py-1.5 rounded">
                                        <MessageSquare className="w-3 h-3 text-[#95298E]" /> Requires Comment
                                    </div>
                                )}
                                {requiresApproval && (
                                    <div className="flex items-center gap-2 text-[11px] text-gray-700 bg-gray-50 px-2 py-1.5 rounded">
                                        <CheckSquare className="w-3 h-3 text-[#95298E]" /> Requires Approval
                                    </div>
                                )}
                                {requiresAssignment && (
                                    <div className="flex items-center gap-2 text-[11px] text-gray-700 bg-gray-50 px-2 py-1.5 rounded">
                                        <UserPlus className="w-3 h-3 text-[#95298E]" /> Requires Assignment
                                    </div>
                                )}
                                {!requiresComment && !requiresApproval && !requiresAssignment && (
                                    <span className="text-[10px] text-gray-500 italic">No special rules configured.</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </EdgeLabelRenderer>
        </>
    );
};
