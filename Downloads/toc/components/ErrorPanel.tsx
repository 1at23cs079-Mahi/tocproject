'use client';

import React from 'react';
import { LexicalError } from '@/core/types';
import { AlertCircle } from 'lucide-react';

interface ErrorPanelProps {
  errors: LexicalError[];
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ errors }) => {
  if (errors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 text-green-600">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Errors</h3>
            <p className="text-sm text-gray-600">Lexical analysis completed successfully!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200">
      {/* Header */}
      <div className="p-4 bg-red-50 border-b border-red-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">
            Lexical Errors ({errors.length})
          </h3>
        </div>
      </div>

      {/* Error List */}
      <div className="divide-y divide-red-100 max-h-64 overflow-y-auto">
        {errors.map((error, index) => (
          <div key={index} className="p-4 hover:bg-red-50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800 mb-1">{error.message}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>
                    <span className="font-medium">Line:</span> {error.line}
                  </span>
                  <span>
                    <span className="font-medium">Column:</span> {error.column}
                  </span>
                  {error.lexeme && (
                    <span>
                      <span className="font-medium">Lexeme:</span>{' '}
                      <code className="px-1 py-0.5 bg-gray-100 rounded text-red-700">
                        {error.lexeme}
                      </code>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorPanel;
