# Project Visual Overview

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                     (Browser - localhost:3000)                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                           │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │  CodeEditor    │  │  TokenTable    │  │  ErrorPanel      │  │
│  │  - Line numbers│  │  - Search      │  │  - Messages      │  │
│  │  - Highlighting│  │  - Filter      │  │  - Locations     │  │
│  └────────────────┘  │  - Sort        │  └──────────────────┘  │
│                      └────────────────┘                          │
│  ┌────────────────┐  ┌────────────────────────────────────────┐ │
│  │ DfaVisualizer  │  │  SyntaxHighlighter                     │ │
│  │ - State diagram│  │  - Color-coded tokens                  │ │
│  └────────────────┘  └────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  app/page.tsx (Main Application Logic)                   │   │
│  │  - User interactions                                      │   │
│  │  - State management (code, tokens, errors)               │   │
│  │  - Orchestrates analysis flow                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  core/lexer/dfa.ts (Business Logic)                      │   │
│  │                                                           │   │
│  │  LexicalAnalyzer Class:                                  │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  1. analyze(input: string)                      │    │   │
│  │  │     ↓                                            │    │   │
│  │  │  2. Character-by-character processing           │    │   │
│  │  │     ↓                                            │    │   │
│  │  │  3. DFA State Transitions                       │    │   │
│  │  │     ↓                                            │    │   │
│  │  │  4. Token Emission                              │    │   │
│  │  │     ↓                                            │    │   │
│  │  │  5. Return LexicalAnalysisResult                │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  core/types.ts (Data Structures)                         │   │
│  │  - Token, LexicalError, DFAState                         │   │
│  │  - TokenType, TokenCategory enums                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## DFA State Machine

```
                    ┌──────────┐
                    │  START   │ (Initial State)
                    └────┬─────┘
                         │
           ┌─────────────┼─────────────┬──────────────┐
           │             │             │              │
        letter        digit        quote          operator
           │             │             │              │
           ▼             ▼             ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
    │IDENTIFIER│  │  NUMBER  │  │  STRING  │  │ OPERATOR │
    │          │  │          │  │          │  │          │
    │ (ACCEPT) │  │ (ACCEPT) │  │ (ACCEPT) │  │ (ACCEPT) │
    └──────────┘  └────┬─────┘  └──────────┘  └──────────┘
                       │
                    '.' + digit
                       │
                       ▼
                  ┌──────────┐
                  │  FLOAT   │
                  │          │
                  │ (ACCEPT) │
                  └──────────┘

    Additional states:
    - IN_COMMENT (for //)
    - WHITESPACE (for spaces, tabs, newlines)
    - PUNCTUATION (immediate accept)
    - ERROR (invalid characters)
```

---

## Token Processing Flow

```
Input: "var x = 5;"
       │
       ▼
    ┌─────────────────────────────────────────┐
    │ Character-by-Character Processing       │
    └─────────────────────────────────────────┘
       │
       ├─► 'v' 'a' 'r' ──► "var" (KEYWORD)
       │
       ├─► ' ' ──────────► " " (WHITESPACE)
       │
       ├─► 'x' ──────────► "x" (IDENTIFIER)
       │
       ├─► ' ' ──────────► " " (WHITESPACE)
       │
       ├─► '=' ──────────► "=" (OPERATOR)
       │
       ├─► ' ' ──────────► " " (WHITESPACE)
       │
       ├─► '5' ──────────► "5" (NUMBER)
       │
       └─► ';' ──────────► ";" (PUNCTUATION)
       │
       ▼
    ┌─────────────────────────────────────────┐
    │ LexicalAnalysisResult                   │
    │ {                                       │
    │   tokens: [                             │
    │     { lexeme: "var", type: KEYWORD },   │
    │     { lexeme: " ", type: WHITESPACE },  │
    │     { lexeme: "x", type: IDENTIFIER },  │
    │     { lexeme: " ", type: WHITESPACE },  │
    │     { lexeme: "=", type: OPERATOR },    │
    │     { lexeme: " ", type: WHITESPACE },  │
    │     { lexeme: "5", type: NUMBER },      │
    │     { lexeme: ";", type: PUNCTUATION }  │
    │   ],                                    │
    │   errors: [],                           │
    │   success: true                         │
    │ }                                       │
    └─────────────────────────────────────────┘
```

---

## Data Flow Architecture

```
┌─────────────┐
│    User     │
│   Action    │
└──────┬──────┘
       │ 1. Types code
       ▼
┌─────────────────┐
│  CodeEditor     │
│  component      │
└──────┬──────────┘
       │ 2. Updates state
       ▼
┌─────────────────┐
│  page.tsx       │
│  (React State)  │
│  code: string   │
└──────┬──────────┘
       │ 3. User clicks "Analyze"
       ▼
┌─────────────────┐
│  analyzeCode()  │
│  function       │
└──────┬──────────┘
       │ 4. Calls
       ▼
┌─────────────────────┐
│  LexicalAnalyzer    │
│  .analyze(code)     │
└──────┬──────────────┘
       │ 5. Returns result
       ▼
┌─────────────────────┐
│  page.tsx           │
│  setTokens(...)     │
│  setErrors(...)     │
└──────┬──────────────┘
       │ 6. Re-render
       ▼
┌─────────────────────┐
│  UI Components      │
│  - TokenTable       │
│  - ErrorPanel       │
│  - Highlighter      │
└─────────────────────┘
```

