'use client';

import React, { useCallback, useEffect, useState } from 'react';
import DfaCanvas from './DfaCanvas';
import DfaControls from './DfaControls';
import DfaTracePanel from './DfaTracePanel';
import { DFASimulator, SimulationResult } from '@/core/dfa/dfaSimulator';
import { layoutDFA } from '@/core/dfa/dfaLayout';
import { dfa } from '@/core/dfa/dfaModel';

interface AdvancedDfaVisualizerProps {
  onClose?: () => void;
}

const AdvancedDfaVisualizer: React.FC<AdvancedDfaVisualizerProps> = ({ onClose }) => {
  // Default sample code to show when component loads
  const defaultCode = `// Simple arithmetic program
function calculateSum(a, b) {
  var result = a + b;
  return result;
}

let x = 10;
let y = 20.5;
let sum = calculateSum(x, y);`;

  const [input, setInput] = useState<string>(defaultCode);
  const [simulator, setSimulator] = useState<DFASimulator | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1);
  const [highlightedTransition, setHighlightedTransition] = useState<string | null>(null);

  const layout = layoutDFA(dfa);

  // Initialize simulator when input changes
  useEffect(() => {
    if (input.trim()) {
      const newSimulator = new DFASimulator(dfa);
      newSimulator.initialize(input);
      setSimulator(newSimulator);
      setCurrentStepIndex(0);
      setResult(null);
      setIsRunning(false);
    }
  }, [input]);

  // Auto-advance for playback
  useEffect(() => {
    if (!isRunning || !simulator) return;

    const interval = setInterval(() => {
      const canStep = simulator.step();
      if (canStep || simulator.getSteps().length > currentStepIndex + 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsRunning(false);
        setResult(simulator.getResult());
      }
    }, 500 / animationSpeed);

    return () => clearInterval(interval);
  }, [isRunning, simulator, currentStepIndex, animationSpeed]);

  const handleStep = useCallback(() => {
    if (!simulator) return;

    const canStep = simulator.step();
    if (canStep || simulator.getSteps().length > currentStepIndex + 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
    setResult(simulator.getResult());
  }, [simulator, currentStepIndex]);

  const handleRunAll = useCallback(() => {
    if (!simulator) return;

    while (simulator.step()) {
      // Continue stepping
    }

    setCurrentStepIndex(simulator.getSteps().length - 1);
    setResult(simulator.getResult());
    setIsRunning(false);
  }, [simulator]);

  const handleReset = useCallback(() => {
    if (!simulator) return;

    simulator.reset();
    setCurrentStepIndex(0);
    setResult(null);
    setIsRunning(false);
  }, [simulator]);

  const handlePlayPause = useCallback((play: boolean) => {
    setIsRunning(play);
  }, []);

  const handleStepSelect = useCallback(
    (index: number) => {
      if (!simulator) return;

      // Reset to beginning
      simulator.reset();

      // Step to selected index
      for (let i = 0; i < index && i < simulator.getSteps().length; i++) {
        simulator.step();
      }

      setCurrentStepIndex(index);
    },
    [simulator]
  );

  const allSteps = simulator?.getSteps() || [];
  const currentStep = allSteps[currentStepIndex];
  const currentState = currentStep?.currentState;
  
  // Get total steps including simulated ones
  const totalSimulatedSteps = allSteps.length;

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Advanced DFA Simulator</h2>
            <p className="text-sm text-gray-600 mt-1">
              Step through DFA execution character by character
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4">
        {/* Left panel: DFA Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4">
            <DfaCanvas
              layout={layout}
              currentState={currentState}
              highlightedTransition={highlightedTransition}
              onStateClick={(stateId) => {
                console.log('State clicked:', stateId);
              }}
              onTransitionHover={setHighlightedTransition}
            />
          </div>

          {/* DFA Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-600 font-semibold">States</div>
              <div className="text-2xl font-bold text-blue-700">{layout.nodes.length}</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <div className="text-xs text-indigo-600 font-semibold">Transitions</div>
              <div className="text-2xl font-bold text-indigo-700">{layout.edges.length}</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-xs text-purple-600 font-semibold">Accepting States</div>
              <div className="text-2xl font-bold text-purple-700">
                {layout.nodes.filter((n) => n.type === 'accept').length}
              </div>
            </div>
          </div>
        </div>

        {/* Middle panel: Controls */}
        <div className="w-80 flex flex-col gap-4 overflow-y-auto">
          <DfaControls
            input={input}
            onInputChange={setInput}
            onStep={handleStep}
            onRunAll={handleRunAll}
            onReset={handleReset}
            isRunning={isRunning}
            onPlayPause={handlePlayPause}
            currentStep={currentStep}
            totalSteps={totalSimulatedSteps}
            currentStepIndex={currentStepIndex}
            animationSpeed={animationSpeed}
            onSpeedChange={setAnimationSpeed}
          />
        </div>

        {/* Right panel: Trace */}
        <div className="w-96 flex flex-col overflow-hidden">
          <DfaTracePanel
            result={result || (simulator ? simulator.getResult() : null)}
            currentStepIndex={currentStepIndex}
            onStepSelect={handleStepSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedDfaVisualizer;
