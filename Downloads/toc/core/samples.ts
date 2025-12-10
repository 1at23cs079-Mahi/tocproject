/**
 * Sample code snippets for testing the lexical analyzer
 */

export const SAMPLE_CODE_1 = `// Simple arithmetic program
function calculateSum(a, b) {
  var result = a + b;
  return result;
}

let x = 10;
let y = 20.5;
let sum = calculateSum(x, y);
`;

export const SAMPLE_CODE_2 = `// Conditional and loops
if (x > 10) {
  for (int i = 0; i < x; i++) {
    result += i * 2;
  }
} else {
  while (y >= 0) {
    y--;
  }
}
`;

export const SAMPLE_CODE_3 = `// String and operators example
const name = "John Doe";
let age = 25;
let isActive = true;

if (age >= 18 && isActive) {
  var message = "Welcome, " + name;
}

// Multiple operators
let calc = (10 + 20) * 3 / 2 - 5;
let comparison = (x == y) || (x != z);
`;

export const SAMPLE_CODE_WITH_ERRORS = `// Code with errors
var num = 123abc;  // Invalid: number followed by letters
let str = "unclosed string
let invalid = @#$;  // Invalid characters
`;

export const DEFAULT_SAMPLE = SAMPLE_CODE_1;

export const SAMPLES = [
  { name: 'Arithmetic', code: SAMPLE_CODE_1 },
  { name: 'Control Flow', code: SAMPLE_CODE_2 },
  { name: 'Operators & Strings', code: SAMPLE_CODE_3 },
  { name: 'With Errors', code: SAMPLE_CODE_WITH_ERRORS },
];
