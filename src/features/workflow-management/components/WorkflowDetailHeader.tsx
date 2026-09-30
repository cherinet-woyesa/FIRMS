import React from 'react';
import { WorkflowDefinition, WorkflowVersion } from '../types';
import { Settings, Clock } from 'lucide-react';

interface WorkflowDetailHeaderProps {
    definition: WorkflowDefinition;
    versions: WorkflowVersion[] | undefined;
    selectedVersionId: string | null;
    onSelectVersion: (id: string) => void;
    isLoadingVersions: boolean;
    onCreateDraft: () => void;
    isCreatingDraft: boolean;
    onToggleActiveVersion?: () => void;
    isUpdatingVersion?: boolean;
}

export const WorkflowDetailHeader: React.FC<WorkflowDetailHeaderProps> = ({
    definition,
    versions,
    selectedVersionId,
    onSelectVersion,
    isLoadingVersions,
    onCreateDraft,
    isCreatingDraft,
    onToggleActiveVersion,
    isUpdatingVersion
}) => {
    const selectedVersion = versions?.find(v => v.id === selectedVersionId);

    return (
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm flex-shrink-0">
            <div className="flex justify-between items-start">
                <div className="max-w-2xl">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-2xl font-bold text-gray-900">{definition.name}</h1>
                        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                            {definition.code}
                        </span>
                    </div>
                    {definition.description ? (
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{definition.description}</p>
                    ) : (
                        <p className="text-sm text-gray-400 mt-2 italic">No description provided.</p>
                    )}
                </div>
                
                <div className="flex items-center space-x-4">
                    {/* Version Dropdown */}
                    <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                        <Clock className="w-4 h-4 text-gray-400 ml-1" />
                        {isLoadingVersions ? (
                            <div className="h-7 w-28 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                            <select 
                                value={selectedVersionId || ''}
                                onChange={(e) => onSelectVersion(e.target.value)}
                                className="h-7 border-none bg-transparent text-sm font-medium focus:ring-0 text-gray-700 cursor-pointer pr-8"
                            >
                                {versions?.map(v => (
                                    <option key={v.id} value={v.id}>
                                        v{v.versionNumber}.0 {v.isActive ? '(Active)' : '(Draft)'}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    
                    {/* Action Buttons */}
                    {selectedVersion && (
                        <button 
                            onClick={onToggleActiveVersion}
                            disabled={isUpdatingVersion}
                            className={`flex items-center space-x-1 border text-sm font-medium py-1.5 px-3 rounded-md transition-colors shadow-sm disabled:opacity-50
                                ${selectedVersion.isActive 
                                    ? 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50' 
                                    : 'border-transparent text-white bg-emerald-600 hover:bg-emerald-700'
                                }`}
                        >
                            {isUpdatingVersion ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Updating...
                                </span>
                            ) : (
                                <span>{selectedVersion.isActive ? 'Deactivate' : 'Publish Version'}</span>
                            )}
                        </button>
                    )}

                    <button 
                        onClick={onCreateDraft}
                        disabled={isCreatingDraft}
                        className="flex items-center space-x-1 border border-gray-300 hover:border-[#95298E] hover:text-[#95298E] bg-white text-gray-700 text-sm font-medium py-1.5 px-3 rounded-md transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isCreatingDraft ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Creating...
                            </span>
                        ) : (
                            <span>Create Draft</span>
                        )}
                    </button>
                    
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-200 rounded-md transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
