'use client';

import React from 'react';
import { SimulationStep } from '@/core/dfa/dfaSimulator';
import { Play, Pause, RotateCcw, SkipForward, Zap } from 'lucide-react';

interface DfaControlsProps {
  input: string;
  onInputChange: (input: string) => void;
  onStep: () => void;
  onRunAll: () => void;
  onReset: () => void;
  isRunning: boolean;
  onPlayPause: (playing: boolean) => void;
  currentStep?: SimulationStep;
  totalSteps: number;
  currentStepIndex: number;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const DfaControls: React.FC<DfaControlsProps> = ({
  input,
  onInputChange,
  onStep,
  onRunAll,
  onReset,
  isRunning,
  onPlayPause,
  currentStep,
  totalSteps,
  currentStepIndex,
  animationSpeed,
  onSpeedChange,
}) => {
  return (
    <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Input section */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Input String
        </label>
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          rows={4}
          placeholder="Enter source code to analyze..."
        />
        <div className="mt-2 text-xs text-gray-600">
          Length: {input.length} | Characters: {input.split('').filter((c) => c.trim()).length}
        </div>
      </div>

      {/* Step indicator */}
      {currentStep ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
          <div className="text-xs font-semibold text-blue-900">
            Step {currentStepIndex + 1} / {totalSteps || '?'}
          </div>
          <div className="text-xs text-blue-800">
            <div>
              <span className="font-semibold">Current State:</span> {currentStep.currentState}
            </div>
            <div>
              <span className="font-semibold">Input Char:</span> &apos;{currentStep.currentChar}&apos;
            </div>
            {currentStep.nextState && (
              <div>
                <span className="font-semibold">Next State:</span> {currentStep.nextState}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-600 text-center">
            Click <strong>Step</strong> or <strong>Play</strong> to begin
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={() => onPlayPause(!isRunning)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={onStep}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium text-sm"
        >
          <SkipForward className="w-4 h-4" />
          Step
        </button>
        <button
          onClick={onRunAll}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
        >
          <Zap className="w-4 h-4" />
          Run All
        </button>
      </div>

      {/* Speed control */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Animation Speed: {animationSpeed.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.25"
          value={animationSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Quick samples */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Quick Samples
        </label>
        <div className="space-y-1">
          {[
            { label: 'Number', code: '42' },
            { label: 'Float', code: '3.14' },
            { label: 'Identifier', code: 'myVar' },
            { label: 'Operator', code: '==' },
            { label: 'String', code: '&quot;hello&quot;' },
            { label: 'Error', code: '@#$' },
          ].map((sample) => (
            <button
              key={sample.label}
              onClick={() => onInputChange(sample.code)}
              className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              {sample.label}: <code>{sample.code}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DfaControls;
