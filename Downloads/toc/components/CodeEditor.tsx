'use client';

import React, { useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  highlightedCode?: React.ReactNode;
  showLineNumbers?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  placeholder = '// Paste or write code here',
  highlightedCode,
  showLineNumbers = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and highlight layer
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Calculate line numbers
  const lineCount = value.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="relative w-full h-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="flex h-full">
        {/* Line Numbers */}
        {showLineNumbers && (
          <div className="flex-shrink-0 bg-gray-50 border-r border-gray-300 px-2 py-3 text-right select-none overflow-hidden">
            {lineNumbers.map((num) => (
              <div
                key={num}
                className="text-gray-500 text-sm font-mono leading-6"
                style={{ height: '24px' }}
              >
                {num}
              </div>
            ))}
          </div>
        )}

        {/* Editor Container */}
        <div className="relative flex-1 overflow-hidden">
          {/* Syntax Highlighting Layer */}
          {highlightedCode && (
            <div
              ref={highlightRef}
              className="absolute inset-0 px-3 py-3 font-mono text-sm leading-6 overflow-auto pointer-events-none whitespace-pre-wrap break-words"
              style={{
                color: 'transparent',
                caretColor: 'black',
              }}
            >
              {highlightedCode}
            </div>
          )}

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            placeholder={placeholder}
            spellCheck={false}
            className="absolute inset-0 w-full h-full px-3 py-3 font-mono text-sm leading-6 resize-none outline-none bg-transparent overflow-auto"
            style={{
              color: highlightedCode ? 'transparent' : 'inherit',
              caretColor: 'black',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
