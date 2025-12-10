'use client';

import React, { useState } from 'react';
import CodeEditor from '@/components/CodeEditor';
import TokenTable from '@/components/TokenTable';
import ErrorPanel from '@/components/ErrorPanel';
import DfaVisualizer from '@/components/DfaVisualizer';
import StaticDfaVisualizations from '@/components/StaticDfaVisualizations';
import ErrorVisualizations from '@/components/ErrorVisualization';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import AdvancedDfaVisualizer from '@/components/AdvancedDfaVisualizer';
import { analyzeCode } from '@/core/lexer/dfa';
import { Token, LexicalError } from '@/core/types';
import { SAMPLES } from '@/core/samples';
import { Play, Code, FileText, AlertCircle, Activity, Zap } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [errors, setErrors] = useState<LexicalError[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState<'tokens' | 'errors' | 'dfa' | 'simulator'>('tokens');

  const handleAnalyze = () => {
    const result = analyzeCode(code);
    setTokens(result.tokens);
    setErrors(result.errors);
    setHasAnalyzed(true);
  };

  const handleLoadSample = (sampleCode: string) => {
    setCode(sampleCode);
    setHasAnalyzed(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lexical Analyzer
                </h1>
                <p className="text-sm text-gray-600">DFA-Based Token Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {SAMPLES.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleLoadSample(sample.code)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                About Lexical Analysis
              </h3>
              <p className="text-sm text-blue-800 mt-1">
                A lexical analyzer (lexer) breaks source code into tokens using a Deterministic
                Finite Automaton (DFA). Each token represents a meaningful unit like keywords,
                identifiers, operators, or literals. This tool analyzes your code and displays
                tokens with their type, position, and category.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Example DFA Visualizations */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">DFA Execution Examples</h2>
        <StaticDfaVisualizations className="h-80" />
      </div>

      {/* Error Visualizations */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Error Detection Examples</h2>
        <ErrorVisualizations className="h-80" />
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Editor */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-800">Source Code</h2>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!code.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Play className="w-4 h-4" />
                  Analyze
                </button>
              </div>
              <div className="h-[600px]">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  highlightedCode={
                    hasAnalyzed ? <SyntaxHighlighter code={code} tokens={tokens} /> : undefined
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4">
            {/* Tab Navigation */}
            {hasAnalyzed && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('tokens')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'tokens'
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Tokens ({tokens.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('errors')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'errors'
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    Errors ({errors.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('dfa')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'dfa'
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    DFA Diagram
                  </button>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'simulator'
                        ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    Advanced Simulator
                  </button>
                </div>

                <div className="p-4">
                  {activeTab === 'tokens' && (
                    <div className="h-[600px]">
                      <TokenTable tokens={tokens} />
                    </div>
                  )}
                  {activeTab === 'errors' && <ErrorPanel errors={errors} />}
                  {activeTab === 'dfa' && (
                    <div className="h-[600px]">
                      <DfaVisualizer input={code} />
                    </div>
                  )}
                  {activeTab === 'simulator' && (
                    <div className="h-[600px]">
                      <AdvancedDfaVisualizer />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Initial State - DFA Visualization */}
            {!hasAnalyzed && (
              <div className="space-y-4">
                <div className="h-[600px]">
                  <DfaVisualizer input={code} />
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Getting Started
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                    <li>Load a sample program from the buttons above or write your own code</li>
                    <li>Click the &quot;Analyze&quot; button to run lexical analysis</li>
                    <li>View the generated tokens, errors, and syntax highlighting</li>
                    <li>Explore the DFA diagram to understand the state transitions</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-[1800px] mx-auto px-6 py-8 mt-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Supported Language Features
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Keywords</h4>
              <p className="text-gray-600">if, else, while, for, return, function, var, let, const, class, etc.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Operators</h4>
              <p className="text-gray-600">+, -, *, /, ==, !=, &lt;=, &gt;=, &amp;&amp;, ||, etc.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Literals</h4>
              <p className="text-gray-600">Numbers (int/float), strings, booleans</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Others</h4>
              <p className="text-gray-600">Comments (//), punctuation, identifiers</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