---

## Component Hierarchy

```
App (page.tsx)
│
├── Header
│   ├── Title & Logo
│   └── Sample Buttons
│
├── Info Banner
│   └── About Lexical Analysis
│
├── Main Content (2-column grid)
│   │
│   ├── Left Panel
│   │   └── CodeEditor
│   │       ├── Line Numbers
│   │       ├── Text Input
│   │       └── Syntax Highlighting Overlay
│   │
│   └── Right Panel
│       └── Tabbed Interface
│           ├── Tokens Tab
│           │   └── TokenTable
│           │       ├── Search Bar
│           │       ├── Category Filter
│           │       └── Sortable Table
│           │
│           ├── Errors Tab
│           │   └── ErrorPanel
│           │       └── Error List
│           │
│           └── DFA Tab
│               └── DfaVisualizer
│                   ├── State Diagram
│                   ├── Controls
│                   └── Legend
│
└── Footer
    └── Language Features Info
```

---

## File Organization

```
toc/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Main page component
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React Components
│   ├── CodeEditor.tsx           # [100 lines]
│   ├── TokenTable.tsx           # [200 lines]
│   ├── ErrorPanel.tsx           # [80 lines]
│   ├── DfaVisualizer.tsx        # [130 lines]
│   └── SyntaxHighlighter.tsx    # [90 lines]
│
├── core/                         # Business Logic
│   ├── types.ts                 # [100 lines] Interfaces & Enums
│   ├── samples.ts               # [50 lines] Sample code
│   ├── utils.ts                 # [100 lines] Utilities
│   └── lexer/
│       ├── dfa.ts               # [450 lines] DFA Implementation ⭐
│       └── visualization.ts     # [70 lines] DFA viz data
│
├── __tests__/                    # Unit Tests
│   └── lexer.test.ts            # [400 lines] 25 test cases
│
├── docs/                         # Documentation
│   ├── DFA_DOCUMENTATION.md     # DFA theory
│   └── ARCHITECTURE.md          # Software architecture
│
├── [config files]                # Configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── jest.config.js
│   ├── .eslintrc.json
│   └── .prettierrc
│
└── [documentation]               # User docs
    ├── README.md                # Main documentation
    ├── QUICKSTART.md            # Getting started
    ├── PROJECT_SUMMARY.md       # Completion summary
    └── LANGUAGE_REFERENCE.md    # Language features
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  React 18 + TypeScript 5 + Tailwind CSS │
│  Components, Hooks, State Management     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Framework Layer                  │
│  Next.js 14 (App Router + SSG)          │
│  Routing, Building, Optimization         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Business Logic Layer             │
│  Pure TypeScript                         │
│  DFA Implementation, Token Processing    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Testing Layer                    │
│  Jest + Testing Library                  │
│  Unit Tests, Integration Tests           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Build & Quality Layer            │
│  TypeScript Compiler, ESLint, Prettier   │
│  Type Checking, Linting, Formatting      │
└─────────────────────────────────────────┘
```

---

## Token Categories Color Coding

```
┌──────────────┬──────────────┬─────────────────┐
│  Category    │    Color     │    Example      │
├──────────────┼──────────────┼─────────────────┤
│  Keyword     │   Purple     │   if, while     │
│  Identifier  │   Blue       │   myVar         │
│  Literal     │   Green      │   123, "text"   │
│  Operator    │   Orange     │   +, ==, &&     │
│  Punctuation │   Gray       │   ;, (, {       │
│  Comment     │   Gray Italic│   // comment    │
│  Whitespace  │   Light Gray │   (spaces)      │
│  Error       │   Red        │   @, #          │
└──────────────┴──────────────┴─────────────────┘
```

---

## Performance Characteristics

```
Input Size: n characters

┌─────────────────────┬──────────────┐
│  Operation          │  Complexity  │
├─────────────────────┼──────────────┤
│  Lexical Analysis   │    O(n)      │
│  State Transitions  │    O(1)      │
│  Token Emission     │    O(1)      │
│  Position Tracking  │    O(1)      │
│  Total Time         │    O(n)      │
│  Space Used         │    O(t)      │  (t = tokens)
└─────────────────────┴──────────────┘

Linear time complexity - processes each character exactly once!
```

---

## Test Coverage Map

```
✅ Keywords (2 tests)
✅ Identifiers (2 tests)
✅ Numbers (3 tests)
✅ Strings (4 tests)
✅ Operators (3 tests)
✅ Comments (2 tests)
✅ Punctuation (1 test)
✅ Position Tracking (2 tests)
✅ Error Detection (2 tests)
✅ Complex Code (2 tests)
✅ Whitespace (2 tests)

Total: 25 tests covering all token types and edge cases
```

---

This visual overview provides a comprehensive understanding of the project's structure, flow, and architecture at a glance.
