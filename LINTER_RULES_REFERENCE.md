# MindMate V2 Linter Rules Reference

## Overview

This document outlines our ESLint and accessibility linting configuration, explaining the rationale behind our choices and how to work with the linter effectively.

## Installed Plugins

### Core Plugins
- `eslint`: Base ESLint functionality
- `eslint-config-next`: Next.js specific rules
- `eslint-plugin-react`: React-specific rules
- `eslint-plugin-react-hooks`: React Hooks rules
- `eslint-plugin-jsx-a11y`: Accessibility rules for JSX

### Plugin Purposes
- **Next.js Config**: Ensures compatibility with Next.js features
- **React Plugin**: Enforces React best practices
- **React Hooks**: Prevents common Hook mistakes
- **JSX A11Y**: Enforces accessibility standards

## Active Rules

### Accessibility Rules
- `jsx-a11y/aria-proptypes`: Validates ARIA attribute values
  - `allowString: true`: Allows string values for boolean attributes
  - `validValues`: Defines allowed values for each ARIA attribute
- `jsx-a11y/aria-role`: Ensures valid ARIA roles
- `jsx-a11y/aria-props`: Validates ARIA property names
- `jsx-a11y/role-has-required-aria-props`: Ensures required ARIA props
- `jsx-a11y/role-supports-aria-props`: Validates role-attribute combinations

### ARIA Attribute Values
```json
{
  "aria-invalid": ["false", "true", "grammar", "spelling"],
  "aria-required": ["false", "true"],
  "aria-expanded": ["false", "true"],
  "aria-selected": ["false", "true"],
  "aria-hidden": ["false", "true"],
  "aria-disabled": ["false", "true"],
  "aria-checked": ["false", "true", "mixed"],
  "aria-pressed": ["false", "true", "mixed"],
  "aria-busy": ["false", "true"],
  "aria-live": ["off", "polite", "assertive"]
}
```

## How to Use the Linter

### Running Lint Checks
```bash
# Run all lint checks
yarn lint

# Run lint checks with auto-fix
yarn lint --fix

# Run lint checks on specific files
yarn lint path/to/file.tsx
```

### Suppressing False Positives
```tsx
// Method 1: Disable for specific line
// eslint-disable-next-line jsx-a11y/aria-proptypes
<div aria-invalid="true" />

// Method 2: Disable for block
/* eslint-disable jsx-a11y/aria-proptypes */
<div aria-invalid="true" />
/* eslint-enable jsx-a11y/aria-proptypes */

// Method 3: Add file-level comment
/* eslint-disable jsx-a11y/aria-proptypes */
```

## How We Test Accessibility

### Automated Testing
1. ESLint checks during development
2. CI pipeline validation
3. Automated accessibility testing with:
   - axe-core
   - jest-axe
   - Playwright accessibility checks

### Manual Testing
1. Keyboard navigation testing
2. Screen reader testing
3. Color contrast verification
4. Focus management testing
5. ARIA live region testing

## Updating Linter Rules

### Adding New Rules
1. Add rule to `.eslintrc.json`
2. Test with `yarn lint`
3. Fix any new violations
4. Document in this file

### Modifying Existing Rules
1. Update rule configuration
2. Run `yarn lint --fix`
3. Review and fix remaining issues
4. Update documentation

## Official Documentation Links
- [ESLint Rules](https://eslint.org/docs/rules/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [JSX A11Y Plugin](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [Next.js ESLint Config](https://nextjs.org/docs/basic-features/eslint)

## Common Issues and Solutions

### ARIA Attribute Values
- **Issue**: Linter expects boolean values
- **Solution**: Use string values as per WAI-ARIA spec
- **Example**: `aria-invalid="true"` instead of `aria-invalid={true}`

### Role Validation
- **Issue**: Invalid role combinations
- **Solution**: Check WAI-ARIA role documentation
- **Example**: `role="button"` requires `aria-pressed` for toggle buttons

### Required Props
- **Issue**: Missing required ARIA props
- **Solution**: Add all required props for the role
- **Example**: `role="checkbox"` requires `aria-checked`

## Best Practices

1. **ARIA Attributes**
   - Use string values for boolean attributes
   - Follow WAI-ARIA specification
   - Test with screen readers

2. **Role Usage**
   - Use semantic HTML when possible
   - Add ARIA only when necessary
   - Test role combinations

3. **Testing**
   - Run lint checks before commits
   - Test with multiple screen readers
   - Verify keyboard navigation

4. **Documentation**
   - Document accessibility features
   - Explain ARIA usage
   - Note testing results 