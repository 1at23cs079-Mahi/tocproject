'use client';

import React, { useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { generateDFAVisualization } from '@/core/lexer/visualization';
import { DFASimulator } from '@/core/dfa/dfaSimulator';
import { dfa } from '@/core/dfa/dfaModel';
import { Zap, RotateCcw } from 'lucide-react';

interface DfaVisualizerProps {
  input?: string;
}

const DfaVisualizer: React.FC<DfaVisualizerProps> = ({ input }) => {
  const { nodes: dfaNodes, edges: dfaEdges } = generateDFAVisualization();
  const [selectedState, setSelectedState] = useState<string | null>('START');
  const [visitedStates, setVisitedStates] = useState<Set<string>>(new Set(['START']));

  // Update visited states when input changes
  useEffect(() => {
    if (input && input.trim()) {
      const simulator = new DFASimulator(dfa);
      simulator.initialize(input);
      
      const visited = new Set<string>();
      visited.add('START');
      
      // Run simulation to get all visited states
      while (simulator.step()) {
        const steps = simulator.getSteps();
        const lastStep = steps[steps.length - 1];
        if (lastStep) {
          visited.add(lastStep.currentState);
        }
      }
      
      setVisitedStates(visited);
    } else {
      setVisitedStates(new Set(['START']));
    }
  }, [input]);

  // Better positioning for circular layout
  const getCircularPosition = (index: number, total: number) => {
    const radius = 280;
    const angle = (index / total) * 2 * Math.PI;
    return {
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
    };
  };

  // Convert DFA nodes to ReactFlow nodes with circular layout
  const nodes: Node[] = useMemo(
    () =>
      dfaNodes.map((node, index) => {
        const isSelected = selectedState === node.id;
        const isStart = node.isStart;
        const isAccepting = node.isAccepting;
        const isError = node.id === 'ERROR';
        const isVisited = visitedStates.has(node.id);
        
        let bgColor = '#6366f1'; // Default indigo
        if (isStart) bgColor = '#0ea5e9'; // Blue
        else if (isError) bgColor = '#ef4444'; // Red
        else if (isAccepting) bgColor = '#10b981'; // Green
        
        // Reduce opacity if not visited (when input is provided)
        const opacity = input && !isVisited ? 0.4 : 1;
        
        return {
          id: node.id,
          type: 'default',
          data: {
            label: (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-white font-bold text-xs px-2">{node.label}</span>
              </div>
            ),
          },
          position: getCircularPosition(index, dfaNodes.length),
          style: {
            background: bgColor,
            color: 'white',
            border: isSelected ? '4px solid #fbbf24' : '3px solid white',
            borderRadius: '50%',
            width: isAccepting ? 90 : 80,
            height: isAccepting ? 90 : 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 'bold',
            boxShadow: isSelected 
              ? '0 0 20px rgba(251, 191, 36, 0.8), 0 4px 15px rgba(0,0,0,0.3)'
              : '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            padding: '8px',
            outline: isAccepting ? `3px solid ${bgColor}` : 'none',
            outlineOffset: '3px',
            opacity: opacity,
          },
        };
      }),
    [dfaNodes, selectedState, input, visitedStates]
  );

  // Enhanced edges with better styling
  const edges: Edge[] = useMemo(
    () =>
      dfaEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'smoothstep',
        animated: selectedState === edge.source || selectedState === edge.target,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 30,
          height: 30,
          color: selectedState === edge.source ? '#0ea5e9' : '#9ca3af',
        },
        style: {
          stroke: selectedState === edge.source ? '#0ea5e9' : '#d1d5db',
          strokeWidth: selectedState === edge.source ? 3 : 2,
          transition: 'all 0.3s ease',
        },
        labelStyle: {
          fill: '#1f2937',
          fontWeight: 700,
          fontSize: 12,
          backgroundColor: '#ffffff',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.95,
          stroke: '#e5e7eb',
          strokeWidth: 1,
        },
      })),
    [dfaEdges, selectedState]
  );

  const handleNodeClick = (nodeId: string) => {
    setSelectedState(nodeId);
  };

  const handleReset = () => {
    setSelectedState('START');
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              DFA State Machine
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Click states to highlight transitions
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-white rounded-lg transition-colors"
            title="Reset visualization"
          >
            <RotateCcw className="w-4 h-4 text-gray-600 hover:text-blue-600" />
          </button>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 min-h-0 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1, minZoom: 0.5 }}
          attributionPosition="bottom-right"
          onNodeClick={(event, node) => handleNodeClick(node.id)}
          minZoom={0.3}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Background variant={BackgroundVariant.Dots} gap={30} size={1.5} color="#e5e7eb" />
          <Controls position="top-left" />
        </ReactFlow>
      </div>

      {/* Legend and Info */}
      <div className="border-t border-gray-200 bg-gray-50 p-3">
        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-white shadow-md"></div>
            <span className="text-xs font-medium text-gray-700">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-white shadow-md"></div>
            <span className="text-xs font-medium text-gray-700">Accepting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-white shadow-md"></div>
            <span className="text-xs font-medium text-gray-700">Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 border-2 border-white shadow-md"></div>
            <span className="text-xs font-medium text-gray-700">Error</span>
          </div>
        </div>

        {/* Current State Info */}
        {selectedState && (
          <div className="bg-white border border-gray-200 rounded p-2 text-xs mb-2">
            <span className="font-semibold text-gray-800">{selectedState}</span>
            <span className="text-gray-600 ml-2">
              {selectedState === 'START' && '→ Initial state'}
              {selectedState === 'IN_IDENTIFIER' && '→ Processing identifier/keyword'}
              {selectedState === 'IN_NUMBER' && '→ Processing integer'}
              {selectedState === 'IN_FLOAT' && '→ Processing float'}
              {selectedState === 'IN_STRING' && '→ Processing string literal'}
              {selectedState === 'IN_OPERATOR' && '→ Processing operator'}
              {selectedState === 'IN_COMMENT' && '→ Processing comment'}
              {selectedState === 'WHITESPACE' && '→ Processing whitespace'}
              {selectedState === 'PUNCTUATION' && '→ Punctuation character'}
              {selectedState === 'ERROR' && '→ Invalid input'}
            </span>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-white border border-gray-200 rounded p-2 text-center">
            <div className="font-bold text-gray-800">10</div>
            <div className="text-xs text-gray-600">States</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-2 text-center">
            <div className="font-bold text-gray-800">{edges.length}</div>
            <div className="text-xs text-gray-600">Transitions</div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-2 text-center">
            <div className="font-bold text-gray-800">O(n)</div>
            <div className="text-xs text-gray-600">Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DfaVisualizer;
