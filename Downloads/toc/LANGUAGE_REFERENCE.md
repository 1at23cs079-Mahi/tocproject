# Language Features Cheatsheet

Quick reference for all supported tokens and language features in the Lexical Analyzer.

---

## 📌 Keywords (26)

### Control Flow
```
if, else, switch, case, default
while, for, do
break, continue, return
```

### Data Types
```
int, float, string, boolean
true, false, null, undefined
```

### Functions & Classes
```
function, class, this, new
```

### Variables
```
var, let, const
```

### Error Handling
```
try, catch, finally, throw
```

### Modules
```
import, export, from, as
```

### Other
```
void
```

---

## 🔤 Identifiers

**Rules**:
- Must start with: letter (a-z, A-Z) or underscore (_)
- Can contain: letters, digits (0-9), underscores
- Case-sensitive
- Cannot be a keyword

**Examples**:
```javascript
myVariable
_private
counter123
camelCase
snake_case
CONSTANT_VALUE
```

---

## 🔢 Numbers

### Integers
```javascript
0
42
999
1234567890
```

### Floating-Point
```javascript
3.14
0.5
123.456
99.99
```

**Note**: A dot without following digit is treated as punctuation, not part of a number.

---

## 📝 String Literals

### Double Quotes
```javascript
"hello world"
"This is a string"
```

### Single Quotes
```javascript
'hello world'
'This is a string'
```

### Escape Sequences
```javascript
"Line 1\nLine 2"      // Newline
"Tab\tSeparated"      // Tab
"She said \"Hello\""  // Escaped quote
"Path: C:\\Users"     // Escaped backslash
```

**Error**: Unterminated strings are detected as errors
```javascript
"This is incomplete
```

---

## ⚙️ Operators (30+)

### Arithmetic
```javascript
+   // Addition
-   // Subtraction
*   // Multiplication
/   // Division
%   // Modulus
```

### Comparison
```javascript
==  // Equal
!=  // Not equal
<   // Less than
>   // Greater than
<=  // Less than or equal
>=  // Greater than or equal
=== // Strict equal
!== // Strict not equal
```

### Logical
```javascript
&&  // Logical AND
||  // Logical OR
!   // Logical NOT
```

### Bitwise
```javascript
&   // Bitwise AND
|   // Bitwise OR
^   // Bitwise XOR
~   // Bitwise NOT
<<  // Left shift
>>  // Right shift
```

### Assignment
```javascript
=   // Assignment
+=  // Add and assign
-=  // Subtract and assign
*=  // Multiply and assign
/=  // Divide and assign
%=  // Modulo and assign
```

### Increment/Decrement
```javascript
++  // Increment
--  // Decrement
```

---

## 🔧 Punctuation

### Parentheses & Brackets
```javascript
( )   // Parentheses
{ }   // Curly braces
[ ]   // Square brackets
```

### Delimiters
```javascript
;     // Semicolon
,     // Comma
.     // Dot/period
:     // Colon
?     // Question mark
```

---

## 💬 Comments

### Single-Line Comments
```javascript
// This is a comment

var x = 5; // Inline comment

// Multiple comments
// on separate lines
```

**Note**: Multi-line comments (/* */) are not currently supported.

---

## ⚪ Whitespace

All whitespace is tokenized and tracked:
- Space (` `)
- Tab (`\t`)
- Newline (`\n`)
- Carriage return (`\r`)

---

## ❌ Invalid Characters

The following will produce lexical errors:
```javascript
@   // Invalid
#   // Invalid (unless in future preprocessor support)
$   // Invalid (unless in future variable support)
`   // Invalid (template literals not supported)
```

---

## 📋 Complete Examples

### Valid Code
```javascript
// Calculate factorial
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

let result = factorial(5);
```

### Code with Various Token Types
```javascript
const PI = 3.14159;
var radius = 10;
let area = PI * radius * radius;

if (area > 100 && area < 500) {
  string message = "Medium circle";
} else {
  message = "Other size";
}
```

### Code with Errors
```javascript
var num = 123abc;     // Error: 'abc' after number
let str = "unclosed   // Error: unterminated string
var bad = @#$;        // Error: invalid characters
```

---

## 🎯 Token Categories

All tokens are categorized as:

| Category | Token Types | Example |
|----------|-------------|---------|
| **Keyword** | Reserved words | `if`, `while`, `return` |
| **Identifier** | Variable names | `myVar`, `counter` |
| **Literal** | Numbers, strings | `42`, `"hello"`, `3.14` |
| **Operator** | Operators | `+`, `==`, `&&` |
| **Punctuation** | Brackets, delimiters | `(`, `;`, `{` |
| **Comment** | Comments | `// comment` |
| **Whitespace** | Spaces, tabs, newlines | ` `, `\t`, `\n` |
| **Error** | Invalid tokens | `@`, unterminated strings |

---

## 🚀 Usage Tips

1. **Keywords are case-sensitive**: `if` is a keyword, `If` is an identifier
2. **Operators are greedy**: `===` is one token, not three
3. **Whitespace is preserved**: All spacing is tracked
4. **Comments end at newline**: No continuation
5. **Strings need closing quotes**: Or they're errors
6. **Numbers with letters**: `123abc` is an error, not a number

---

## 🧪 Testing Your Code

Try these test cases:

```javascript
// Test 1: Keywords and identifiers
if (myVar == true) return;

// Test 2: Numbers
int x = 123;
float y = 45.67;

// Test 3: Strings with escapes
string msg = "Hello \"World\"";

// Test 4: Complex operators
bool check = (x >= 10 && y <= 100);

// Test 5: All punctuation
array[0] = {key: value, other: 123};

// Test 6: Comments
// This is ignored
var z = 5; // Also ignored

// Test 7: Errors
var error = @#$;  // Should show errors
```

---

## 📖 Reference

For more details:
- **Full documentation**: See `README.md`
- **DFA theory**: See `docs/DFA_DOCUMENTATION.md`
- **Architecture**: See `docs/ARCHITECTURE.md`
- **Test examples**: See `__tests__/lexer.test.ts`

---

**Last Updated**: December 2025
