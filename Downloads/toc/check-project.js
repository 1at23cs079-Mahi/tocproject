#!/usr/bin/env node

/**
 * Project Health Check Script
 * Validates that all components of the Lexical Analyzer are properly set up
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Lexical Analyzer - Project Health Check\n');
console.log('=' .repeat(60));

let allChecksPass = true;

// Required files
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  'jest.config.js',
  '.eslintrc.json',
  '.prettierrc',
  '.gitignore',
  'README.md',
  'QUICKSTART.md',
  'app/page.tsx',
  'app/layout.tsx',
  'app/globals.css',
  'components/CodeEditor.tsx',
  'components/TokenTable.tsx',
  'components/ErrorPanel.tsx',
  'components/DfaVisualizer.tsx',
  'components/SyntaxHighlighter.tsx',
  'core/types.ts',
  'core/samples.ts',
  'core/utils.ts',
  'core/lexer/dfa.ts',
  'core/lexer/visualization.ts',
  '__tests__/lexer.test.ts',
  'docs/DFA_DOCUMENTATION.md',
  'docs/ARCHITECTURE.md',
];

console.log('\n📁 Checking required files...\n');

requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  
  if (exists) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allChecksPass = false;
  }
});

// Check node_modules
console.log('\n📦 Checking dependencies...\n');

const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
if (nodeModulesExists) {
  console.log('  ✅ node_modules installed');
} else {
  console.log('  ❌ node_modules missing - run "npm install"');
  allChecksPass = false;
}

// Check package.json scripts
console.log('\n🔧 Checking npm scripts...\n');

try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
  );
  
  const requiredScripts = ['dev', 'build', 'start', 'lint', 'test'];
  
  requiredScripts.forEach((script) => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`  ✅ npm run ${script}`);
    } else {
      console.log(`  ❌ npm run ${script} - NOT FOUND`);
      allChecksPass = false;
    }
  });
} catch (error) {
  console.log('  ❌ Error reading package.json');
  allChecksPass = false;
}

// Final summary
console.log('\n' + '=' .repeat(60));

if (allChecksPass) {
  console.log('\n✅ All checks passed! The project is ready to run.\n');
  console.log('Next steps:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Open: http://localhost:3000');
  console.log('  3. Try sample code and analyze tokens!\n');
  process.exit(0);
} else {
  console.log('\n❌ Some checks failed. Please review the issues above.\n');
  process.exit(1);
}
