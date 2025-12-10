# Architecture Documentation

## Clean Architecture Implementation

This project follows **Clean Architecture** principles to ensure maintainability, testability, and scalability.

## Architectural Layers

### 1. Presentation Layer (UI)

**Location**: `app/`, `components/`

**Responsibility**: User interface and user interaction

**Components**:
- `page.tsx`: Main application page orchestrating all features
- `CodeEditor.tsx`: Text input with line numbers and syntax highlighting
- `TokenTable.tsx`: Tabular display with search, filter, and sort
- `ErrorPanel.tsx`: Error messages with formatting
- `DfaVisualizer.tsx`: Interactive state diagram
- `SyntaxHighlighter.tsx`: Color-coded token display

**Dependencies**: Only depends on Application and Domain layers (via imports)

**Key Characteristics**:
- React functional components with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- No business logic

### 2. Application Layer (Use Cases)

**Location**: Orchestrated in `app/page.tsx`

**Responsibility**: Application-specific business rules and use case coordination

**Use Cases Implemented**:
1. **Analyze Code**: User clicks "Analyze" → calls `analyzeCode()` → updates UI state
2. **Load Sample**: User selects sample → updates editor content
3. **Filter Tokens**: User searches/filters → TokenTable component handles locally
4. **View DFA**: User switches tab → displays visualization

**Key Characteristics**:
- Thin layer - mostly coordination
- State management with React hooks
- No direct DFA implementation

### 3. Domain Layer (Business Logic)

**Location**: `core/`

**Responsibility**: Core business logic, independent of UI and frameworks

**Modules**:

#### `core/types.ts`
- Type definitions (Token, LexicalError, DFA states)
- Enums (TokenType, TokenCategory, DFAState)
- Interfaces for data structures

#### `core/lexer/dfa.ts`
- **LexicalAnalyzer class**: DFA implementation
- State management and transitions
- Token emission logic
- Error detection and recovery
- Position tracking (line/column)

#### `core/lexer/visualization.ts`
- DFA visualization data generation
- Node and edge definitions for ReactFlow

#### `core/samples.ts`
- Sample code snippets
- Test cases for the lexer

**Key Characteristics**:
- Pure TypeScript (no React)
- No external dependencies (except type definitions)
- Fully testable in isolation
- Framework-agnostic

### 4. Infrastructure Layer

**Location**: Configuration files, Next.js framework

**Responsibility**: Technical implementation details

**Components**:
- Next.js routing and rendering
- TypeScript compilation
- Tailwind CSS processing
- Jest test execution
- ESLint and Prettier

**Key Characteristics**:
- Framework and tooling configuration
- Build and development pipelines
- No business logic

## Dependency Rule

**The Dependency Rule**: Source code dependencies point **inward**.

```
[Presentation] ──→ [Application] ──→ [Domain]
      ↓                                  ↑
[Infrastructure] ─────────────────────┘
```

- **Presentation** depends on **Application** and **Domain**
- **Application** depends on **Domain**
- **Domain** depends on **nothing** (pure business logic)
- **Infrastructure** supports all layers but doesn't contain business logic

### Example Dependency Flow

1. User clicks "Analyze" button (Presentation)
2. Page component calls `analyzeCode(code)` (Application)
3. `analyzeCode` creates `LexicalAnalyzer` and calls `analyze()` (Domain)
4. DFA processes input character by character (Domain)
5. Returns `LexicalAnalysisResult` (Domain)
6. Application layer updates React state (Application)
7. UI components re-render with new data (Presentation)

## SOLID Principles Applied

### Single Responsibility Principle (SRP)

Each class/module has one reason to change:

- `LexicalAnalyzer`: Only changes if tokenization rules change
- `CodeEditor`: Only changes if editor UI requirements change
- `TokenTable`: Only changes if token display requirements change
- `DfaVisualizer`: Only changes if visualization requirements change

### Open/Closed Principle (OCP)

Open for extension, closed for modification:

- **Adding new token types**: Extend `TokenType` enum and add recognition logic
- **Adding new operators**: Add to operator sets, no need to change core DFA logic
- **Adding new keywords**: Add to keyword set, no structural changes

### Liskov Substitution Principle (LSP)

Not heavily applicable (no inheritance hierarchy), but:

