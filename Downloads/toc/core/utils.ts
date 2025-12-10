/**
 * Utility functions for the lexical analyzer
 */

import { Token, TokenCategory } from '@/core/types';

/**
 * Export tokens to CSV format
 */
export function exportTokensToCSV(tokens: Token[]): string {
  const headers = ['Index', 'Lexeme', 'Token Type', 'Category', 'Line', 'Column'];
  const rows = tokens.map((token) =>
    [
      token.index,
      `"${token.lexeme.replace(/"/g, '""')}"`, // Escape quotes
      token.type,
      token.category,
      token.line,
      token.column,
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Export tokens to JSON format
 */
export function exportTokensToJSON(tokens: Token[]): string {
  return JSON.stringify(tokens, null, 2);
}

/**
 * Download file to user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get statistics about tokens
 */
export interface TokenStatistics {
  total: number;
  byCategory: Record<TokenCategory, number>;
  byType: Record<string, number>;
  uniqueLexemes: number;
  linesProcessed: number;
}

export function getTokenStatistics(tokens: Token[]): TokenStatistics {
  const byCategory: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const uniqueLexemes = new Set<string>();
  let maxLine = 0;

  tokens.forEach((token) => {
    // Count by category
    byCategory[token.category] = (byCategory[token.category] || 0) + 1;

    // Count by type
    byType[token.type] = (byType[token.type] || 0) + 1;

    // Track unique lexemes
    uniqueLexemes.add(token.lexeme);

    // Track max line
    if (token.line > maxLine) {
      maxLine = token.line;
    }
  });

  return {
    total: tokens.length,
    byCategory: byCategory as Record<TokenCategory, number>,
    byType,
    uniqueLexemes: uniqueLexemes.size,
    linesProcessed: maxLine,
  };
}

/**
 * Format token count with proper pluralization
 */
export function formatTokenCount(count: number): string {
  return `${count} token${count !== 1 ? 's' : ''}`;
}

/**
 * Format error count with proper pluralization
 */
export function formatErrorCount(count: number): string {
  return `${count} error${count !== 1 ? 's' : ''}`;
}

/**
 * Get color class for token category (Tailwind CSS classes)
 */
export function getTokenCategoryColorClass(category: TokenCategory): string {
  switch (category) {
    case TokenCategory.KEYWORD:
      return 'text-purple-600';
    case TokenCategory.IDENTIFIER:
      return 'text-blue-700';
    case TokenCategory.LITERAL:
      return 'text-green-600';
    case TokenCategory.OPERATOR:
      return 'text-orange-600';
    case TokenCategory.PUNCTUATION:
      return 'text-gray-700';
    case TokenCategory.COMMENT:
      return 'text-gray-500';
    case TokenCategory.WHITESPACE:
      return 'text-gray-300';
    case TokenCategory.ERROR:
      return 'text-red-600';
    default:
      return 'text-gray-900';
  }
}

/**
 * Truncate long lexemes for display
 */
export function truncateLexeme(lexeme: string, maxLength: number = 50): string {
  if (lexeme.length <= maxLength) {
    return lexeme;
  }
  return lexeme.substring(0, maxLength - 3) + '...';
}
