/**
 * DFA Visualization Generator
 * 
 * Generates node and edge data for visualizing the DFA used in lexical analysis
 */

import { DFAVisualization, DFANode, DFAEdge } from '../types';

/**
 * Generate DFA visualization data
 */
export function generateDFAVisualization(): DFAVisualization {
  const nodes: DFANode[] = [
    { id: 'START', label: 'START', isStart: true, isAccepting: false },
    { id: 'IN_IDENTIFIER', label: 'IDENTIFIER', isStart: false, isAccepting: true },
    { id: 'IN_NUMBER', label: 'NUMBER', isStart: false, isAccepting: true },
    { id: 'IN_FLOAT', label: 'FLOAT', isStart: false, isAccepting: true },
    { id: 'IN_STRING', label: 'STRING', isStart: false, isAccepting: true },
    { id: 'IN_OPERATOR', label: 'OPERATOR', isStart: false, isAccepting: true },
    { id: 'IN_COMMENT', label: 'COMMENT', isStart: false, isAccepting: true },
    { id: 'WHITESPACE', label: 'WHITESPACE', isStart: false, isAccepting: true },
    { id: 'PUNCTUATION', label: 'PUNCTUATION', isStart: false, isAccepting: true },
    { id: 'ERROR', label: 'ERROR', isStart: false, isAccepting: false },
  ];

  const edges: DFAEdge[] = [
    // From START
    { id: 'e1', source: 'START', target: 'IN_IDENTIFIER', label: 'letter' },
    { id: 'e2', source: 'START', target: 'IN_NUMBER', label: 'digit' },
    { id: 'e3', source: 'START', target: 'IN_STRING', label: '"\'' },
    { id: 'e4', source: 'START', target: 'IN_OPERATOR', label: 'op' },
    { id: 'e5', source: 'START', target: 'IN_COMMENT', label: '//' },
    { id: 'e6', source: 'START', target: 'WHITESPACE', label: 'space' },
    { id: 'e7', source: 'START', target: 'PUNCTUATION', label: '(){}[];,.' },
    { id: 'e8', source: 'START', target: 'ERROR', label: 'other' },

    // Self-loops
    { id: 'e9', source: 'IN_IDENTIFIER', target: 'IN_IDENTIFIER', label: 'letter|digit' },
    { id: 'e10', source: 'IN_NUMBER', target: 'IN_NUMBER', label: 'digit' },
    { id: 'e11', source: 'IN_FLOAT', target: 'IN_FLOAT', label: 'digit' },
    { id: 'e12', source: 'IN_STRING', target: 'IN_STRING', label: 'any' },
    { id: 'e13', source: 'IN_COMMENT', target: 'IN_COMMENT', label: 'any' },
    { id: 'e14', source: 'WHITESPACE', target: 'WHITESPACE', label: 'space' },

    // Special transitions
    { id: 'e15', source: 'IN_NUMBER', target: 'IN_FLOAT', label: '.' },
    { id: 'e16', source: 'IN_STRING', target: 'START', label: 'closing quote' },
    { id: 'e17', source: 'IN_COMMENT', target: 'START', label: '\\n' },
  ];

  return { nodes, edges };
}