- All components accept props interfaces that can be extended
- Token types all follow same interface structure

### Interface Segregation Principle (ISP)

Clients don't depend on interfaces they don't use:

- `Token` interface contains only necessary fields
- Component props are minimal and specific
- No "god interfaces" with unused fields

### Dependency Inversion Principle (DIP)

High-level modules don't depend on low-level modules:

- `page.tsx` depends on `analyzeCode` **function** (abstraction)
- Components depend on **interfaces** (`Token`, `LexicalError`)
- Core logic doesn't depend on UI framework

## Data Flow

### Lexical Analysis Flow

```
User Input (string)
    ↓
analyzeCode(code)
    ↓
new LexicalAnalyzer()
    ↓
analyzer.analyze(input)
    ↓
Character-by-character processing
    ↓
State transitions in DFA
    ↓
Token emission
    ↓
LexicalAnalysisResult { tokens, errors }
    ↓
React state update
    ↓
Component re-render
    ↓
UI displays tokens/errors
```

### Component Data Flow

```
App State (code, tokens, errors)
    ↓
├─→ CodeEditor (code, onChange)
│       ↓
│   User types → onChange → updates state
│
├─→ TokenTable (tokens)
│       ↓
│   Displays tokens with filtering
│
├─→ ErrorPanel (errors)
│       ↓
│   Displays error messages
│
└─→ DfaVisualizer ()
        ↓
    Static DFA visualization
```

## Testing Strategy

### Unit Tests (Domain Layer)

**Location**: `__tests__/lexer.test.ts`

**Coverage**:
- All token types (keywords, identifiers, numbers, etc.)
- Error cases (invalid characters, unterminated strings)
- Position tracking (line and column numbers)
- Complex scenarios (complete functions, mixed tokens)

**Characteristics**:
- Fast execution (no UI rendering)
- Isolated from framework
- High confidence in core logic

### Integration Tests (Application Layer)

Could be added to test:
- User interaction flows
- State management
- Component integration

### E2E Tests

Could be added with Playwright/Cypress to test:
- Full user workflows
- Visual regression
- Cross-browser compatibility

## Scalability Considerations

### Horizontal Scalability

- **Client-side execution**: No backend required, infinite users
- **Static deployment**: Can deploy to CDN
- **No state synchronization**: Each session independent

### Vertical Scalability

- **Large inputs**: DFA is O(n) time complexity
- **Memory**: Tokens stored in array, manageable for typical code files
- **Could add**: Streaming for very large files, web workers for heavy processing

### Feature Extensibility

Easy to add:
1. **New token types**: Extend enum and add DFA logic
2. **Multi-line comments**: Add new state and transitions
3. **More operators**: Add to operator sets
4. **Export functionality**: Add button that downloads tokens as JSON/CSV
5. **Code completion**: Use token stream for suggestions
6. **Syntax tree generation**: Use tokens as input to parser

## Code Quality Measures

### Type Safety

- **TypeScript strict mode**: Catches errors at compile time
- **Explicit interfaces**: All data structures typed
- **No `any` types**: Except where absolutely necessary

### Code Style

- **ESLint**: Enforces consistent patterns
- **Prettier**: Automatic formatting
- **Naming conventions**: Clear, descriptive names

### Documentation

- **Inline comments**: Explaining complex DFA logic
- **JSDoc comments**: For public functions
- **README**: Comprehensive setup and usage guide
- **Architecture docs**: This file

### Performance

- **React optimization**: Memoization where appropriate
- **Efficient DFA**: No backtracking, linear time
- **Minimal re-renders**: Proper state management

## Future Enhancements

Potential additions maintaining clean architecture:

1. **Parser Integration**: Add syntactic analysis after lexical analysis
2. **Custom Language Definition**: Allow users to define their own tokens
3. **Code Formatting**: Use token stream to format code
4. **API Mode**: Add backend for heavy processing or storage
5. **Collaborative Editing**: Add real-time multi-user support
6. **Advanced Visualization**: Animate DFA execution step-by-step

All enhancements would follow the same architectural principles:
- Domain logic stays pure
- UI remains decoupled
- Tests cover new functionality
- Documentation updated

---

This architecture ensures the codebase remains maintainable, testable, and extensible as requirements evolve.
