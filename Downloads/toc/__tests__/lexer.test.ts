/**
 * Unit tests for the DFA-based Lexical Analyzer
 */

import { analyzeCode } from '@/core/lexer/dfa';
import { TokenType } from '@/core/types';

describe('Lexical Analyzer - DFA', () => {
  describe('Keywords', () => {
    it('should recognize keywords', () => {
      const code = 'if else while for return';
      const result = analyzeCode(code);
      
      const keywordTokens = result.tokens.filter(t => t.type === TokenType.KEYWORD);
      expect(keywordTokens).toHaveLength(5);
      expect(keywordTokens.map(t => t.lexeme)).toEqual(['if', 'else', 'while', 'for', 'return']);
    });

    it('should distinguish keywords from identifiers', () => {
      const code = 'if ifx xif';
      const result = analyzeCode(code);
      
      const nonWhitespace = result.tokens.filter(t => t.type !== TokenType.WHITESPACE);
      expect(nonWhitespace[0].type).toBe(TokenType.KEYWORD);
      expect(nonWhitespace[0].lexeme).toBe('if');
      expect(nonWhitespace[1].type).toBe(TokenType.IDENTIFIER);
      expect(nonWhitespace[1].lexeme).toBe('ifx');
      expect(nonWhitespace[2].type).toBe(TokenType.IDENTIFIER);
      expect(nonWhitespace[2].lexeme).toBe('xif');
    });
  });

  describe('Identifiers', () => {
    it('should recognize valid identifiers', () => {
      const code = 'variable_name myVar count123 _private';
      const result = analyzeCode(code);
      
      const identifiers = result.tokens.filter(t => t.type === TokenType.IDENTIFIER);
      expect(identifiers).toHaveLength(4);
      expect(identifiers.map(t => t.lexeme)).toEqual(['variable_name', 'myVar', 'count123', '_private']);
    });

    it('should handle identifiers with underscores and digits', () => {
      const code = '_test test_123 __internal__';
      const result = analyzeCode(code);
      
      const identifiers = result.tokens.filter(t => t.type === TokenType.IDENTIFIER);
      expect(identifiers).toHaveLength(3);
    });
  });

  describe('Numbers', () => {
    it('should recognize integers', () => {
      const code = '123 456 0 999';
      const result = analyzeCode(code);
      
      const numbers = result.tokens.filter(t => t.type === TokenType.NUMBER);
      expect(numbers).toHaveLength(4);
      expect(numbers.map(t => t.lexeme)).toEqual(['123', '456', '0', '999']);
    });

    it('should recognize floating-point numbers', () => {
      const code = '3.14 0.5 123.456';
      const result = analyzeCode(code);
      
      const floats = result.tokens.filter(t => t.type === TokenType.FLOAT);
      expect(floats).toHaveLength(3);
      expect(floats.map(t => t.lexeme)).toEqual(['3.14', '0.5', '123.456']);
    });

    it('should not treat dot without following digit as float', () => {
      const code = '123.';
      const result = analyzeCode(code);
      
      const tokens = result.tokens.filter(t => t.type !== TokenType.WHITESPACE);
      expect(tokens[0].type).toBe(TokenType.NUMBER);
      expect(tokens[0].lexeme).toBe('123');
      expect(tokens[1].type).toBe(TokenType.PUNCTUATION);
      expect(tokens[1].lexeme).toBe('.');
    });
  });

  describe('Strings', () => {
    it('should recognize double-quoted strings', () => {
      const code = '"hello world"';
      const result = analyzeCode(code);
      
      const strings = result.tokens.filter(t => t.type === TokenType.STRING);
      expect(strings).toHaveLength(1);
      expect(strings[0].lexeme).toBe('"hello world"');
    });

    it('should recognize single-quoted strings', () => {
      const code = "'hello world'";
      const result = analyzeCode(code);
      
      const strings = result.tokens.filter(t => t.type === TokenType.STRING);
      expect(strings).toHaveLength(1);
      expect(strings[0].lexeme).toBe("'hello world'");
    });

    it('should handle escaped characters in strings', () => {
      const code = '"hello \\"world\\""';
      const result = analyzeCode(code);
      
      const strings = result.tokens.filter(t => t.type === TokenType.STRING);
      expect(strings).toHaveLength(1);
      expect(strings[0].lexeme).toBe('"hello \\"world\\""');
    });

    it('should detect unterminated strings as errors', () => {
      const code = '"unclosed string';
      const result = analyzeCode(code);
      
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Unterminated');
    });
  });

  describe('Operators', () => {
    it('should recognize single-character operators', () => {
      const code = '+ - * / = < >';
      const result = analyzeCode(code);
      
      const operators = result.tokens.filter(t => t.type === TokenType.OPERATOR);
      expect(operators).toHaveLength(7);
    });

    it('should recognize multi-character operators', () => {
      const code = '== != <= >= && || ++ --';
      const result = analyzeCode(code);
      
      const operators = result.tokens.filter(t => t.type === TokenType.OPERATOR);
      expect(operators).toHaveLength(8);
      expect(operators.map(t => t.lexeme)).toEqual(['==', '!=', '<=', '>=', '&&', '||', '++', '--']);
    });

    it('should recognize three-character operators', () => {
      const code = '=== !==';
      const result = analyzeCode(code);
      
      const operators = result.tokens.filter(t => t.type === TokenType.OPERATOR);
      expect(operators).toHaveLength(2);
      expect(operators.map(t => t.lexeme)).toEqual(['===', '!==']);
    });
  });

  describe('Comments', () => {
    it('should recognize single-line comments', () => {
      const code = '// this is a comment';
      const result = analyzeCode(code);
      
      const comments = result.tokens.filter(t => t.type === TokenType.COMMENT);
      expect(comments).toHaveLength(1);
      expect(comments[0].lexeme).toBe('// this is a comment');
    });

    it('should handle comments with code after them', () => {
      const code = 'var x = 5; // comment\nvar y = 10;';
      const result = analyzeCode(code);
      
      const comments = result.tokens.filter(t => t.type === TokenType.COMMENT);
      expect(comments).toHaveLength(1);
      
      const keywords = result.tokens.filter(t => t.type === TokenType.KEYWORD);
      expect(keywords).toHaveLength(2); // both 'var' keywords
    });
  });

  describe('Punctuation', () => {
    it('should recognize punctuation characters', () => {
      const code = '( ) { } [ ] ; , .';
      const result = analyzeCode(code);
      
      const punctuation = result.tokens.filter(t => t.type === TokenType.PUNCTUATION);
      expect(punctuation).toHaveLength(9);
    });
  });

  describe('Line and Column Tracking', () => {
    it('should track line numbers correctly', () => {
      const code = 'var x = 5;\nvar y = 10;';
      const result = analyzeCode(code);
      
      const varTokens = result.tokens.filter(t => t.lexeme === 'var');
      expect(varTokens[0].line).toBe(1);
      expect(varTokens[1].line).toBe(2);
    });

    it('should track column numbers correctly', () => {
      const code = 'var x = 5;';
      const result = analyzeCode(code);
      
      const nonWhitespace = result.tokens.filter(t => t.type !== TokenType.WHITESPACE);
      expect(nonWhitespace[0].column).toBe(1); // var
      expect(nonWhitespace[1].column).toBe(5); // x
      expect(nonWhitespace[2].column).toBe(7); // =
      expect(nonWhitespace[3].column).toBe(9); // 5
    });
  });

  describe('Error Detection', () => {
    it('should detect invalid characters', () => {
      const code = 'var x = @;';
      const result = analyzeCode(code);
      
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Invalid character');
      expect(result.errors[0].lexeme).toBe('@');
    });

    it('should continue after errors', () => {
      const code = 'var @ x = 5;';
      const result = analyzeCode(code);
      
      expect(result.errors).toHaveLength(1);
      
      const identifiers = result.tokens.filter(t => t.type === TokenType.IDENTIFIER);
      expect(identifiers.some(t => t.lexeme === 'x')).toBe(true);
    });
  });

  describe('Complex Code', () => {
    it('should analyze a complete function', () => {
      const code = `function add(a, b) {
  return a + b;
}`;
      const result = analyzeCode(code);
      
      expect(result.errors).toHaveLength(0);
      
      const keywords = result.tokens.filter(t => t.type === TokenType.KEYWORD);
      expect(keywords.map(t => t.lexeme)).toEqual(['function', 'return']);
      
      const identifiers = result.tokens.filter(t => t.type === TokenType.IDENTIFIER);
      expect(identifiers.map(t => t.lexeme)).toEqual(['add', 'a', 'b', 'a', 'b']);
    });

    it('should handle mixed token types', () => {
      const code = 'if (x >= 10 && y < 20) { return true; }';
      const result = analyzeCode(code);
      
      expect(result.errors).toHaveLength(0);
      
      const hasKeywords = result.tokens.some(t => t.type === TokenType.KEYWORD);
      const hasOperators = result.tokens.some(t => t.type === TokenType.OPERATOR);
      const hasIdentifiers = result.tokens.some(t => t.type === TokenType.IDENTIFIER);
      const hasNumbers = result.tokens.some(t => t.type === TokenType.NUMBER);
      const hasPunctuation = result.tokens.some(t => t.type === TokenType.PUNCTUATION);
      
      expect(hasKeywords).toBe(true);
      expect(hasOperators).toBe(true);
      expect(hasIdentifiers).toBe(true);
      expect(hasNumbers).toBe(true);
      expect(hasPunctuation).toBe(true);
    });
  });

  describe('Whitespace Handling', () => {
    it('should tokenize whitespace', () => {
      const code = 'a b  c';
      const result = analyzeCode(code);
      
      const whitespace = result.tokens.filter(t => t.type === TokenType.WHITESPACE);
      expect(whitespace.length).toBeGreaterThan(0);
    });

    it('should handle tabs and newlines', () => {
      const code = 'a\tb\nc';
      const result = analyzeCode(code);
      
      const identifiers = result.tokens.filter(t => t.type === TokenType.IDENTIFIER);
      expect(identifiers).toHaveLength(3);
      expect(identifiers.map(t => t.lexeme)).toEqual(['a', 'b', 'c']);
    });
  });
});
