'use client';

import React, { useMemo, useState } from 'react';
import { Token } from '@/core/types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface TokenTableProps {
  tokens: Token[];
}

const TokenTable: React.FC<TokenTableProps> = ({ tokens }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<keyof Token | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(tokens.map((t) => t.category));
    return ['all', ...Array.from(cats)];
  }, [tokens]);

  // Filter tokens
  const filteredTokens = useMemo(() => {
    let result = tokens;

    // Filter by category
    if (filterCategory !== 'all') {
      result = result.filter((token) => token.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (token) =>
          token.lexeme.toLowerCase().includes(term) ||
          token.type.toLowerCase().includes(term) ||
          token.category.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortDirection === 'asc' 
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [tokens, searchTerm, filterCategory, sortColumn, sortDirection]);

  const handleSort = (column: keyof Token) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon: React.FC<{ column: keyof Token }> = ({ column }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Color coding for categories
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Keyword':
        return 'bg-purple-100 text-purple-800';
      case 'Identifier':
        return 'bg-blue-100 text-blue-800';
      case 'Literal':
        return 'bg-green-100 text-green-800';
      case 'Operator':
        return 'bg-orange-100 text-orange-800';
      case 'Punctuation':
        return 'bg-gray-100 text-gray-800';
      case 'Comment':
        return 'bg-teal-100 text-teal-800';
      case 'Whitespace':
        return 'bg-gray-50 text-gray-600';
      case 'Error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header Controls */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Tokens ({filteredTokens.length})
          </h3>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Token Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('index')}
              >
                <div className="flex items-center gap-1">
                  # <SortIcon column="index" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('lexeme')}
              >
                <div className="flex items-center gap-1">
                  Lexeme <SortIcon column="lexeme" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-1">
                  Token Type <SortIcon column="type" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center gap-1">
                  Category <SortIcon column="category" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('line')}
              >
                <div className="flex items-center gap-1">
                  Line <SortIcon column="line" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('column')}
              >
                <div className="flex items-center gap-1">
                  Column <SortIcon column="column" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTokens.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No tokens found
                </td>
              </tr>
            ) : (
              filteredTokens.map((token) => (
                <tr key={token.index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{token.index}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-900 max-w-xs truncate">
                    {token.lexeme}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{token.type}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        token.category
                      )}`}
                    >
                      {token.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{token.line}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{token.column}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenTable;
