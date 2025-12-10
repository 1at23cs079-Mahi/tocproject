/**
 * DFA Graph Layout Engine
 * Positions states and calculates edge paths
 */

import { DFAModel, DFAState, DFATransition } from './dfaModel';

export interface Position {
  x: number;
  y: number;
}

export interface LayoutNode extends DFAState {
  position: Position;
  radius: number;
  shortLabel: string;
}

export interface LayoutEdge extends DFATransition {
  startPos: Position;
  endPos: Position;
  controlPoints: Position[]; // For curved lines
  isLoop: boolean;
}

export interface DFALayout {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
}

/**
 * Calculate circular layout for DFA states
 */
function calculateCircularLayout(
  states: DFAState[],
  centerX: number = 500,
  centerY: number = 350,
  radius: number = 300
): LayoutNode[] {
  return states.map((state, index) => {
    const angle = (index / states.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // Create short label for display
    const shortLabel = state.label
      .split('_')
      .map((w) => w.charAt(0).toUpperCase())
      .join('');

    return {
      ...state,
      position: { x, y },
      radius: 45,
      shortLabel: shortLabel || state.id.substring(0, 3),
    };
  });
}

/**
 * Calculate control points for curved transition
 */
function calculateCurveControlPoints(
  from: Position,
  to: Position,
  isLoop: boolean = false
): Position[] {
  if (isLoop) {
    // Self-loop: create a teardrop shape
    const midX = from.x;
    const midY = from.y - 80;
    return [
      { x: from.x + 60, y: from.y - 40 },
      { x: midX + 60, y: midY },
      { x: to.x + 60, y: to.y - 40 },
    ];
  }

  // Regular curve between different states
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const perpX = (-dy / distance) * 30;
  const perpY = (dx / distance) * 30;

  return [
    { x: midX + perpX, y: midY + perpY },
  ];
}

/**
 * Layout the complete DFA graph
 */
export function layoutDFA(dfa: DFAModel): DFALayout {
  // Layout nodes
  const layoutNodes = calculateCircularLayout(dfa.states, 500, 350, 300);

  // Create a map for quick lookup
  const nodeMap = new Map(layoutNodes.map((n) => [n.id, n]));

  // Layout edges
  const layoutEdges = dfa.transitions.map((transition) => {
    const fromNode = nodeMap.get(transition.from);
    const toNode = nodeMap.get(transition.to);

    if (!fromNode || !toNode) {
      throw new Error(`Invalid transition: ${transition.from} -> ${transition.to}`);
    }

    const isLoop = transition.selfLoop || transition.from === transition.to;
    const controlPoints = calculateCurveControlPoints(
      fromNode.position,
      toNode.position,
      isLoop
    );

    // Calculate start and end positions on the node boundaries
    const angle = Math.atan2(toNode.position.y - fromNode.position.y, toNode.position.x - fromNode.position.x);
    const startPos = {
      x: fromNode.position.x + fromNode.radius * Math.cos(angle),
      y: fromNode.position.y + fromNode.radius * Math.sin(angle),
    };
    const endPos = {
      x: toNode.position.x - toNode.radius * Math.cos(angle),
      y: toNode.position.y - toNode.radius * Math.sin(angle),
    };

    return {
      ...transition,
      startPos,
      endPos,
      controlPoints,
      isLoop,
    };
  });

  return {
    nodes: layoutNodes,
    edges: layoutEdges,
  };
}

/**
 * Calculate arrow end position for pointer events
 */
export function getArrowEnd(start: Position, end: Position, arrowSize: number = 20): Position {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ratio = Math.max(0, (dist - arrowSize) / dist);

  return {
    x: start.x + dx * ratio,
    y: start.y + dy * ratio,
  };
}
