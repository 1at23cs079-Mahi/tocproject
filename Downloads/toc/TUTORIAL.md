# 🎬 Step-by-Step Tutorial

## Complete Walkthrough of the Lexical Analyzer

This tutorial walks you through using the Lexical Analyzer from installation to advanced features.

---

## Part 1: Installation & First Run (5 minutes)

### Step 1: Verify Prerequisites
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm
npm --version
```

### Step 2: Navigate to Project
```bash
cd "c:\Users\mahes\Downloads\toc"
```

### Step 3: Verify Installation
```bash
# Run health check
node check-project.js
```
Expected: All checks should pass ✅

### Step 4: Start Development Server
```bash
npm run dev
```
Expected output:
```
✓ Ready in 2s
- Local: http://localhost:3000
```

### Step 5: Open Browser
Navigate to: `http://localhost:3000`

You should see:
- Clean, modern interface
- Title: "Lexical Analyzer"
- Empty code editor on the left
- DFA diagram on the right
- Sample code buttons at the top

---

## Part 2: Basic Usage (10 minutes)

### Example 1: Simple Variable Declaration

**Step 1**: Click the "Arithmetic" sample button

**Step 2**: Observe the loaded code:
```javascript
// Simple arithmetic program
function calculateSum(a, b) {
  var result = a + b;
  return result;
}

let x = 10;
let y = 20.5;
let sum = calculateSum(x, y);
```

**Step 3**: Click the blue "Analyze" button

**Step 4**: Explore the results:
- **Tokens Tab**: See all identified tokens
  - Notice "function" is marked as KEYWORD
  - "calculateSum" is an IDENTIFIER
  - "10" is a NUMBER
  - "20.5" is a FLOAT

**Step 5**: Check the syntax highlighting
- Keywords appear in purple
- Identifiers in blue
- Numbers in green
- Operators in orange

### Example 2: Filtering Tokens

**Step 1**: In the Tokens tab, use the search box
- Type "var"
- See only tokens containing "var"

**Step 2**: Use the category filter
- Select "Keyword" from dropdown
- See only keyword tokens (if, function, var, let, return)

**Step 3**: Sort the tokens
- Click on "Line" column header
- Tokens sort by line number
- Click again to reverse order

### Example 3: Finding Errors

**Step 1**: Click "With Errors" sample button

**Step 2**: Observe the code with intentional errors:
```javascript
// Code with errors
var num = 123abc;  // Invalid
let str = "unclosed string
let invalid = @#$;
```

**Step 3**: Click "Analyze"

**Step 4**: Switch to the "Errors" tab
- See error: "Invalid character: '@'"
- See error: "Unterminated string literal"
- Each error shows line and column number

---

## Part 3: Understanding the DFA (15 minutes)

### Viewing the State Diagram

**Step 1**: Switch to "DFA Diagram" tab

**Step 2**: Observe the states:
- **Blue circle (START)**: Initial state
- **Green circles**: Accepting states (emit tokens)
- **Red circle (ERROR)**: Invalid input state

**Step 3**: Understand transitions:
- "letter" from START → IDENTIFIER
- "digit" from START → NUMBER
- "quote" from START → STRING

### Tracing Token Recognition

Let's trace how "var x = 5;" is tokenized:

**Input**: `v`
- State: START → IN_IDENTIFIER (saw letter)

**Input**: `a`
- State: IN_IDENTIFIER → IN_IDENTIFIER (still letter)

**Input**: `r`
- State: IN_IDENTIFIER → IN_IDENTIFIER (still letter)

**Input**: ` ` (space)
- State: IN_IDENTIFIER → ACCEPT → START
- **Token Emitted**: "var" (KEYWORD)
- State: START → WHITESPACE

**Input**: `x`
- State: START → IN_IDENTIFIER

**Input**: ` ` (space)
- State: IN_IDENTIFIER → ACCEPT → START
- **Token Emitted**: "x" (IDENTIFIER)

