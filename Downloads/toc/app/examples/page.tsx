'use client';

import React from 'react';
import Link from 'next/link';
import StaticDfaVisualizations from '@/components/StaticDfaVisualizations';
import { ArrowLeft, BookOpen, Zap } from 'lucide-react';

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Analyzer
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                DFA Execution Examples
              </h1>
              <p className="text-sm text-gray-600">Learn how the DFA tokenizes different code patterns</p>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-[1800px] mx-auto px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Home
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-600">Examples</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900">
                Understanding DFA Tokenization
              </h3>
              <p className="text-sm text-blue-800 mt-1">
                Below are examples of how the Deterministic Finite Automaton (DFA) processes different types of code.
                Each example shows the input code, the DFA visualization with visited states highlighted, the number of
                states visited, characters processed, and the final status.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Basic Examples</h2>
          </div>

          {/* Examples Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <StaticDfaVisualizations className="h-96" />
          </div>

          {/* Key Concepts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Number Literals
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                Integer and floating-point numbers are recognized by the DFA. Each digit transition is tracked through the state machine.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-700">
                42, 3.14, 100
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Identifiers & Operators
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                Variable names start with a letter, followed by alphanumeric characters. Operators like = are recognized separately.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-700">
                x = 10, count, result
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                String Literals
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                Strings are enclosed in quotes. The DFA tracks the opening quote until the closing quote is found.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-700">
                &quot;hello&quot;, &quot;world&quot;
              </div>
            </div>
          </div>

          {/* DFA States Explanation */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">
              How to Read the Examples
            </h3>
            <div className="space-y-2 text-sm text-amber-800">
              <p><strong>States:</strong> Number of unique states visited during tokenization</p>
              <p><strong>Chars:</strong> Total characters processed from the input</p>
              <p><strong>Status:</strong> OK if all tokens recognized, ERROR if invalid characters found</p>
              <p><strong>Visualization:</strong> Blue nodes = visited states, Gray nodes = unvisited states</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-[1800px] mx-auto px-6 py-8 mt-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Want to see error handling?
          </h3>
          <p className="text-gray-600 mb-4">
            Check out our Error Cases page to see how the DFA handles invalid input and malformed code patterns.
          </p>
          <Link
            href="/errors"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            View Error Cases
          </Link>
        </div>
      </footer>
    </main>
  );
}
