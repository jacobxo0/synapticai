module.exports = {
  extends: ['next/core-web-vitals'],
  ignorePatterns: ['**/__tests__/**/*', '**/*.test.*'],
  rules: {
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/heading-has-content': 'off',
  },
}; 