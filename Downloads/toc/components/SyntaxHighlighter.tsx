'use client';

import React from 'react';
import { Token } from '@/core/types';

interface SyntaxHighlighterProps {
  code: string;
  tokens: Token[];
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code, tokens }) => {
  // Get color for token category
  const getTokenColor = (category: string): string => {
    switch (category) {
      case 'Keyword':
        return 'text-purple-600 font-semibold';
      case 'Identifier':
        return 'text-blue-700';
      case 'Literal':
        return 'text-green-600';
      case 'Operator':
        return 'text-orange-600';
      case 'Punctuation':
        return 'text-gray-700';
      case 'Comment':
        return 'text-gray-500 italic';
      case 'Whitespace':
        return 'text-gray-900';
      case 'Error':
        return 'text-red-600 font-bold bg-red-100';
      default:
        return 'text-gray-900';
    }
  };

  // Build highlighted content
  const buildHighlightedContent = () => {
    if (tokens.length === 0) {
      return <span>{code}</span>;
    }

    // Filter out whitespace tokens for cleaner highlighting logic
    const nonWhitespaceTokens = tokens.filter((t) => t.category !== 'Whitespace');
    
    const elements: React.ReactNode[] = [];
    let currentIndex = 0;
    const lines = code.split('\n');
    
    // Process each line
    lines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      let linePosition = 0;
      
      // Find tokens on this line
      const lineTokens = nonWhitespaceTokens.filter((t) => t.line === lineNumber);
      
      lineTokens.forEach((token) => {
        // Add any text before this token
        const beforeText = line.substring(linePosition, token.column - 1);
        if (beforeText) {
          elements.push(
            <span key={`before-${currentIndex++}`}>{beforeText}</span>
          );
        }
        
        // Add the token with highlighting
        elements.push(
          <span
            key={`token-${token.index}`}
            className={getTokenColor(token.category)}
            title={`${token.type} (${token.category})`}
          >
            {token.lexeme}
          </span>
        );
        
        linePosition = token.column - 1 + token.lexeme.length;
      });
      
      // Add remaining text on the line
      const remainingText = line.substring(linePosition);
      if (remainingText) {
        elements.push(
          <span key={`remaining-${currentIndex++}`}>{remainingText}</span>
        );
      }
      
      // Add newline except for last line
      if (lineIndex < lines.length - 1) {
        elements.push(<span key={`newline-${lineIndex}`}>{'\n'}</span>);
      }
    });

    return <>{elements}</>;
  };

  return <>{buildHighlightedContent()}</>;
};

export default SyntaxHighlighter;
