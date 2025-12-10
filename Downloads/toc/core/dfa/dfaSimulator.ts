/**
 * DFA Simulation Engine
 * Simulates step-by-step execution of the DFA on input strings
 */

import {
  DFAModel,
  DFAState,
  DFATransition,
  findTransition,
  getStateById,
  isAcceptingState,
} from './dfaModel';

/**
 * Represents the execution state during simulation
 */
export interface SimulationStep {
  stepNumber: number;
  currentState: string;
  inputIndex: number;
  currentChar: string;
  nextState: string | null;
  transition: DFATransition | null;
  isAccepting: boolean;
  error: string | null;
  tokenStart: number;
  tokenType: string | null;
}

/**
 * Complete simulation result
 */
export interface SimulationResult {
  input: string;
  steps: SimulationStep[];
  accepted: boolean;
  finalState: string;
  errors: string[];
  tokensFound: TokenResult[];
}

/**
 * Detected token
 */
export interface TokenResult {
  lexeme: string;
  type: string;
  startIndex: number;
  endIndex: number;
  line: number;
  column: number;
}

/**
 * DFA Simulator
 */
export class DFASimulator {
  private dfa: DFAModel;
  private input: string = '';
  private steps: SimulationStep[] = [];
  private currentStepIndex: number = 0;
  private errors: string[] = [];
  private tokens: TokenResult[] = [];

  constructor(dfa: DFAModel) {
    this.dfa = dfa;
  }

  /**
   * Initialize simulation with input string
   */
  initialize(input: string): void {
    this.input = input;
    this.steps = [];
    this.currentStepIndex = 0;
    this.errors = [];
    this.tokens = [];

    // Create initial step
    const initialStep: SimulationStep = {
      stepNumber: 0,
      currentState: this.dfa.startStateId,
      inputIndex: 0,
      currentChar: input[0] || '',
      nextState: null,
      transition: null,
      isAccepting: false,
      error: null,
      tokenStart: 0,
      tokenType: null,
    };

    this.steps.push(initialStep);
  }

  /**
   * Execute one step of the simulation
   */
  step(): boolean {
    if (this.currentStepIndex >= this.input.length) {
      return false;
    }

    const currentStep = this.steps[this.steps.length - 1];
    const char = this.input[currentStep.inputIndex];

    if (currentStep.inputIndex >= this.input.length) {
      return false;
    }

    // Find next state based on current character
    const nextState = this.findNextState(currentStep.currentState, char);

    if (!nextState) {
      // Error - no valid transition
      this.errors.push(
        `Invalid character '${char}' at position ${currentStep.inputIndex}`
      );
      
      const errorStep: SimulationStep = {
        stepNumber: this.steps.length,
        currentState: 'ERROR',
        inputIndex: currentStep.inputIndex + 1,
        currentChar: this.input[currentStep.inputIndex + 1] || '',
        nextState: null,
        transition: null,
        isAccepting: false,
        error: `Cannot transition from ${currentStep.currentState} with '${char}'`,
        tokenStart: currentStep.tokenStart,
        tokenType: null,
      };
      
      this.steps.push(errorStep);
      this.currentStepIndex++;
      return currentStep.inputIndex + 1 < this.input.length;
    }

    // Special case: if we're transitioning to IN_COMMENT from START with '/', consume two characters
    let charsConsumed = 1;
    if (currentStep.currentState === 'START' && char === '/' && nextState === 'IN_COMMENT') {
      charsConsumed = 2; // Consume both '/' characters
    }

    const transition = findTransition(
      this.dfa,
      currentStep.currentState,
      nextState
    );

    // Create new step
    const newStep: SimulationStep = {
      stepNumber: this.steps.length,
      currentState: nextState,
      inputIndex: currentStep.inputIndex + charsConsumed,
      currentChar: this.input[currentStep.inputIndex + charsConsumed] || '',
      nextState: null,
      transition: transition || null,
      isAccepting: isAcceptingState(this.dfa, nextState),
      error: null,
      tokenStart: currentStep.tokenStart,
      tokenType: this.getTokenType(nextState),
    };

    this.steps.push(newStep);
    this.currentStepIndex++;

    return newStep.inputIndex < this.input.length;
  }

  /**
   * Run full simulation to completion
   */
  runAll(): SimulationResult {
    this.initialize(this.input);

    while (this.currentStepIndex < this.input.length) {
      const nextStep = this.step();
      if (!nextStep) break;
    }

    return this.getResult();
  }

  /**
   * Get complete simulation result
   */
  getResult(): SimulationResult {
    const lastStep = this.steps[this.steps.length - 1];

    return {
      input: this.input,
      steps: this.steps,
      accepted: lastStep ? isAcceptingState(this.dfa, lastStep.currentState) : false,
      finalState: lastStep?.currentState || this.dfa.startStateId,
      errors: this.errors,
      tokensFound: this.tokens,
    };
  }

  /**
   * Get current step
   */
  getCurrentStep(): SimulationStep {
    return this.steps[this.currentStepIndex] || this.steps[0];
  }

  /**
   * Get all steps so far
   */
  getSteps(): SimulationStep[] {
    return this.steps;
  }

  /**
   * Reset simulation
   */
  reset(): void {
    this.currentStepIndex = 0;
    this.steps = [];
    this.errors = [];
    this.tokens = [];
  }

  /**
   * Find next state for given input character
   */
  private findNextState(currentState: string, char: string): string | null {
    const transitions = this.dfa.transitions.filter((t) => t.from === currentState);

    // Special handling for comment start
    if (currentState === 'START' && char === '/') {
      // Check if next character is also '/'
      const nextChar = this.input[this.steps[this.steps.length - 1].inputIndex + 1];
      if (nextChar === '/') {
        return 'IN_COMMENT';
      }
      // Otherwise, treat as operator
      return 'IN_OPERATOR';
    }

    for (const transition of transitions) {
      // Skip the '//' transition as we handle it above
      if (transition.input === '//') continue;
      
      if (this.matchesInput(char, transition.input)) {
        return transition.to;
      }
    }

    return null;
  }

  /**
   * Check if character matches input pattern
   */
  private matchesInput(char: string, pattern: string): boolean {
    // Simple character class matching
    if (pattern === '[a-zA-Z_]') return /[a-zA-Z_]/.test(char);
    if (pattern === '[0-9]') return /[0-9]/.test(char);
    if (pattern === '[a-zA-Z0-9_]') return /[a-zA-Z0-9_]/.test(char);
    if (pattern === '[\"\']') return /["\']/.test(char);
    if (pattern === '[+\\-*/%=<>!&|^]') return /[+\-*/%=<>!&|^]/.test(char);
    if (pattern === '[\\s]') return /\s/.test(char);
    if (pattern === '[()\\{\\}\\[\\];,.:?]') return /[(){}[\];,.:?]/.test(char);
    if (pattern === '\\.') return char === '.';
    if (pattern === '[^"\']') return !/["']/.test(char);
    if (pattern === '[^\\n]') return char !== '\n';
    if (pattern === 'Other') return true; // Catch-all for errors

    return false;
  }

  /**
   * Get token type for state
   */
  private getTokenType(stateId: string): string | null {
    const state = getStateById(this.dfa, stateId);
    return state?.acceptsToken || null;
  }
}

/**
 * Create a new simulator for the DFA
 */
export function createSimulator(dfa: DFAModel): DFASimulator {
  return new DFASimulator(dfa);
}

/**
 * Simulate complete input and get result
 */
export function simulateInput(dfa: DFAModel, input: string): SimulationResult {
  const simulator = new DFASimulator(dfa);
  simulator.initialize(input);
  return simulator.runAll();
}
