'use client';

import React from 'react';
import Link from 'next/link';
import ErrorVisualizations from '@/components/ErrorVisualization';
import { ArrowLeft, AlertTriangle, Shield } from 'lucide-react';

export default function ErrorsPage() {
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
                Error Detection & Handling
              </h1>
              <p className="text-sm text-gray-600">See how the DFA detects and reports errors</p>
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
          <span className="text-gray-600">Error Cases</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">
                Error Detection in Lexical Analysis
              </h3>
              <p className="text-sm text-red-800 mt-1">
                The DFA can encounter invalid characters or patterns that don&apos;t match any recognized token. When this happens,
                the analyzer reports the error with its position and type. Understanding these errors is crucial for debugging
                source code.
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
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">Common Error Cases</h2>
          </div>

          {/* Error Examples Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ErrorVisualizations className="h-96" />
          </div>

          {/* Error Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">
                Invalid Characters
              </h3>
              <p className="text-red-800 text-sm mb-3">
                Characters like @, #, $, etc. are not part of the valid token set and will trigger an error.
              </p>
              <div className="bg-white p-3 rounded text-sm font-mono text-red-700 border border-red-200">
                x = 42 @#$ error
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">
                Unclosed Strings
              </h3>
              <p className="text-orange-800 text-sm mb-3">
                String literals must have both opening and closing quotes. A missing closing quote is an error.
              </p>
              <div className="bg-white p-3 rounded text-sm font-mono text-orange-700 border border-orange-200">
                str = &quot;unclosed
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                Mixed Valid/Invalid
              </h3>
              <p className="text-yellow-800 text-sm mb-3">
                Some tokens may be valid while others are invalid in the same input. The analyzer reports all errors found.
              </p>
              <div className="bg-white p-3 rounded text-sm font-mono text-yellow-700 border border-yellow-200">
                valid = 123; @invalid;
              </div>
            </div>
          </div>

          {/* Error Resolution Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  How to Fix Errors
                </h3>
                <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                  <li>Check the error position in the error report</li>
                  <li>Look for invalid characters and replace them with valid ones</li>
                  <li>Ensure all strings are properly closed with quotes</li>
                  <li>Verify that identifiers start with a letter</li>
                  <li>Check that operators are in the valid set (+, -, *, /, ==, !=, etc.)</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Error Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Error Types Reference
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Error Type</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 text-red-600 font-mono">INVALID_CHARACTER</td>
                    <td className="px-4 py-2 text-gray-700">Unrecognized character in input</td>
                    <td className="px-4 py-2 text-gray-600 font-mono">@, #, $</td>
                  </tr>
                  <tr className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 text-red-600 font-mono">UNCLOSED_STRING</td>
                    <td className="px-4 py-2 text-gray-700">String literal not closed</td>
                    <td className="px-4 py-2 text-gray-600 font-mono">&quot;hello</td>
                  </tr>
                  <tr className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 text-red-600 font-mono">UNEXPECTED_CHARACTER</td>
                    <td className="px-4 py-2 text-gray-700">Character doesn&apos;t fit current state</td>
                    <td className="px-4 py-2 text-gray-600 font-mono">42abc (number followed by letter)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-[1800px] mx-auto px-6 py-8 mt-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Ready to analyze your code?
          </h3>
          <p className="text-gray-600 mb-4">
            Now that you understand how errors are detected, try analyzing your own code in the main analyzer to see these
            principles in action.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            Go to Analyzer
          </Link>
        </div>
      </footer>
    </main>
  );
}
