'use client';

import React, { useRef, useState } from 'react';
import { DFALayout, LayoutNode, LayoutEdge } from '@/core/dfa/dfaLayout';

interface DfaCanvasProps {
  layout: DFALayout;
  currentState?: string;
  highlightedTransition?: string | null;
  onStateClick?: (stateId: string) => void;
  onTransitionHover?: (transitionId: string | null) => void;
  _animationSpeed?: number;
}

const DfaCanvas: React.FC<DfaCanvasProps> = ({
  layout,
  currentState,
  highlightedTransition,
  onStateClick,
  onTransitionHover,
  _animationSpeed = 1,
}) => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoveredTransition, setHoveredTransition] = useState<string | null>(null);

  const handleStateClick = (stateId: string) => {
    onStateClick?.(stateId);
  };

  const handleStateHover = (stateId: string | null) => {
    setHoveredState(stateId);
  };

  const handleTransitionHover = (transitionId: string | null) => {
    setHoveredTransition(transitionId);
    onTransitionHover?.(transitionId);
  };

  return (
    <svg
      ref={canvasRef}
      width="100%"
      height="100%"
      viewBox="0 0 1000 700"
      className="bg-gradient-to-br from-slate-50 to-slate-100"
    >
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        </pattern>

        {/* Arrow marker */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#6366f1" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#fbbf24" />
        </marker>
      </defs>

      <rect width="1000" height="700" fill="url(#grid)" />

      {/* Draw edges first (behind nodes) */}
      <g>
        {layout.edges.map((edge) => (
          <EdgeComponent
            key={edge.id}
            edge={edge}
            isHighlighted={highlightedTransition === edge.id}
            isHovered={hoveredTransition === edge.id}
            isActive={
              (currentState === edge.from && currentState !== edge.to) ||
              currentState === edge.to
            }
            onHover={() => handleTransitionHover(edge.id)}
            onHoverEnd={() => handleTransitionHover(null)}
          />
        ))}
      </g>

      {/* Draw nodes */}
      <g>
        {layout.nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            _isStart={node.type === 'start'}
            isAccepting={node.type === 'accept'}
            isError={node.type === 'error'}
            isCurrent={currentState === node.id}
            isHovered={hoveredState === node.id}
            onClick={() => handleStateClick(node.id)}
            onHover={() => handleStateHover(node.id)}
            onHoverEnd={() => handleStateHover(null)}
          />
        ))}
      </g>

      {/* Start state arrow */}
      {layout.nodes.map((node) => {
        if (node.type === 'start') {
          return (
            <g key={`start-arrow-${node.id}`}>
              <path
                d={`M ${node.position.x - 80} ${node.position.y} L ${node.position.x - 50} ${node.position.y}`}
                stroke="#0284c7"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            </g>
          );
        }
        return null;
      })}
    </svg>
  );
};

interface NodeComponentProps {
  node: LayoutNode;
  _isStart?: boolean;
  isAccepting: boolean;
  isError: boolean;
  isCurrent: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
}

