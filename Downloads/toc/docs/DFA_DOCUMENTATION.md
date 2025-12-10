# DFA Documentation

## Deterministic Finite Automaton for Lexical Analysis

This document provides a detailed explanation of the DFA implementation used in the lexical analyzer.

## Table of Contents
1. [Overview](#overview)
2. [State Definitions](#state-definitions)
3. [Transition Function](#transition-function)
4. [Alphabet](#alphabet)
5. [Accepting States](#accepting-states)
6. [Implementation Details](#implementation-details)

## Overview

A **Deterministic Finite Automaton (DFA)** is a theoretical model of computation consisting of:
- A finite set of states
- An input alphabet
- A transition function
- A start state
- A set of accepting states

In lexical analysis, the DFA processes input character by character, transitioning between states until it reaches an accepting state, at which point it emits a token.

## State Definitions

### START
- **Purpose**: Initial state before processing any characters
- **Type**: Non-accepting
- **Transitions**: Can transition to any other state based on input

### IN_IDENTIFIER
- **Purpose**: Processing identifiers and keywords
- **Type**: Accepting
- **Entry**: First character is a letter or underscore
- **Loop**: Continues while input is letter, digit, or underscore
- **Token Emission**: Checks keyword list; emits KEYWORD or IDENTIFIER

### IN_NUMBER
- **Purpose**: Processing integer literals
- **Type**: Accepting
- **Entry**: First character is a digit
- **Loop**: Continues while input is a digit
- **Special**: Can transition to IN_FLOAT on '.' followed by digit
- **Token Emission**: Emits NUMBER token

### IN_FLOAT
- **Purpose**: Processing floating-point literals
- **Type**: Accepting
- **Entry**: From IN_NUMBER when '.' followed by digit is encountered
- **Loop**: Continues while input is a digit
- **Token Emission**: Emits FLOAT token

### IN_STRING
- **Purpose**: Processing string literals
- **Type**: Accepting (when properly closed)
- **Entry**: Opening quote (single or double)
- **Loop**: Continues until closing quote or EOF
- **Special**: Handles escape sequences (\\, \n, \", etc.)
- **Error**: Unterminated string at EOF
- **Token Emission**: Emits STRING token

### IN_OPERATOR
- **Purpose**: Processing operators
- **Type**: Accepting
- **Entry**: Operator character (+, -, *, /, =, <, >, !, &, |, etc.)
- **Lookahead**: Checks for multi-character operators (==, !=, <=, >=, etc.)
- **Token Emission**: Emits OPERATOR token

### IN_COMMENT
- **Purpose**: Processing single-line comments
- **Type**: Accepting
- **Entry**: '//' sequence
- **Loop**: Continues until newline or EOF
- **Token Emission**: Emits COMMENT token

### WHITESPACE
- **Purpose**: Processing whitespace
- **Type**: Accepting
- **Entry**: Space, tab, newline, or carriage return
- **Loop**: Continues while input is whitespace
- **Token Emission**: Emits WHITESPACE token

### PUNCTUATION
- **Purpose**: Single-character punctuation
- **Type**: Accepting (immediate)
- **Entry**: (, ), {, }, [, ], ;, ,, ., :, ?
- **Token Emission**: Immediately emits PUNCTUATION token

### ERROR
- **Purpose**: Invalid input
- **Type**: Non-accepting
- **Entry**: Any character not handled by other states
- **Action**: Records error, continues to next character

## Transition Function

The transition function δ: Q × Σ → Q is implemented as follows:

```
δ(START, letter) = IN_IDENTIFIER
δ(START, digit) = IN_NUMBER
δ(START, quote) = IN_STRING
δ(START, operator_char) = IN_OPERATOR
δ(START, '/' and peek='/') = IN_COMMENT
δ(START, whitespace) = WHITESPACE
δ(START, punctuation) = PUNCTUATION
δ(START, other) = ERROR

δ(IN_IDENTIFIER, letter|digit|'_') = IN_IDENTIFIER
δ(IN_IDENTIFIER, other) = ACCEPT → START

δ(IN_NUMBER, digit) = IN_NUMBER
δ(IN_NUMBER, '.' and peek=digit) = IN_FLOAT
δ(IN_NUMBER, other) = ACCEPT → START

δ(IN_FLOAT, digit) = IN_FLOAT
δ(IN_FLOAT, other) = ACCEPT → START

δ(IN_STRING, any_except_quote) = IN_STRING
δ(IN_STRING, quote) = ACCEPT → START
δ(IN_STRING, EOF) = ERROR

δ(IN_OPERATOR, matches_multi_char) = IN_OPERATOR
δ(IN_OPERATOR, other) = ACCEPT → START

δ(IN_COMMENT, any_except_newline) = IN_COMMENT
δ(IN_COMMENT, newline|EOF) = ACCEPT → START

δ(WHITESPACE, whitespace) = WHITESPACE
δ(WHITESPACE, other) = ACCEPT → START

δ(PUNCTUATION, *) = ACCEPT → START (immediate)

δ(ERROR, *) = START (after recording error)
```

## Alphabet

The input alphabet Σ consists of:

### Character Classes
- **Letters**: a-z, A-Z, _
- **Digits**: 0-9
- **Quotes**: ", '
- **Operators**: +, -, *, /, %, =, <, >, !, &, |, ^, ~
- **Punctuation**: (, ), {, }, [, ], ;, ,, ., :, ?
- **Whitespace**: space, tab, \n, \r
- **Special**: / (for comments and division)
- **Other**: Any other printable character (triggers ERROR state)

### Multi-Character Sequences
- **Two-character operators**: ==, !=, <=, >=, &&, ||, ++, --, +=, -=, *=, /=, %=, <<, >>
- **Three-character operators**: ===, !==
- **Comment start**: //
- **Escape sequences**: \\, \n, \t, \", \', etc. (inside strings)

## Accepting States

States that can produce tokens:

| State | Token Type | Condition |
|-------|-----------|-----------|
| IN_IDENTIFIER | KEYWORD or IDENTIFIER | Based on keyword lookup |
| IN_NUMBER | NUMBER | Always |
| IN_FLOAT | FLOAT | Always |
| IN_STRING | STRING | Only if properly closed |
| IN_OPERATOR | OPERATOR | Always |
| IN_COMMENT | COMMENT | Always |
| WHITESPACE | WHITESPACE | Always |
| PUNCTUATION | PUNCTUATION | Immediate |

## Implementation Details

### Position Tracking

The lexer maintains:
- **position**: Current index in input string
- **line**: Current line number (1-indexed)
- **column**: Current column number (1-indexed)

Each token records the line and column where it starts.

### Lookahead

The lexer uses single-character lookahead in several cases:
1. **IN_NUMBER**: Check if '.' is followed by digit (for float detection)
2. **IN_OPERATOR**: Check for multi-character operators
3. **START**: Check if '/' is followed by '/' (for comment detection)

### Error Recovery

When an invalid character is encountered:
1. Record error with position information
2. Add ERROR token to token list
3. Advance to next character
4. Continue processing (don't halt)

This allows the lexer to find multiple errors in a single pass.

### Keyword Recognition

After recognizing an identifier:
1. Check if lexeme is in keyword set
2. If yes: emit KEYWORD token
3. If no: emit IDENTIFIER token

This is more efficient than having separate DFA paths for each keyword.

### String Escape Handling

Inside IN_STRING state:
1. If backslash encountered, consume next character
2. This allows \", \\, \n, etc.
3. Prevents premature string termination

### Operator Greedy Matching

The lexer uses greedy matching for operators:
1. Consume first operator character
2. Check if first+second forms valid operator
3. If yes, consume second and check for third
4. Continue until no longer match

Example: "===" is recognized as one token, not "==" + "="

## Time Complexity

- **Per character**: O(1) - constant time transition
- **Overall**: O(n) where n is input length
- **No backtracking**: DFA property ensures linear time

## Space Complexity

- **Token storage**: O(t) where t is number of tokens
- **Error storage**: O(e) where e is number of errors
- **State machine**: O(1) - fixed size regardless of input

## Advantages of This Design

1. **Deterministic**: No ambiguity in state transitions
2. **Linear Time**: Processes input in single pass
3. **Error Tolerant**: Continues after errors
4. **Position Accurate**: Tracks exact location of each token
5. **Extensible**: Easy to add new token types
6. **Testable**: Clear state transitions enable thorough testing

## Formal Definition

**Formally**, the DFA is a 5-tuple (Q, Σ, δ, q₀, F) where:

- **Q** = {START, IN_IDENTIFIER, IN_NUMBER, IN_FLOAT, IN_STRING, IN_OPERATOR, IN_COMMENT, WHITESPACE, PUNCTUATION, ERROR}
- **Σ** = All ASCII printable characters
- **δ** = Transition function as defined above
- **q₀** = START
- **F** = {IN_IDENTIFIER, IN_NUMBER, IN_FLOAT, IN_STRING, IN_OPERATOR, IN_COMMENT, WHITESPACE, PUNCTUATION}

---

For implementation details, see `core/lexer/dfa.ts`.
