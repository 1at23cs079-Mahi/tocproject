/**
 * DFA-based Lexical Analyzer
 * 
 * This module implements a Deterministic Finite Automaton for lexical analysis.
 * 
 * DFA States:
 * - START: Initial state
 * - IN_IDENTIFIER: Processing identifier or keyword
 * - IN_NUMBER: Processing integer
 * - IN_FLOAT: Processing floating-point number
 * - IN_STRING: Processing string literal
 * - IN_OPERATOR: Processing operator
 * - IN_COMMENT: Processing single-line comment
 * - ERROR: Invalid character or sequence
 * 
 * Transition Logic:
 * - Letter → IN_IDENTIFIER (then continue with letters/digits/underscore)
 * - Digit → IN_NUMBER (then continue with digits, or '.' for float)
 * - Quote → IN_STRING (continue until closing quote)
 * - Operator chars → IN_OPERATOR (check multi-char operators)
 * - '/' followed by '/' → IN_COMMENT
 * - Punctuation → Immediate token emission
 * - Whitespace → Whitespace token
 */

import {
  Token,
  LexicalError,
  TokenType,
  TokenCategory,
  DFAState,
  LexicalAnalysisResult,
} from '../types';

/**
 * Keywords in the language
 */
const KEYWORDS = new Set([
  'if',
  'else',
  'while',
  'for',
  'return',
  'function',
  'var',
  'let',
  'const',
  'int',
  'float',
  'string',
  'boolean',
  'true',
  'false',
  'null',
  'undefined',
  'class',
  'this',
  'new',
  'void',
  'break',
  'continue',
  'switch',
  'case',
  'default',
  'do',
  'try',
  'catch',
  'finally',
  'throw',
  'import',
  'export',
  'from',
  'as',
]);

/**
 * Single-character operators
 */
const SINGLE_CHAR_OPERATORS = new Set(['+', '-', '*', '/', '%', '=', '<', '>', '!', '&', '|', '^', '~']);

/**
 * Multi-character operators
 */
const MULTI_CHAR_OPERATORS = new Set([
  '==',
  '!=',
  '<=',
  '>=',
  '&&',
  '||',
  '++',
  '--',
  '+=',
  '-=',
  '*=',
  '/=',
  '%=',
  '<<',
  '>>',
  '===',
  '!==',
]);

/**
 * Punctuation characters
 */
const PUNCTUATION = new Set(['(', ')', '{', '}', '[', ']', ';', ',', '.', ':', '?']);

/**
 * Check if character is a letter
 */
function isLetter(char: string): boolean {
  return /[a-zA-Z_]/.test(char);
}

/**
 * Check if character is a digit
 */
function isDigit(char: string): boolean {
  return /[0-9]/.test(char);
}

/**
 * Check if character is whitespace
 */
function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

/**
 * Get token category from token type
 */
function getCategory(type: TokenType): TokenCategory {
  switch (type) {
    case TokenType.KEYWORD:
      return TokenCategory.KEYWORD;
    case TokenType.IDENTIFIER:
      return TokenCategory.IDENTIFIER;
    case TokenType.NUMBER:
    case TokenType.FLOAT:
    case TokenType.STRING:
      return TokenCategory.LITERAL;
    case TokenType.OPERATOR:
      return TokenCategory.OPERATOR;
    case TokenType.PUNCTUATION:
      return TokenCategory.PUNCTUATION;
    case TokenType.COMMENT:
      return TokenCategory.COMMENT;
    case TokenType.WHITESPACE:
      return TokenCategory.WHITESPACE;
    case TokenType.ERROR:
      return TokenCategory.ERROR;
    default:
      return TokenCategory.ERROR;
  }
}

/**
 * DFA-based Lexical Analyzer
 */
