'use client';

import React, { useEffect, useRef } from 'react';
import { SimulationStep, SimulationResult } from '@/core/dfa/dfaSimulator';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface DfaTracePanelProps {
  result?: SimulationResult | null;
  currentStepIndex: number;
  onStepSelect: (index: number) => void;
}

const DfaTracePanel: React.FC<DfaTracePanelProps> = ({
  result,
  currentStepIndex,
  onStepSelect,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current step
  useEffect(() => {
    if (tableRef.current) {
      const currentRow = tableRef.current.querySelector(
        `[data-step="${currentStepIndex}"]`
      );
      if (currentRow) {
        currentRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStepIndex]);

  if (!result || result.steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">No Execution Trace Yet</h3>
        <p className="text-xs text-gray-500 mb-4">
          Click <strong>Step</strong>, <strong>Play</strong>, or <strong>Run All</strong> to start the simulation
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-left">
          <p className="text-blue-800 font-semibold mb-1">💡 Quick Start:</p>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Input is already loaded</li>
            <li>Click <strong>Step</strong> to advance one character</li>
            <li>Or click <strong>Run All</strong> for full execution</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">Execution Trace</h3>
        <div className="flex gap-4 text-xs">
          <div>
            <span className="font-semibold text-gray-600">Steps:</span>
            <span className="ml-1 text-gray-800">{result.steps.length}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Status:</span>
            <span className="ml-1 flex items-center gap-1">
              {result.accepted ? (
                <>
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-green-700 font-semibold">Accepted</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  <span className="text-red-700 font-semibold">Rejected</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Trace table */}
      <div ref={tableRef} className="flex-1 overflow-y-auto">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 w-12">#</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 w-16">
                Char
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">
                Current State
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">
                Next State
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Transition</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 w-20">
                Token
              </th>
            </tr>
          </thead>
          <tbody>
            {result.steps.map((step, index) => (
              <StepRow
                key={`step-${index}`}
                step={step}
                index={index}
                isCurrent={currentStepIndex === index}
                onClick={() => onStepSelect(index)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with tokens found */}
      {result.tokensFound && result.tokensFound.length > 0 && (
        <div className="px-4 py-3 bg-green-50 border-t border-gray-200 max-h-32 overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-800 mb-2">Tokens Found:</h4>
          <div className="space-y-1">
            {result.tokensFound.map((token, idx) => (
              <div
                key={idx}
                className="text-xs px-2 py-1 bg-white border border-green-200 rounded"
              >
                <span className="font-semibold text-green-700">{token.type}</span>
                <span className="text-gray-600 ml-2">&quot;{token.lexeme}&quot;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors section */}
      {result.errors && result.errors.length > 0 && (
        <div className="px-4 py-3 bg-red-50 border-t border-gray-200 max-h-32 overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-800 mb-2">Errors:</h4>
          <div className="space-y-1">
            {result.errors.map((error, idx) => (
              <div
                key={idx}
                className="text-xs px-2 py-1 bg-white border border-red-200 rounded"
              >
                <span className="font-semibold text-red-700">{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface StepRowProps {
  step: SimulationStep;
  index: number;
  isCurrent: boolean;
  onClick: () => void;
}

const StepRow: React.FC<StepRowProps> = ({ step, index, isCurrent, onClick }) => {
  const getCharDisplay = () => {
    if (step.currentChar === '\n') return '\\n';
    if (step.currentChar === '\t') return '\\t';
    if (step.currentChar === ' ') return '·';
    return step.currentChar;
  };

  const getTransitionLabel = () => {
    if (step.error) return 'ERROR';
    if (!step.transition) return '-';
    return step.transition.description.substring(0, 15);
  };

  const getTokenDisplay = () => {
    if (step.isAccepting) {
      return (
        <span className="text-green-700 font-semibold">
          {step.tokenType ? step.tokenType.substring(0, 10) : 'TOKEN'}
        </span>
      );
    }
    return '-';
  };

  return (
    <tr
      data-step={index}
      onClick={onClick}
      className={`border-b border-gray-200 cursor-pointer transition-colors ${
        isCurrent
          ? 'bg-blue-100 hover:bg-blue-150'
          : 'hover:bg-gray-50'
      } ${step.error ? 'bg-red-50' : ''}`}
    >
      <td className="px-3 py-2 text-gray-700 font-semibold">
        {isCurrent ? (
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        ) : null}
        {index}
      </td>
      <td className="px-3 py-2 font-mono text-gray-800 bg-gray-50 rounded">
        {getCharDisplay()}
      </td>
      <td className="px-3 py-2">
        <span
          className={`px-2 py-1 rounded text-white text-xs font-semibold ${
            step.currentState === 'ERROR'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
        >
          {step.currentState.substring(0, 8)}
        </span>
      </td>
      <td className="px-3 py-2">
        {step.nextState ? (
          <span
            className={`px-2 py-1 rounded text-white text-xs font-semibold ${
              step.nextState === 'ERROR'
                ? 'bg-red-500'
                : step.isAccepting
                ? 'bg-green-500'
                : 'bg-indigo-500'
            }`}
          >
            {step.nextState.substring(0, 8)}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-3 py-2 text-gray-600 font-mono text-xs truncate">
        {getTransitionLabel()}
      </td>
      <td className="px-3 py-2">{getTokenDisplay()}</td>
    </tr>
  );
};

export default DfaTracePanel;