... and so on.

---

## Part 4: Advanced Features (10 minutes)

### Working with Complex Code

**Step 1**: Load "Control Flow" sample

**Step 2**: Analyze and observe:
- Nested control structures (if, for, while)
- Multiple operators (>, <, ++, --, +=)
- Mixed token types

**Step 3**: Count token types:
Look at the token table and mentally count:
- How many KEYWORD tokens?
- How many OPERATOR tokens?
- How many IDENTIFIER tokens?

### Testing Edge Cases

**Step 1**: Clear the editor and type:
```javascript
let x = 123.456;
```

**Step 2**: Analyze and verify:
- "123.456" is recognized as a FLOAT (not NUMBER)
- One token, not separate tokens

**Step 3**: Now type:
```javascript
let x = 123.;
```

**Step 4**: Analyze and observe:
- "123" is a NUMBER
- "." is PUNCTUATION (not part of the number!)

**Step 5**: Test operators:
```javascript
x === y
x !== z
```

**Step 6**: Verify:
- "===" is ONE token (OPERATOR)
- "!==" is ONE token (OPERATOR)
- Not three separate "=" or "!"

### Understanding Escapes

**Step 1**: Type a string with escapes:
```javascript
let msg = "Hello \"World\"";
```

**Step 2**: Analyze and check:
- The entire string including escapes is ONE token
- Type: STRING
- Lexeme: `"Hello \"World\""`

---

## Part 5: Real-World Usage (15 minutes)

### Scenario 1: Debugging Code

You have buggy code:
```javascript
var count = 0@
while (count < 10) {
  count+;
}
```

**Analysis**:
1. Click Analyze
2. Check Errors tab
3. See: "Invalid character: '@'" at line 1, column 16
4. See: Token "+" at line 3 - incomplete increment operator
5. Fix: Remove "@", change "count+" to "count++"

### Scenario 2: Learning Token Types

Write this code:
```javascript
if (true && false || !null) {
  return 42;
}
```

**Analysis**:
1. Analyze
2. View Tokens tab
3. Learn that:
   - "&&" is a single OPERATOR token
   - "||" is a single OPERATOR token
   - "!" is a single OPERATOR token
   - "true", "false", "null" are KEYWORD tokens

### Scenario 3: Validating Syntax

Before running code, check for lexical errors:

```javascript
function test() {
  var x = "incomplete string
  return x;
}
```

**Analysis**:
1. Analyze first
2. Find error before running
3. Fix unterminated string
4. Re-analyze to confirm fix

---

## Part 6: Understanding Results (10 minutes)

### Token Table Columns Explained

| Column | Meaning | Example |
|--------|---------|---------|
| # | Token index (order) | 0, 1, 2... |
| Lexeme | Actual text | "var", "x", "=" |
| Token Type | Classification | KEYWORD, IDENTIFIER |
| Category | Grouping | Keyword, Literal |
| Line | Line number | 1, 2, 3... |
| Column | Column position | 1, 5, 7... |

### Categories Explained

**Keyword**: Reserved words with special meaning
- Examples: if, while, return, function

**Identifier**: User-defined names
- Examples: myVar, counter, userName

**Literal**: Constant values
- Examples: 42 (number), "text" (string), 3.14 (float)

**Operator**: Operations
- Examples: +, ==, &&, ++

