/**
 * DFA Model and Data Structures
 * Defines the complete DFA for lexical analysis with all states and transitions
 */

export type StateType = 'start' | 'normal' | 'accept' | 'error';
export type TransitionInput = string; // Character class like [a-z], "digit", etc.

/**
 * Represents a DFA state
 */
export interface DFAState {
  id: string;
  label: string;
  shortLabel: string; // Abbreviated label for display
  description: string; // Hover text explaining what this state matches
  type: StateType;
  acceptsToken?: string; // Token type emitted when accepting (e.g., "KEYWORD", "NUMBER")
  regex?: string; // Pattern this state matches
}

/**
 * Represents a transition between states
 */
export interface DFATransition {
  id: string;
  from: string; // Source state ID
  to: string; // Target state ID
  input: string; // Input symbol/class (e.g., "[a-zA-Z]", "[0-9]", "\"")
  description: string; // Human-readable description
  selfLoop?: boolean; // Is this a self-loop?
}

/**
 * Complete DFA model for lexical analysis
 */
export interface DFAModel {
  states: DFAState[];
  transitions: DFATransition[];
  startStateId: string;
  acceptingStateIds: string[];
}

/**
 * Create the complete lexical analyzer DFA
 */
export function createLexerDFA(): DFAModel {
  const states: DFAState[] = [
    {
      id: 'START',
      label: 'START',
      shortLabel: 'q₀',
      description: 'Initial state - awaits input to determine token type',
      type: 'start',
      regex: 'ε',
    },
    {
      id: 'IN_IDENTIFIER',
      label: 'IN_IDENTIFIER',
      shortLabel: 'q₁',
      description: 'Processing identifier or keyword - accepts [a-zA-Z_][a-zA-Z0-9_]*',
      type: 'accept',
      acceptsToken: 'IDENTIFIER/KEYWORD',
      regex: '[a-zA-Z_][a-zA-Z0-9_]*',
    },
    {
      id: 'IN_NUMBER',
      label: 'IN_NUMBER',
      shortLabel: 'q₂',
      description: 'Processing integer - accepts [0-9]+',
      type: 'accept',
      acceptsToken: 'NUMBER',
      regex: '[0-9]+',
    },
    {
      id: 'IN_FLOAT',
      label: 'IN_FLOAT',
      shortLabel: 'q₃',
      description: 'Processing float - accepts [0-9]+\\.[0-9]+',
      type: 'accept',
      acceptsToken: 'FLOAT',
      regex: '[0-9]+\\.[0-9]+',
    },
    {
      id: 'IN_STRING',
      label: 'IN_STRING',
      shortLabel: 'q₄',
      description: 'Processing string literal - accepts "..." or \'...\'',
      type: 'accept',
      acceptsToken: 'STRING',
      regex: '(["\'])[^"\']*\\1',
    },
    {
      id: 'IN_OPERATOR',
      label: 'IN_OPERATOR',
      shortLabel: 'q₅',
      description: 'Processing operator - accepts +, -, *, /, ==, !=, etc.',
      type: 'accept',
      acceptsToken: 'OPERATOR',
      regex: '[+\\-*/%=<>!&|^]+',
    },
    {
      id: 'IN_COMMENT',
      label: 'IN_COMMENT',
      shortLabel: 'q₆',
      description: 'Processing comment - accepts //... until newline',
      type: 'accept',
      acceptsToken: 'COMMENT',
      regex: '//.*',
    },
    {
      id: 'WHITESPACE',
      label: 'WHITESPACE',
      shortLabel: 'q₇',
      description: 'Processing whitespace - accepts spaces, tabs, newlines',
      type: 'accept',
      acceptsToken: 'WHITESPACE',
      regex: '\\s+',
    },
    {
      id: 'PUNCTUATION',
      label: 'PUNCTUATION',
      shortLabel: 'q₈',
      description: 'Processing punctuation - accepts (), {}, [], ;, etc.',
      type: 'accept',
      acceptsToken: 'PUNCTUATION',
      regex: '[()\\{\\}\\[\\];,.:?]',
    },
    {
      id: 'ERROR',
      label: 'ERROR',
      shortLabel: 'qₑ',
      description: 'Error state - invalid character detected',
      type: 'error',
      regex: '[^a-zA-Z0-9_\\s+\\-*/%=<>!&|^"\']',
    },
  ];

  const transitions: DFATransition[] = [
    // From START state
    {
      id: 'start-letter',
      from: 'START',
      to: 'IN_IDENTIFIER',
      input: '[a-zA-Z_]',
      description: 'Letter or underscore starts identifier',
    },
    {
      id: 'start-digit',
      from: 'START',
      to: 'IN_NUMBER',
      input: '[0-9]',
      description: 'Digit starts number',
    },
    {
      id: 'start-quote',
      from: 'START',
      to: 'IN_STRING',
      input: '[\"\']',
      description: 'Quote starts string literal',
    },
    {
      id: 'start-operator',
      from: 'START',
      to: 'IN_OPERATOR',
      input: '[+\\-*/%=<>!&|^]',
      description: 'Operator character',
    },
    {
      id: 'start-slash',
      from: 'START',
      to: 'IN_COMMENT',
      input: '//',
      description: 'Double slash starts comment',
    },
    {
      id: 'start-whitespace',
      from: 'START',
      to: 'WHITESPACE',
      input: '[\\s]',
      description: 'Whitespace character',
    },
    {
      id: 'start-punctuation',
      from: 'START',
      to: 'PUNCTUATION',
      input: '[()\\{\\}\\[\\];,.:?]',
      description: 'Punctuation character',
    },
    {
      id: 'start-error',
      from: 'START',
      to: 'ERROR',
      input: 'Other',
      description: 'Invalid character',
    },

    // Self-loops
    {
      id: 'identifier-loop',
      from: 'IN_IDENTIFIER',
      to: 'IN_IDENTIFIER',
      input: '[a-zA-Z0-9_]',
      description: 'Continue reading identifier',
      selfLoop: true,
    },
    {
      id: 'number-loop',
      from: 'IN_NUMBER',
      to: 'IN_NUMBER',
      input: '[0-9]',
      description: 'Continue reading digits',
      selfLoop: true,
    },
    {
      id: 'float-loop',
      from: 'IN_FLOAT',
      to: 'IN_FLOAT',
      input: '[0-9]',
      description: 'Continue reading fractional part',
      selfLoop: true,
    },
    {
      id: 'string-loop',
      from: 'IN_STRING',
      to: 'IN_STRING',
      input: '[^"\']',
      description: 'Continue reading string content',
      selfLoop: true,
    },
    {
      id: 'comment-loop',
      from: 'IN_COMMENT',
      to: 'IN_COMMENT',
      input: '[^\\n]',
      description: 'Continue reading comment',
      selfLoop: true,
    },
    {
      id: 'whitespace-loop',
      from: 'WHITESPACE',
      to: 'WHITESPACE',
      input: '[\\s]',
      description: 'Continue reading whitespace',
      selfLoop: true,
    },
    {
      id: 'operator-loop',
      from: 'IN_OPERATOR',
      to: 'IN_OPERATOR',
      input: '[+\\-*/%=<>!&|^]',
      description: 'Multi-character operator',
      selfLoop: true,
    },

    // Special transitions
    {
      id: 'number-to-float',
      from: 'IN_NUMBER',
      to: 'IN_FLOAT',
      input: '\\.',
      description: 'Decimal point starts float',
    },
  ];

  return {
    states,
    transitions,
    startStateId: 'START',
    acceptingStateIds: [
      'IN_IDENTIFIER',
      'IN_NUMBER',
      'IN_FLOAT',
      'IN_STRING',
      'IN_OPERATOR',
      'IN_COMMENT',
      'WHITESPACE',
      'PUNCTUATION',
    ],
  };
}

