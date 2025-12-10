# Quick Start Guide

## Installation & Setup

1. **Navigate to project directory**:
   ```bash
   cd "c:\Users\mahes\Downloads\toc"
   ```

2. **Dependencies are already installed**, but if you need to reinstall:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to: http://localhost:3000
   - The application should load immediately

## First Use

1. **Try a sample**: Click any of the sample buttons at the top (e.g., "Arithmetic")
2. **Analyze**: Click the blue "Analyze" button
3. **Explore results**:
   - **Tokens tab**: See all identified tokens with search and filter
   - **Errors tab**: View any lexical errors found
   - **DFA Diagram tab**: Explore the state machine visualization

## Running Tests

```bash
npm test
```

Expected output: All tests should pass ✅

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Clear cache and reinstall
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### TypeScript errors
```bash
# Check TypeScript compilation
npx tsc --noEmit
```

## Project Structure Overview

```
toc/
├── app/              # Next.js pages
├── components/       # React UI components  
├── core/            # DFA & business logic
│   ├── lexer/       # Lexical analyzer
│   └── types.ts     # Type definitions
├── __tests__/       # Unit tests
└── docs/            # Documentation
```

## What to Try

1. **Load different samples** and see how tokens differ
2. **Write your own code** - try variables, functions, loops
3. **Introduce errors** - use invalid characters like @ or #
4. **Compare token counts** between different code styles
5. **Explore the DFA diagram** - see how states connect

## Next Steps

- Read `README.md` for comprehensive documentation
- Check `docs/DFA_DOCUMENTATION.md` for DFA theory
- Review `docs/ARCHITECTURE.md` for code organization
- Explore test cases in `__tests__/lexer.test.ts`

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Node.js version (18+ required)
3. Review error messages in the terminal
4. Consult the full README.md

---

**You're ready to go! Run `npm run dev` and visit http://localhost:3000** 🚀
