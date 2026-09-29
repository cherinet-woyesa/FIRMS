import React, { useState, useEffect } from 'react';
import { useWorkflowDefinitions, useWorkflowVersions } from '../api';
import { WorkflowSidebar } from '../components/WorkflowSidebar';
import { WorkflowDetailHeader } from '../components/WorkflowDetailHeader';
import { StageList } from '../components/StageList';

const WorkflowPortalPage: React.FC = () => {
    // Top-level state
    const [selectedDefId, setSelectedDefId] = useState<string | null>(null);
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

    // Queries
    const { data: definitions, isLoading: loadingDefs } = useWorkflowDefinitions();
    const { data: versions, isLoading: loadingVersions } = useWorkflowVersions(selectedDefId);

    // Auto-select first definition on load
    useEffect(() => {
        if (definitions && definitions.length > 0 && !selectedDefId) {
            setSelectedDefId(definitions[0].id);
        }
    }, [definitions, selectedDefId]);

    // Auto-select active version (or first) when a definition is selected
    useEffect(() => {
        if (versions && versions.length > 0) {
            const activeVersion = versions.find(v => v.isActive);
            setSelectedVersionId(activeVersion ? activeVersion.id : versions[0].id);
        } else {
            setSelectedVersionId(null);
        }
    }, [versions, selectedDefId]);

    // Derived selected entities
    const selectedDef = definitions?.find(d => d.id === selectedDefId);
    const selectedVersion = versions?.find(v => v.id === selectedVersionId);

    if (loadingDefs) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#95298E] mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading Workflow Portal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans text-gray-900 overflow-hidden border-t-0">
            {/* Master List Sidebar */}
            <WorkflowSidebar 
                definitions={definitions}
                selectedDefId={selectedDefId}
                onSelectDef={setSelectedDefId}
            />

            {/* Detail Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">
                {selectedDef ? (
                    <>
                        {/* Detail Header */}
                        <WorkflowDetailHeader 
                            definition={selectedDef}
                            versions={versions}
                            selectedVersionId={selectedVersionId}
                            onSelectVersion={setSelectedVersionId}
                            isLoadingVersions={loadingVersions}
                        />

                        {/* Main Canvas Area */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="max-w-4xl mx-auto">
                                {selectedVersion ? (
                                    <StageList version={selectedVersion} />
                                ) : (
                                    <div className="text-center py-16 bg-white border border-gray-200 border-dashed rounded-lg shadow-sm">
                                        <p className="text-gray-500 mb-4">No versions exist for this workflow.</p>
                                        <button className="bg-[#95298E] hover:bg-[#7a2274] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                                            Create Initial Version
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center">
                            <span className="text-gray-300 text-2xl">+</span>
                        </div>
                        <p>Select a workflow definition from the sidebar to view details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkflowPortalPage;
