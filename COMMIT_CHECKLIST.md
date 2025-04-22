# MindMate V2 Commit Checklist

## Pre-Commit Checks

### 1. Code Quality
- [ ] TypeScript compilation passes (`tsc --noEmit`)
- [ ] ESLint passes (`yarn lint`)
- [ ] Prettier formatting applied (`yarn format`)
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No unused imports
- [ ] No magic numbers/strings
- [ ] Workflow validation (actionlint)
  - [ ] Syntax validation
  - [ ] Secret usage
  - [ ] Schema conformance
  - [ ] Job dependencies
  - [ ] Environment variables

### 2. Testing
- [ ] All tests pass (`