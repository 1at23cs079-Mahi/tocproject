# Lexical Analyzer - DFA-Based Token Analysis

A modern, full-stack web application for lexical analysis using **Deterministic Finite Automata (DFA)**. Built with Next.js, React, TypeScript, and Tailwind CSS following software engineering best practices.

![Lexical Analyzer](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌐 Live Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F1at23cs079-Mahi%2Ftocproject&project-name=lexical-analyzer-dfa&repository-name=tocproject)

## 🎯 Overview

This lexical analyzer (lexer) breaks source code into **tokens** using a DFA-based approach. It provides:

- **Token Analysis**: Identifies keywords, identifiers, operators, literals, punctuation, and comments
- **Error Detection**: Catches invalid characters and malformed tokens with precise location tracking
- **Syntax Highlighting**: Color-codes tokens for better visualization
- **DFA Visualization**: Interactive state diagram showing the automaton structure
- **Real-time Analysis**: Immediate feedback with line and column tracking

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd toc
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 🌍 Vercel Deployment

### One-Click Deploy

Click the button below to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F1at23cs079-Mahi%2Ftocproject&project-name=lexical-analyzer-dfa&repository-name=tocproject)

### Manual Deployment via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy from project directory**:
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment

### GitHub Integration

Connect your GitHub repository to Vercel for automatic deployments:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select your GitHub repository
4. Vercel will automatically detect Next.js configuration
5. Click "Deploy"

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run format` | Format code with Prettier |

## 🏗️ Architecture

The application follows **Clean Architecture** principles with clear separation of concerns:

```
toc/
├── app/                      # Next.js 14 App Router
│   ├── page.tsx             # Main application page
│   ├── layout.tsx           # Root layout with metadata
│   └── globals.css          # Global styles
├── components/              # React components (Presentation Layer)
│   ├── CodeEditor.tsx       # Code input with line numbers
│   ├── TokenTable.tsx       # Token display with filtering/sorting
│   ├── ErrorPanel.tsx       # Error messages display
│   ├── DfaVisualizer.tsx    # DFA state diagram
│   └── SyntaxHighlighter.tsx # Token-based syntax highlighting
├── core/                    # Business logic (Domain Layer)
│   ├── types.ts            # TypeScript interfaces and enums
│   ├── samples.ts          # Sample code snippets
│   └── lexer/
│       ├── dfa.ts          # DFA implementation and lexical analyzer
│       └── visualization.ts # DFA visualization data generator
├── __tests__/              # Unit tests
│   └── lexer.test.ts       # Comprehensive lexer tests
└── [config files]          # TypeScript, ESLint, Tailwind, Jest configs
```

### Layer Responsibilities

- **Presentation Layer** (`components/`, `app/`): UI components and user interaction
- **Application Layer**: Use cases orchestrated in page components
- **Domain Layer** (`core/`): DFA logic, token definitions, lexical analysis
- **Infrastructure Layer**: Next.js framework, build configuration

## 🤖 DFA Model Explanation

### States

The lexical analyzer uses a **Deterministic Finite Automaton** with the following states:

| State | Description | Accepting |
|-------|-------------|-----------|
| `START` | Initial state | No |
| `IN_IDENTIFIER` | Processing identifier/keyword | Yes |
| `IN_NUMBER` | Processing integer | Yes |
| `IN_FLOAT` | Processing floating-point number | Yes |
| `IN_STRING` | Processing string literal | Yes |
| `IN_OPERATOR` | Processing operator | Yes |
| `IN_COMMENT` | Processing comment | Yes |
| `WHITESPACE` | Processing whitespace | Yes |
| `PUNCTUATION` | Single-character punctuation | Yes |
| `ERROR` | Invalid character | No |

### Transition Logic

```
START state transitions:
  - letter [a-zA-Z_]           → IN_IDENTIFIER
  - digit [0-9]                → IN_NUMBER
  - quote [" or ']             → IN_STRING
  - operator [+, -, *, /, etc.] → IN_OPERATOR
  - "//"                       → IN_COMMENT
  - whitespace                 → WHITESPACE
  - punctuation [(, ), {, etc.] → PUNCTUATION (immediate accept)
  - other                      → ERROR

IN_IDENTIFIER:
  - letter/digit               → IN_IDENTIFIER (self-loop)
  - other                      → Accept, return to START

IN_NUMBER:
  - digit                      → IN_NUMBER (self-loop)
  - '.' followed by digit      → IN_FLOAT
  - other                      → Accept, return to START

IN_FLOAT:
  - digit                      → IN_FLOAT (self-loop)
  - other                      → Accept, return to START

IN_STRING:
  - any character              → IN_STRING (self-loop)
  - closing quote              → Accept, return to START
  - EOF                        → Error (unterminated string)

IN_OPERATOR:
  - Check multi-char operators → IN_OPERATOR or Accept
  
IN_COMMENT:
  - any character              → IN_COMMENT (self-loop)
  - newline                    → Accept, return to START
```

### Token Recognition Rules

1. **Keywords**: Matched from predefined set (if, else, while, for, etc.)
2. **Identifiers**: Start with letter/underscore, followed by letters/digits/underscores
3. **Numbers**: Sequences of digits, optionally with decimal point and fractional part
4. **Strings**: Enclosed in " or ', supports escape sequences
5. **Operators**: Single-char (+, -, *, /) or multi-char (==, !=, <=, >=, &&, ||, ===, !==)
6. **Comments**: Start with //, continue to end of line
7. **Punctuation**: (, ), {, }, [, ], ;, ,, ., :, ?

## 🎨 Features

### Core Features

- ✅ **DFA-Based Tokenization**: Pure finite automaton implementation
- ✅ **Comprehensive Token Types**: Keywords, identifiers, numbers, strings, operators, punctuation
- ✅ **Error Detection**: Invalid characters, unterminated strings with precise location
- ✅ **Line/Column Tracking**: Every token includes position information
- ✅ **Syntax Highlighting**: Real-time color-coded token display
- ✅ **DFA Visualization**: Interactive state diagram with ReactFlow

### UI/UX Features

- 🎯 **Modern Interface**: Clean, responsive design with Tailwind CSS
- 🔍 **Token Filtering**: Search and filter tokens by type or content
- 📊 **Sortable Table**: Click column headers to sort tokens
- 📝 **Code Editor**: Line numbers, syntax highlighting overlay
- 🎨 **Category Color Coding**: Visual distinction between token types
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎛️ **Sample Code**: Pre-built examples for quick testing

### Developer Features

- 🧪 **Unit Tests**: Comprehensive Jest test suite
- 📐 **TypeScript**: Full type safety throughout
- 🎯 **SOLID Principles**: Clean, maintainable code structure
- 📖 **Well-Documented**: Extensive comments and documentation
- 🔧 **ESLint + Prettier**: Consistent code style
- ⚡ **Fast Development**: Hot reload with Next.js

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Test coverage includes:
- Keyword recognition
- Identifier validation
- Number parsing (integers and floats)
- String literal handling (with escape sequences)
- Operator recognition (single and multi-character)
- Comment processing
- Line and column tracking
- Error detection and recovery
- Complex code scenarios

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend Framework** | Next.js 14 (App Router) |
| **UI Library** | React 18 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **Visualization** | ReactFlow |
| **Icons** | Lucide React |
| **Testing** | Jest + React Testing Library |
| **Linting** | ESLint + Prettier |
| **Build Tool** | Next.js (Turbopack in dev) |

## 📚 Supported Language Features

### Keywords (26)
```
if, else, while, for, return, function, var, let, const,
int, float, string, boolean, true, false, null, undefined,
class, this, new, void, break, continue, switch, case, default,
do, try, catch, finally, throw, import, export, from, as
```

### Operators (30+)
```
Arithmetic: +, -, *, /, %
Comparison: ==, !=, <, >, <=, >=, ===, !==
Logical: &&, ||, !
Bitwise: &, |, ^, ~, <<, >>
Assignment: =, +=, -=, *=, /=, %=
Increment/Decrement: ++, --
```

### Literals
- **Integers**: 0, 123, 999
- **Floats**: 3.14, 0.5, 123.456
- **Strings**: "hello", 'world', with escape sequences

### Punctuation
```
( ) { } [ ] ; , . : ?
```

### Comments
```javascript
// Single-line comments
```

## 🎓 Educational Value

This project demonstrates:

1. **Compiler Design**: First phase of compilation (lexical analysis)
2. **Automata Theory**: Practical DFA implementation
3. **Software Engineering**: Clean architecture, SOLID principles
4. **Modern Web Development**: React, TypeScript, Next.js best practices
5. **Testing**: Comprehensive unit test coverage
6. **UI/UX Design**: Responsive, accessible interface

## 🤝 Contributing

To extend the lexer:

1. **Add new token types** in `core/types.ts`
2. **Extend DFA logic** in `core/lexer/dfa.ts`
3. **Update visualization** in `core/lexer/visualization.ts`
4. **Add tests** in `__tests__/lexer.test.ts`
5. **Update color schemes** in `components/TokenTable.tsx` and `SyntaxHighlighter.tsx`

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- Built following principles from "Compilers: Principles, Techniques, and Tools" (Dragon Book)
- DFA concepts based on formal language theory
- Modern web development practices from the React and Next.js communities

## 📞 Support

For issues or questions:
1. Check the DFA documentation in `core/lexer/dfa.ts`
2. Review test cases in `__tests__/lexer.test.ts`
3. Examine sample code in `core/samples.ts`

---

**Built with ❤️ using Clean Architecture and DFA Theory**
