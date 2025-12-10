'use client';

import React, { useMemo } from 'react';
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
import { AlertTriangle } from 'lucide-react';

interface ErrorVisualizationProps {
  title: string;
  code: string;
  description: string;
}

const ErrorVisualization: React.FC<ErrorVisualizationProps> = ({
  title,
  code,
  description,
}) => {
  const { nodes: dfaNodes, edges: dfaEdges } = generateDFAVisualization();

  // Get simulation results including errors
  const { visitedStates, errorState, errorChar, errorPosition } = useMemo(() => {
    const simulator = new DFASimulator(dfa);
    simulator.initialize(code);

    const visited = new Set<string>();
    visited.add('START');
    let lastErrorState: string | null = null;
    let lastErrorChar: string | null = null;
    let lastErrorPos: number | null = null;

    while (simulator.step()) {
      const steps = simulator.getSteps();
      const lastStep = steps[steps.length - 1];
      if (lastStep) {
        visited.add(lastStep.currentState);
        if (lastStep.currentState === 'ERROR') {
          lastErrorState = 'ERROR';
          lastErrorChar = lastStep.currentChar;
          lastErrorPos = lastStep.inputIndex - 1;
        }
      }
    }

    return {
      visitedStates: visited,
      errorState: lastErrorState,
      errorChar: lastErrorChar,
      errorPosition: lastErrorPos,
    };
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
        const borderColor = isError && errorState ? '#dc2626' : 'white';

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
            border: `3px solid ${borderColor}`,
            borderRadius: '50%',
            width: isAccepting ? 55 : 50,
            height: isAccepting ? 55 : 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 'bold',
            boxShadow: errorState && isError 
              ? '0 0 20px rgba(220, 38, 38, 0.8), 0 4px 15px rgba(0,0,0,0.3)'
              : '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            padding: '4px',
            outline: isAccepting ? `2px solid ${bgColor}` : 'none',
            outlineOffset: '2px',
            opacity: opacity,
          },
        };
      }),
    [dfaNodes, visitedStates, errorState]
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

  const hasError = errorState === 'ERROR';

  return (
    <div className={`bg-white rounded-lg shadow-sm border overflow-hidden h-full flex flex-col ${
      hasError ? 'border-red-300' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-3 border-b ${
        hasError 
          ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
          : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
      }`}>
        <div className="flex items-start gap-2">
          {hasError && <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <h3 className={`text-sm font-bold ${hasError ? 'text-red-800' : 'text-green-800'}`}>
              {title}
            </h3>
            <p className={`text-xs mt-0.5 ${hasError ? 'text-red-700' : 'text-green-700'}`}>
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Code snippet with error highlight */}
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
        <code className="text-xs text-gray-700 font-mono">
          {code.split('').map((char, idx) => (
            <span
              key={idx}
              className={
                hasError && idx === errorPosition
                  ? 'bg-red-300 font-bold'
                  : ''
              }
            >
              {char}
            </span>
          ))}
        </code>
        {hasError && (
          <div className="mt-1 text-xs text-red-600">
            ❌ Error at position {errorPosition}: invalid character '{errorChar}'
          </div>
        )}
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
          <div className={`text-xs font-bold ${hasError ? 'text-red-600' : 'text-green-600'}`}>
            {hasError ? 'ERROR' : 'PASS'}
          </div>
          <div className="text-xs text-gray-600">Status</div>
        </div>
      </div>
    </div>
  );
};

interface ErrorVisualizationsProps {
  className?: string;
}

const ErrorVisualizations: React.FC<ErrorVisualizationsProps> = ({
  className = '',
}) => {
  const samples = [
    {
      title: 'Valid Float Number',
      code: '3.14',
      description: 'Successful float parsing',
    },
    {
      title: 'Invalid Character',
      code: 'x = @invalid',
      description: 'Error: @ is not a valid token',
    },
    {
      title: 'Mixed Valid/Invalid',
      code: 'var x = 42; @#$',
      description: 'Error detection at invalid token',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {samples.map((sample, idx) => (
        <ErrorVisualization
          key={idx}
          title={sample.title}
          code={sample.code}
          description={sample.description}
        />
      ))}
    </div>
  );
};

export default ErrorVisualizations;