const NodeComponent: React.FC<NodeComponentProps> = ({
  node,
  _isStart,
  isAccepting,
  isError,
  isCurrent,
  isHovered,
  onClick,
  onHover,
  onHoverEnd,
}) => {
  const getNodeColor = () => {
    if (isCurrent) {
      if (isError) return '#dc2626';
      return '#0284c7';
    }
    if (isError) return '#ef4444';
    if (isAccepting) return '#10b981';
    return '#9ca3af';
  };

  const getGlowColor = () => {
    if (isError) return '#fca5a5';
    if (isAccepting) return '#a7f3d0';
    return '#bfdbfe';
  };

  return (
    <g
      key={`node-${node.id}`}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow effect */}
      {(isCurrent || isHovered) && (
        <>
          <circle
            cx={node.position.x}
            cy={node.position.y}
            r={node.radius + 15}
            fill="none"
            stroke={getGlowColor()}
            strokeWidth="3"
            opacity="0.5"
            className={isCurrent ? 'animate-pulse' : ''}
          />
          <circle
            cx={node.position.x}
            cy={node.position.y}
            r={node.radius + 8}
            fill="none"
            stroke={getGlowColor()}
            strokeWidth="2"
            opacity="0.3"
          />
        </>
      )}

      {/* Outer circle for accepting states (double circle) */}
      {isAccepting && (
        <circle
          cx={node.position.x}
          cy={node.position.y}
          r={node.radius - 3}
          fill="none"
          stroke={getNodeColor()}
          strokeWidth="3"
          opacity={0.6}
        />
      )}

      {/* Main node circle */}
      <circle
        cx={node.position.x}
        cy={node.position.y}
        r={node.radius}
        fill={getNodeColor()}
        stroke="white"
        strokeWidth={isCurrent || isHovered ? 4 : 2}
        opacity={isCurrent ? 1 : 0.85}
      />

      {/* Node label */}
      <text
        x={node.position.x}
        y={node.position.y - 8}
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        pointerEvents="none"
      >
        {node.shortLabel}
      </text>

      {/* Node description on hover */}
      {isHovered && (
        <foreignObject
          x={node.position.x - 80}
          y={node.position.y + node.radius + 10}
          width="160"
          height="60"
        >
          <div className="bg-white text-xs p-2 rounded border border-gray-300 shadow-lg">
            {node.label}
          </div>
        </foreignObject>
      )}

      {/* Token type indicator */}
      {node.acceptsToken && (
        <text
          x={node.position.x}
          y={node.position.y + 12}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="600"
          pointerEvents="none"
          opacity="0.8"
        >
          {node.acceptsToken.substring(0, 3).toUpperCase()}
        </text>
      )}
    </g>
  );
};

interface EdgeComponentProps {
  edge: LayoutEdge;
  isHighlighted: boolean;
  isHovered: boolean;
  isActive: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
}

const EdgeComponent: React.FC<EdgeComponentProps> = ({
  edge,
  isHighlighted,
  isHovered,
  isActive,
  onHover,
  onHoverEnd,
}) => {
  const getStrokeColor = () => {
    if (isActive) return '#fbbf24';
    if (isHighlighted || isHovered) return '#0284c7';
    return '#d1d5db';
  };

  const getStrokeWidth = () => {
    if (isActive || isHighlighted || isHovered) return 3;
    return 2;
  };

  // Build SVG path for curved line
  let pathD: string;

  if (edge.isLoop) {
    const { x: cx, y: cy } = edge.startPos;
    const controlX = edge.controlPoints[0]?.x || cx + 60;
    const controlY = edge.controlPoints[0]?.y || cy - 80;
    pathD = `M ${cx} ${cy} Q ${controlX} ${controlY} ${edge.endPos.x} ${edge.endPos.y}`;
  } else {
    const control = edge.controlPoints[0];
    pathD = `M ${edge.startPos.x} ${edge.startPos.y} Q ${control.x} ${control.y} ${edge.endPos.x} ${edge.endPos.y}`;
  }

  // Calculate label position
  const labelX = (edge.startPos.x + edge.endPos.x) / 2 + (edge.controlPoints[0]?.x || 0) - edge.startPos.x;
  const labelY = (edge.startPos.y + edge.endPos.y) / 2 + (edge.controlPoints[0]?.y || 0) - edge.startPos.y - 10;

  return (
    <g key={`edge-${edge.id}`} onMouseEnter={onHover} onMouseLeave={onHoverEnd}>
      {/* Invisible hit area for hover */}
      <path
        d={pathD}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
        style={{ cursor: 'pointer' }}
      />

      {/* Visible edge */}
      <path
        d={pathD}
        stroke={getStrokeColor()}
        strokeWidth={getStrokeWidth()}
        fill="none"
        markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
        className={isActive ? 'animate-pulse' : ''}
        opacity={isHovered ? 1 : 0.7}
      />

      {/* Edge label */}
      <foreignObject x={labelX - 40} y={labelY - 15} width="80" height="30">
        <div
          className="text-xs font-semibold px-2 py-1 rounded bg-white border border-gray-300 shadow text-center break-words"
          onMouseEnter={onHover}
          onMouseLeave={onHoverEnd}
        >
          {edge.input}
        </div>
      </foreignObject>
    </g>
  );
};

export default DfaCanvas;
