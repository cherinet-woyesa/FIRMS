import React from 'react';
import { WorkflowDefinition } from '../types';
import { Plus } from 'lucide-react';

interface WorkflowSidebarProps {
    definitions: WorkflowDefinition[] | undefined;
    selectedDefId: string | null;
    onSelectDef: (id: string) => void;
}

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ 
    definitions, 
    selectedDefId, 
    onSelectDef 
}) => {
    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 flex-shrink-0">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">Workflows</h2>
            </div>
            
            <div className="p-4 border-b border-gray-100">
                <button className="w-full flex items-center justify-center space-x-2 bg-[#95298E] hover:bg-[#7a2274] text-white py-2 px-4 rounded-md transition-colors text-sm font-medium shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>New Workflow</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {definitions?.map(def => {
                    const isSelected = selectedDefId === def.id;
                    return (
                        <button
                            key={def.id}
                            onClick={() => onSelectDef(def.id)}
                            className={`w-full text-left p-4 border-b border-gray-100 transition-colors flex flex-col ${
                                isSelected 
                                    ? 'bg-[#fbf6fd] border-l-4 border-l-[#95298E]' 
                                    : 'border-l-4 border-l-transparent hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex justify-between items-start w-full">
                                <span className={`font-medium text-sm ${isSelected ? 'text-[#95298E]' : 'text-gray-900'}`}>
                                    {def.name}
                                </span>
                                {def.isActive && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" title="Active"></span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 font-mono">{def.code}</div>
                        </button>
                    );
                })}
                
                {(!definitions || definitions.length === 0) && (
                    <div className="p-6 text-center text-sm text-gray-500 italic">
                        No workflows found.
                    </div>
                )}
            </div>
        </div>
    );
};
