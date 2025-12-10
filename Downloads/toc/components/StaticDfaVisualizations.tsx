'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  BackgroundVariant,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { generateDFAVisualization } from '@/core/lexer/visualization';
import { DFASimulator } from '@/core/dfa/dfaSimulator';
import { dfa } from '@/core/dfa/dfaModel';

interface StaticVisualizationProps {
  title: string;
  code: string;
  description: string;
}

const StaticDfaVisualization: React.FC<StaticVisualizationProps> = ({
  title,
  code,
  description,
}) => {
  const { nodes: dfaNodes, edges: dfaEdges } = generateDFAVisualization();

  // Get visited states from simulation
  const visitedStates = useMemo(() => {
    const simulator = new DFASimulator(dfa);
    simulator.initialize(code);

    const visited = new Set<string>();
    visited.add('START');

    while (simulator.step()) {
      const steps = simulator.getSteps();
      const lastStep = steps[steps.length - 1];
      if (lastStep) {
        visited.add(lastStep.currentState);
      }
    }

    return visited;
  }, [code]);

  const getCircularPosition = (index: number, total: number) => {
    const radius = 140;
    const angle = (index / total) * 2 * Math.PI;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle),
    };
  };

  const nodes: Node[] = useMemo(
    () =>
      dfaNodes.map((node, index) => {
        const isStart = node.isStart;
        const isAccepting = node.isAccepting;
        const isError = node.id === 'ERROR';
        const isVisited = visitedStates.has(node.id);

        let bgColor = '#6366f1'; // Default indigo
        if (isStart) bgColor = '#0ea5e9'; // Blue
        else if (isError) bgColor = '#ef4444'; // Red
        else if (isAccepting) bgColor = '#10b981'; // Green

        const opacity = isVisited ? 1 : 0.3;

        return {
          id: node.id,
          type: 'default',
          data: {
            label: (
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-white font-bold text-xs">{node.label}</span>
              </div>
            ),
          },
          position: getCircularPosition(index, dfaNodes.length),
          style: {
            background: bgColor,
            color: 'white',
            border: '3px solid white',
            borderRadius: '50%',
            width: isAccepting ? 55 : 50,
            height: isAccepting ? 55 : 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            padding: '4px',
            outline: isAccepting ? `2px solid ${bgColor}` : 'none',
            outlineOffset: '2px',
            opacity: opacity,
          },
        };
      }),
    [dfaNodes, visitedStates]
  );

  const reactFlowEdges: Edge[] = useMemo(
    () =>
      dfaEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#9ca3af',
        },
        style: {
          stroke: '#d1d5db',
          strokeWidth: 1.5,
        },
        labelStyle: {
          fill: '#1f2937',
          fontWeight: 500,
          fontSize: 9,
          backgroundColor: '#ffffff',
          padding: '2px 4px',
          borderRadius: '2px',
        },
      })),
    [dfaEdges]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>

      {/* Code snippet */}
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
        <code className="text-xs text-gray-700 line-clamp-2 font-mono">
          {code.substring(0, 60)}
          {code.length > 60 ? '...' : ''}
        </code>
      </div>

      {/* Visualization */}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={reactFlowEdges}
          fitView
          fitViewOptions={{ padding: 0.1, maxZoom: 1, minZoom: 0.5 }}
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
        </ReactFlow>
      </div>

      {/* Stats */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 grid grid-cols-3 gap-1">
        <div className="text-center">
          <div className="text-xs font-bold text-gray-800">{visitedStates.size}</div>
          <div className="text-xs text-gray-600">States</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-gray-800">{code.length}</div>
          <div className="text-xs text-gray-600">Chars</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-gray-800">
            {visitedStates.has('ERROR') ? 'ERROR' : 'OK'}
          </div>
          <div className="text-xs text-gray-600">Status</div>
        </div>
      </div>
    </div>
  );
};

interface StaticDfaVisualizationsProps {
  className?: string;
}

const StaticDfaVisualizations: React.FC<StaticDfaVisualizationsProps> = ({
  className = '',
}) => {
  const samples = [
    {
      title: 'Simple Number',
      code: '42',
      description: 'Integer literal tokenization',
    },
    {
      title: 'Identifier & Operator',
      code: 'x = 10',
      description: 'Variable assignment with operator',
    },
    {
      title: 'String Literal',
      code: '"hello world"',
      description: 'String tokenization with quotes',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {samples.map((sample, idx) => (
        <StaticDfaVisualization
          key={idx}
          title={sample.title}
          code={sample.code}
          description={sample.description}
        />
      ))}
    </div>
  );
};

export default StaticDfaVisualizations;
