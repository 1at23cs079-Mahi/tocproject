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
import { analyzeCode } from '@/core/lexer/dfa';

interface CategoryVisualizationProps {
  title: string;
  code: string;
  description: string;
  category: 'arithmetic' | 'control' | 'operators' | 'errors';
}

const CategoryVisualization: React.FC<CategoryVisualizationProps> = ({
  title,
  code,
  description,
  category,
}) => {
  const { nodes: dfaNodes, edges: dfaEdges } = generateDFAVisualization();

  // Get simulation and analysis results
  const { visitedStates, tokenCount, errorCount, hasError } = useMemo(() => {
    const simulator = new DFASimulator(dfa);
    simulator.initialize(code);

    const visited = new Set<string>();
    visited.add('START');
    let errorFound = false;

    while (simulator.step()) {
      const steps = simulator.getSteps();
      const lastStep = steps[steps.length - 1];
      if (lastStep) {
        visited.add(lastStep.currentState);
        if (lastStep.currentState === 'ERROR') {
          errorFound = true;
        }
      }
    }

    const analysis = analyzeCode(code);
    return {
      visitedStates: visited,
      tokenCount: analysis.tokens.length,
      errorCount: analysis.errors.length,
      hasError: errorFound || analysis.errors.length > 0,
    };
  }, [code]);

  const getCircularPosition = (index: number, total: number) => {
    const radius = 120;
    const angle = (index / total) * 2 * Math.PI;
    return {
      x: 170 + radius * Math.cos(angle),
      y: 130 + radius * Math.sin(angle),
    };
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'arithmetic':
        return { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', text: 'text-blue-800' };
      case 'control':
        return { bg: 'from-purple-50 to-pink-50', border: 'border-purple-200', text: 'text-purple-800' };
      case 'operators':
        return { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', text: 'text-amber-800' };
      case 'errors':
        return { bg: 'from-red-50 to-rose-50', border: 'border-red-200', text: 'text-red-800' };
      default:
        return { bg: 'from-gray-50 to-gray-50', border: 'border-gray-200', text: 'text-gray-800' };
    }
  };

  const colors = getCategoryColor();

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

        const opacity = isVisited ? 1 : 0.25;

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
            border: '2px solid white',
            borderRadius: '50%',
            width: isAccepting ? 50 : 45,
            height: isAccepting ? 50 : 45,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8,
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            padding: '3px',
            outline: isAccepting ? `2px solid ${bgColor}` : 'none',
            outlineOffset: '1px',
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
          width: 15,
          height: 15,
          color: '#d1d5db',
        },
        style: {
          stroke: '#e5e7eb',
          strokeWidth: 1,
        },
        labelStyle: {
          fill: '#4b5563',
          fontWeight: 500,
          fontSize: 7,
          backgroundColor: '#ffffff',
          padding: '1px 2px',
          borderRadius: '2px',
        },
      })),
    [dfaEdges]
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border overflow-hidden h-full flex flex-col ${colors.border}`}>
      {/* Header */}
      <div className={`p-2.5 border-b ${colors.border} bg-gradient-to-r ${colors.bg}`}>
        <h4 className={`text-xs font-bold ${colors.text}`}>{title}</h4>
        <p className={`text-xs ${colors.text} opacity-75 mt-0.5`}>{description}</p>
      </div>

      {/* Code */}
      <div className="px-2.5 py-1.5 border-b border-gray-100 bg-gray-50">
        <code className="text-xs text-gray-700 font-mono line-clamp-1">{code}</code>
      </div>

      {/* Visualization */}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={reactFlowEdges}
          fitView
          fitViewOptions={{ padding: 0.05, maxZoom: 0.8, minZoom: 0.3 }}
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={15} size={0.5} color="#f0f0f0" />
        </ReactFlow>
      </div>

      {/* Stats */}
      <div className={`p-1.5 border-t ${colors.border} bg-gradient-to-r ${colors.bg} grid grid-cols-3 gap-1 text-center`}>
        <div>
          <div className={`text-xs font-bold ${colors.text}`}>{visitedStates.size}</div>
          <div className={`text-xs ${colors.text} opacity-70`}>States</div>
        </div>
        <div>
          <div className={`text-xs font-bold ${colors.text}`}>{tokenCount}</div>
          <div className={`text-xs ${colors.text} opacity-70`}>Tokens</div>
        </div>
        <div>
          <div className={`text-xs font-bold ${hasError ? 'text-red-600' : 'text-green-600'}`}>
            {hasError ? 'ERROR' : 'OK'}
          </div>
          <div className={`text-xs ${colors.text} opacity-70`}>Status</div>
        </div>
      </div>
    </div>
  );
};

interface CategoryVisualizationsProps {
  className?: string;
}

const CategoryVisualizations: React.FC<CategoryVisualizationsProps> = ({ className = '' }) => {
  const samples = {
    arithmetic: {
      title: 'Arithmetic',
      samples: [
        {
          title: 'Basic Calculation',
          code: 'x = 10 + 5 * 2',
          description: 'Integer arithmetic with operators',
          category: 'arithmetic' as const,
        },
        {
          title: 'Float Operations',
          code: 'result = 3.14 * 2.5',
          description: 'Floating-point arithmetic',
          category: 'arithmetic' as const,
        },
        {
          title: 'Complex Expression',
          code: 'sum = (a + b) * c / d',
          description: 'Parenthesized expression',
          category: 'arithmetic' as const,
        },
      ],
    },
    control: {
      title: 'Control Flow',
      samples: [
        {
          title: 'If Statement',
          code: 'if (x > 10) { y = 20; }',
          description: 'Conditional control structure',
          category: 'control' as const,
        },
        {
          title: 'While Loop',
          code: 'while (count < 100) { count++; }',
          description: 'Loop control structure',
          category: 'control' as const,
        },
        {
          title: 'For Loop',
          code: 'for (i = 0; i < 10; i++) { }',
          description: 'Iterator control structure',
          category: 'control' as const,
        },
      ],
    },
    operators: {
      title: 'Operators & Strings',
      samples: [
        {
          title: 'Logical Operators',
          code: 'result = (a && b) || !c',
          description: 'Logical AND, OR, NOT operators',
          category: 'operators' as const,
        },
        {
          title: 'String Literals',
          code: 'message = "Hello, World!"',
          description: 'String with quotes',
          category: 'operators' as const,
        },
        {
          title: 'Comparison',
          code: 'if (x == 5 && y != 0)',
          description: 'Comparison and logical operators',
          category: 'operators' as const,
        },
      ],
    },
    errors: {
      title: 'With Errors',
      samples: [
        {
          title: 'Invalid Character',
          code: 'x = 42 @#$ error',
          description: 'Contains invalid tokens',
          category: 'errors' as const,
        },
        {
          title: 'Unclosed String',
          code: 'str = "unclosed',
          description: 'Missing closing quote',
          category: 'errors' as const,
        },
        {
          title: 'Mixed Valid/Invalid',
          code: 'valid = 123; @invalid; x = 5',
          description: 'Both valid and invalid tokens',
          category: 'errors' as const,
        },
      ],
    },
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {Object.entries(samples).map(([key, section]) => (
        <div key={key}>
          <h3 className="text-lg font-bold text-gray-800 mb-4 capitalize">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.samples.map((sample, idx) => (
              <CategoryVisualization
                key={idx}
                title={sample.title}
                code={sample.code}
                description={sample.description}
                category={sample.category}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryVisualizations;