export class LexicalAnalyzer {
  private input: string = '';
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];
  private errors: LexicalError[] = [];
  private tokenIndex: number = 0;

  /**
   * Analyze input source code
   */
  analyze(input: string): LexicalAnalysisResult {
    this.reset();
    this.input = input;

    while (this.position < this.input.length) {
      this.scanToken();
    }

    return {
      tokens: this.tokens,
      errors: this.errors,
      success: this.errors.length === 0,
    };
  }

  /**
   * Reset analyzer state
   */
  private reset(): void {
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
    this.errors = [];
    this.tokenIndex = 0;
  }

  /**
   * Scan and emit a single token using DFA
   */
  private scanToken(): void {
    const startLine = this.line;
    const startColumn = this.column;
    const char = this.currentChar();

    // Whitespace
    if (isWhitespace(char)) {
      this.scanWhitespace(startLine, startColumn);
      return;
    }

    // Comments (// style)
    if (char === '/' && this.peek() === '/') {
      this.scanComment(startLine, startColumn);
      return;
    }

    // String literals
    if (char === '"' || char === "'") {
      this.scanString(char, startLine, startColumn);
      return;
    }

    // Numbers
    if (isDigit(char)) {
      this.scanNumber(startLine, startColumn);
      return;
    }

    // Identifiers and keywords
    if (isLetter(char)) {
      this.scanIdentifierOrKeyword(startLine, startColumn);
      return;
    }

    // Operators
    if (SINGLE_CHAR_OPERATORS.has(char)) {
      this.scanOperator(startLine, startColumn);
      return;
    }

    // Punctuation
    if (PUNCTUATION.has(char)) {
      this.addToken(char, TokenType.PUNCTUATION, startLine, startColumn);
      this.advance();
      return;
    }

    // Error: invalid character
    this.addError(`Invalid character: '${char}'`, char, startLine, startColumn);
    this.advance();
  }

  /**
   * Scan whitespace (DFA: START -> WHITESPACE)
   */
  private scanWhitespace(startLine: number, startColumn: number): void {
    let lexeme = '';
    while (!this.isAtEnd() && isWhitespace(this.currentChar())) {
      lexeme += this.currentChar();
      this.advance();
    }
    this.addToken(lexeme, TokenType.WHITESPACE, startLine, startColumn);
  }

  /**
   * Scan comment (DFA: START -> '/' -> '/' -> IN_COMMENT)
   */
  private scanComment(startLine: number, startColumn: number): void {
    let lexeme = '';
    // Consume '//'
    lexeme += this.currentChar();
    this.advance();
    lexeme += this.currentChar();
    this.advance();

    // Read until end of line
    while (!this.isAtEnd() && this.currentChar() !== '\n') {
      lexeme += this.currentChar();
      this.advance();
    }

    this.addToken(lexeme, TokenType.COMMENT, startLine, startColumn);
  }

  /**
   * Scan string literal (DFA: START -> quote -> IN_STRING -> quote)
   */
  private scanString(quoteChar: string, startLine: number, startColumn: number): void {
    let lexeme = quoteChar;
    this.advance(); // consume opening quote

    let closed = false;
    while (!this.isAtEnd()) {
      const char = this.currentChar();
      
      if (char === quoteChar) {
        lexeme += char;
        this.advance();
        closed = true;
        break;
      }

      if (char === '\\' && !this.isAtEnd()) {
        // Handle escape sequences
        lexeme += char;
        this.advance();
        if (!this.isAtEnd()) {
          lexeme += this.currentChar();
          this.advance();
        }
      } else {
        lexeme += char;
        this.advance();
      }
    }

    if (!closed) {
      this.addError('Unterminated string literal', lexeme, startLine, startColumn);
      this.addToken(lexeme, TokenType.ERROR, startLine, startColumn);
    } else {
      this.addToken(lexeme, TokenType.STRING, startLine, startColumn);
    }
  }

  /**
   * Scan number (DFA: START -> digit -> IN_NUMBER -> [.digit -> IN_FLOAT])
   */
  private scanNumber(startLine: number, startColumn: number): void {
    let lexeme = '';
    let isFloat = false;

    // Read integer part
    while (!this.isAtEnd() && isDigit(this.currentChar())) {
      lexeme += this.currentChar();
      this.advance();
    }

    // Check for decimal point
    if (!this.isAtEnd() && this.currentChar() === '.' && !this.isAtEnd() && isDigit(this.peek())) {
      isFloat = true;
      lexeme += this.currentChar();
      this.advance();

      // Read fractional part
      while (!this.isAtEnd() && isDigit(this.currentChar())) {
        lexeme += this.currentChar();
        this.advance();
      }
    }

    const type = isFloat ? TokenType.FLOAT : TokenType.NUMBER;
    this.addToken(lexeme, type, startLine, startColumn);
  }

  /**
   * Scan identifier or keyword (DFA: START -> letter -> IN_IDENTIFIER)
   */
  private scanIdentifierOrKeyword(startLine: number, startColumn: number): void {
    let lexeme = '';

    // Read identifier (letters, digits, underscores)
    while (!this.isAtEnd() && (isLetter(this.currentChar()) || isDigit(this.currentChar()))) {
      lexeme += this.currentChar();
      this.advance();
    }

    // Check if it's a keyword
    const type = KEYWORDS.has(lexeme) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
    this.addToken(lexeme, type, startLine, startColumn);
  }

  /**
   * Scan operator (DFA: START -> op_char -> IN_OPERATOR)
   */
  private scanOperator(startLine: number, startColumn: number): void {
    let lexeme = this.currentChar();
    this.advance();

    // Try to match multi-character operators
    if (!this.isAtEnd()) {
      const twoChar = lexeme + this.currentChar();
      if (MULTI_CHAR_OPERATORS.has(twoChar)) {
        lexeme = twoChar;
        this.advance();

        // Check for three-character operators
        if (!this.isAtEnd()) {
          const threeChar = lexeme + this.currentChar();
          if (MULTI_CHAR_OPERATORS.has(threeChar)) {
            lexeme = threeChar;
            this.advance();
          }
        }
      }
    }

    this.addToken(lexeme, TokenType.OPERATOR, startLine, startColumn);
  }

  /**
   * Add a token to the token list
   */
  private addToken(lexeme: string, type: TokenType, line: number, column: number): void {
    this.tokens.push({
      index: this.tokenIndex++,
      lexeme,
      type,
      category: getCategory(type),
      line,
      column,
    });
  }

  /**
   * Add an error to the error list
   */
  private addError(message: string, lexeme: string | null, line: number, column: number): void {
    this.errors.push({
      message,
      lexeme,
      line,
      column,
    });
  }

  /**
   * Get current character
   */
  private currentChar(): string {
    return this.input[this.position];
  }

  /**
   * Peek at next character
   */
  private peek(): string {
    if (this.position + 1 >= this.input.length) return '\0';
    return this.input[this.position + 1];
  }

  /**
   * Advance to next character
   */
  private advance(): void {
    if (this.isAtEnd()) return;

    if (this.currentChar() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }

    this.position++;
  }

  /**
   * Check if at end of input
   */
  private isAtEnd(): boolean {
    return this.position >= this.input.length;
  }
}

/**
 * Convenience function to analyze code
 */
export function analyzeCode(code: string): LexicalAnalysisResult {
  const analyzer = new LexicalAnalyzer();
  return analyzer.analyze(code);
}
