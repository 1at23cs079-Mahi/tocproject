/**
 * Core type definitions for the Lexical Analyzer
 */

/**
 * Represents a token produced by the lexical analyzer
 */
export interface Token {
  index: number;
  lexeme: string;
  type: string; // KEYWORD, IDENTIFIER, NUMBER, OPERATOR, etc.
  category: string; // Keyword, Identifier, Literal, Punctuation, etc.
  line: number;
  column: number;
}

/**
 * Represents a lexical error encountered during analysis
 */
export interface LexicalError {
  message: string;
  lexeme: string | null;
  line: number;
  column: number;
}

/**
 * DFA state representation
 */
export enum DFAState {
  START = 'START',
  IN_IDENTIFIER = 'IN_IDENTIFIER',
  IN_NUMBER = 'IN_NUMBER',
  IN_FLOAT = 'IN_FLOAT',
  IN_STRING = 'IN_STRING',
  IN_OPERATOR = 'IN_OPERATOR',
  IN_COMMENT = 'IN_COMMENT',
  ERROR = 'ERROR',
}

/**
 * Token types enum
 */
export enum TokenType {
  KEYWORD = 'KEYWORD',
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  FLOAT = 'FLOAT',
  STRING = 'STRING',
  OPERATOR = 'OPERATOR',
  PUNCTUATION = 'PUNCTUATION',
  COMMENT = 'COMMENT',
  WHITESPACE = 'WHITESPACE',
  ERROR = 'ERROR',
}

/**
 * Token category for grouping
 */
export enum TokenCategory {
  KEYWORD = 'Keyword',
  IDENTIFIER = 'Identifier',
  LITERAL = 'Literal',
  OPERATOR = 'Operator',
  PUNCTUATION = 'Punctuation',
  COMMENT = 'Comment',
  WHITESPACE = 'Whitespace',
  ERROR = 'Error',
}

/**
 * DFA transition table type
 */
export type TransitionTable = Map<string, Map<string, DFAState>>;

/**
 * Result of lexical analysis
 */
export interface LexicalAnalysisResult {
  tokens: Token[];
  errors: LexicalError[];
  success: boolean;
}

/**
 * DFA node for visualization
 */
export interface DFANode {
  id: string;
  label: string;
  isStart: boolean;
  isAccepting: boolean;
}

/**
 * DFA edge for visualization
 */
export interface DFAEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

/**
 * DFA visualization data
 */
export interface DFAVisualization {
  nodes: DFANode[];
  edges: DFAEdge[];
}
