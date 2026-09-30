import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Users, ChevronRight } from 'lucide-react';

export const CustomStageNode: React.FC<NodeProps> = ({ data, selected, isConnectable }) => {
    const isInitial = data.isInitial as boolean;
    const isFinal = data.isFinal as boolean;
    const name = data.name as string;
    const code = data.code as string;
    const description = (data.description as string) || "Validates data completeness and assigns priority levels."; // mock default for look

    return (
        <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all w-[320px] overflow-hidden group ${selected || isInitial ? 'border-[#95298E]' : 'border-purple-200'}`}>
            {/* Left Handle */}
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-1.5 h-12 bg-transparent border-none left-[-3px]" />

            <div className="p-5 flex flex-col h-full">
                {/* Top Row */}
                <div className="flex justify-between items-center mb-3">
                    {isInitial ? (
                        <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">
                            START
                        </span>
                    ) : isFinal ? (
                        <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">
                            END
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase">
                            STAGE
                        </span>
                    )}
                    
                    <span className="text-[11px] font-mono text-gray-500">
                        {code}
                    </span>
                </div>
                
                {/* Middle Row */}
                <h3 className="text-base font-bold text-gray-900 leading-tight mb-1.5">
                    {name}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6 line-clamp-2">
                    {description}
                </p>

                {/* Bottom Row */}
                <div className="mt-auto flex justify-between items-center pt-2 border-t border-transparent">
                    <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-1.5" />
                        <span className="text-xs font-medium">8 Assignees</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#95298E]" />
                </div>
            </div>

            {/* Right Handle */}
            <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-1.5 h-12 bg-transparent border-none right-[-3px]" />
        </div>
    );
};