**Punctuation**: Structure symbols
- Examples: ;, (, {, [

**Comment**: Non-executable text
- Examples: // comment

**Whitespace**: Spaces, tabs, newlines
- Usually filtered out in later compiler phases

**Error**: Invalid tokens
- Examples: @, #, $, unterminated strings

---

## Part 7: Testing (5 minutes)

### Running Unit Tests

**Step 1**: Open a new terminal

**Step 2**: Navigate to project:
```bash
cd "c:\Users\mahes\Downloads\toc"
```

**Step 3**: Run tests:
```bash
npm test
```

**Expected Output**:
```
PASS  __tests__/lexer.test.ts
  Lexical Analyzer - DFA
    Keywords
      ✓ should recognize keywords
      ✓ should distinguish keywords from identifiers
    Identifiers
      ✓ should recognize valid identifiers
      ...
    
Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
```

### Understanding Test Coverage

Tests cover:
- ✅ All token types
- ✅ Edge cases
- ✅ Error detection
- ✅ Position tracking
- ✅ Complex scenarios

---

## Part 8: Tips & Tricks (5 minutes)

### Productivity Tips

1. **Use Sample Buttons**: Quick way to load test code
2. **Search Tokens**: Find specific tokens quickly
3. **Filter by Category**: Focus on token types
4. **Sort Columns**: Organize by line, type, etc.
5. **Check Errors First**: Before diving into tokens

### Common Mistakes

❌ **Forgetting Quotes**: `let x = hello` (should be "hello")
✅ **Correct**: `let x = "hello"`

❌ **Incomplete Operators**: `count+` (should be count++)
✅ **Correct**: `count++`

❌ **Invalid Characters**: `var @x = 5`
✅ **Correct**: `var x = 5`

❌ **Unterminated Strings**: `let s = "text`
✅ **Correct**: `let s = "text"`

### Performance Notes

- **Fast Analysis**: O(n) complexity - linear time
- **Large Files**: Can handle thousands of lines
- **Real-time**: Instant analysis on click
- **Responsive**: Works on desktop, tablet, mobile

---

## Part 9: Next Steps (5 minutes)

### Deepen Your Understanding

1. **Read Documentation**:
   - DFA_DOCUMENTATION.md for theory
   - ARCHITECTURE.md for code structure
   - LANGUAGE_REFERENCE.md for features

2. **Study the Code**:
   - core/lexer/dfa.ts - See how it works
   - __tests__/lexer.test.ts - Learn from examples

3. **Experiment**:
   - Write complex code
   - Test edge cases
   - Try to break it (find bugs)

### Extend the Project

Ideas for enhancement:
- Add multi-line comments (/* */)
- Support template literals (`text`)
- Add more operators
- Export tokens to JSON/CSV
- Add code metrics dashboard
- Implement parser (next compiler phase)

---

## Part 10: Troubleshooting (5 minutes)

### Common Issues

**Issue**: Port 3000 already in use
**Solution**: 
```bash
# Use different port
PORT=3001 npm run dev
```

**Issue**: Changes not reflecting
**Solution**:
```bash
# Hard refresh browser: Ctrl + F5
# Or restart dev server
```

**Issue**: Build errors
**Solution**:
```bash
# Clean and rebuild
rm -rf .next
npm run dev
```

**Issue**: Tests failing
**Solution**:
```bash
# Clear cache
npx jest --clearCache
npm test
```

---

## Summary Checklist

✅ **Installation**
- [x] Node.js installed
- [x] Dependencies installed (npm install)
- [x] Dev server running

✅ **Basic Usage**
- [x] Loaded sample code
- [x] Ran analysis
- [x] Viewed tokens
- [x] Checked errors

✅ **Advanced Features**
- [x] Explored DFA diagram
- [x] Used search/filter
- [x] Tested edge cases
- [x] Understood categories

✅ **Testing**
- [x] Ran unit tests
- [x] All tests passing

---

## Quick Reference Commands

```bash
# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Check code quality
npm run lint

# Format code
npm run format

# Health check
node check-project.js
```

---

## Resources

- **Main Docs**: README.md
- **Quick Start**: QUICKSTART.md
- **Language Ref**: LANGUAGE_REFERENCE.md
- **Visual Guide**: VISUAL_GUIDE.md
- **Theory**: docs/DFA_DOCUMENTATION.md

---

**Congratulations! You're now ready to use the Lexical Analyzer like a pro!** 🎉

**Questions? Check DOCUMENTATION_INDEX.md for complete resource list.**
