import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, Position, MarkerType, useNodesState, useEdgesState, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowVersion } from '../types';
import { useWorkflowStages, useWorkflowTransitionsByVersion } from '../api';
import { Loader2, AlertCircle } from 'lucide-react';
import { CustomStageNode } from './CustomStageNode';
import { CustomTransitionEdge } from './CustomTransitionEdge';
import { EditStageSlideOver } from './EditStageSlideOver';
import dagre from 'dagre';

interface Props {
    version: WorkflowVersion;
}

const nodeTypes = {
    customStage: CustomStageNode
};

const edgeTypes = {
    customTransition: CustomTransitionEdge
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, align: 'UL', nodesep: 80, ranksep: 200 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 320, height: 160 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = direction === 'LR' ? Position.Left : Position.Top;
        node.sourcePosition = direction === 'LR' ? Position.Right : Position.Bottom;
        
        node.position = {
            x: nodeWithPosition.x - 320 / 2,
            y: nodeWithPosition.y - 160 / 2,
        };
        return node;
    });

    return { nodes, edges };
};

export const WorkflowGraphView: React.FC<Props> = ({ version }) => {
    const { data: stages, isLoading: loadingStages, isError: errorStages } = useWorkflowStages(version.id);
    const { data: transitions, isLoading: loadingTransitions, isError: errorTransitions } = useWorkflowTransitionsByVersion(version.id);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    useEffect(() => {
        if (!stages || !transitions) return;

        const initialNodes: Node[] = stages.map((stage) => ({
            id: stage.id,
            type: 'customStage',
            data: { 
                name: stage.name,
                code: stage.code,
                isInitial: stage.isInitial,
                isFinal: stage.isFinal,
                description: stage.description,
            },
            position: { x: 0, y: 0 },
        }));

        const initialEdges: Edge[] = transitions.map((t) => {
            // Determine if backward
            const fromStage = stages.find(s => s.id === t.fromStageId);
            const toStage = stages.find(s => s.id === t.toStageId);
            const isBackward = (fromStage?.displayOrder || 0) > (toStage?.displayOrder || 0);
            
            return {
                id: t.id,
                source: t.fromStageId,
                target: t.toStageId,
                type: 'customTransition',
                data: {
                    actionName: t.actionName,
                    requiresComment: t.requiresComment,
                    requiresApproval: t.requiresApproval,
                    requiresAssignment: t.requiresAssignment,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 15,
                    height: 15,
                    color: isBackward ? '#4f46e5' : '#95298E',
                },
            };
        });

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            initialNodes,
            initialEdges,
            'LR'
        );

        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
    }, [stages, transitions, setNodes, setEdges]);

    const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
        if (version.isActive) {
            // Version is active, do not allow editing
            return;
        }
        setSelectedNodeId(node.id);
    };

    if (loadingStages || loadingTransitions) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50 border border-gray-200 rounded-2xl mx-8 my-4">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#95298E] mb-3" />
                    <span className="text-sm font-medium text-gray-500">Auto-layouting graph...</span>
                </div>
            </div>
        );
    }

    if (errorStages || errorTransitions) {
        return (
            <div className="flex items-center justify-center h-48 m-8 text-red-600 bg-red-50 rounded-2xl border border-red-200">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Failed to load graph data.</span>
            </div>
        );
    }

    if (nodes.length === 0) {
        return (
            <div className="flex h-full items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl mx-8 my-4">
                <div className="text-center text-gray-400">
                    <p className="font-medium text-sm">No stages exist yet.</p>
                    <p className="text-xs mt-1">Switch to Timeline View to insert your first stage.</p>
                </div>
            </div>
        );
    }

    const selectedStage = stages?.find(s => s.id === selectedNodeId);

    return (
        <div className="flex-1 w-full h-full bg-[#F8F9FA] relative shadow-inner overflow-hidden flex">
            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={handleNodeClick}
                    onPaneClick={() => setSelectedNodeId(null)}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    defaultViewport={{ x: 100, y: 100, zoom: 0.85 }}
                    minZoom={0.2}
                    maxZoom={1.5}
                    attributionPosition="bottom-right"
                >
                    <Background gap={32} size={1.5} color="#e9d5ff" />
                    <Controls showInteractive={false} className="bg-white shadow-md border border-gray-100 rounded-lg overflow-hidden" />
                    <MiniMap 
                        nodeColor={(n) => {
                            if (n.data?.isInitial) return '#10b981';
                            if (n.data?.isFinal) return '#3b82f6';
                            return '#e2e8f0';
                        }}
                        maskColor="rgba(248, 249, 250, 0.7)"
                        className="bg-white border border-gray-200 rounded-lg shadow-sm"
                    />
                </ReactFlow>
            </div>

            {/* Edit Slide-over Panel */}
            <EditStageSlideOver 
                isOpen={!!selectedNodeId} 
                onClose={() => setSelectedNodeId(null)} 
                stage={selectedStage || null} 
            />
        </div>
    );
};