/**
 * Get state by ID
 */
export function getStateById(dfa: DFAModel, stateId: string): DFAState | undefined {
  return dfa.states.find((s) => s.id === stateId);
}

/**
 * Get transitions from a state
 */
export function getTransitionsFrom(
  dfa: DFAModel,
  stateId: string
): DFATransition[] {
  return dfa.transitions.filter((t) => t.from === stateId);
}

/**
 * Get transitions to a state
 */
export function getTransitionsTo(
  dfa: DFAModel,
  stateId: string
): DFATransition[] {
  return dfa.transitions.filter((t) => t.to === stateId);
}

/**
 * Find a transition between two states with given input
 */
export function findTransition(
  dfa: DFAModel,
  from: string,
  to: string,
  input?: string
): DFATransition | undefined {
  return dfa.transitions.find(
    (t) =>
      t.from === from &&
      t.to === to &&
      (!input || t.input.includes(input) || input.includes(t.input))
  );
}

/**
 * Check if a state is accepting
 */
export function isAcceptingState(dfa: DFAModel, stateId: string): boolean {
  return dfa.acceptingStateIds.includes(stateId);
}

/**
 * Check if a state is the start state
 */
export function isStartState(dfa: DFAModel, stateId: string): boolean {
  return dfa.startStateId === stateId;
}

/**
 * Pre-built DFA instance for lexical analysis
 */
export const dfa = createLexerDFA();
