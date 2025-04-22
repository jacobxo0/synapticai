# Local Development Guide

## Quick Start

1. Clone and install:
```bash
git clone [repository-url]
cd mindmate
yarn install
cp .env.local.example .env.local
```

2. Start dev server:
```bash
yarn dev
```

## Key Features

- Mock Claude by default
- No API key needed
- Real-time hot reload
- TypeScript support

## Environment

Local development uses:
- Mock responses
- 500ms delay
- Debug mode enabled

To use real Claude:
1. Uncomment `NEXT_PUBLIC_CLAUDE_API_KEY` in `.env.local`
2. Set `NEXT_PUBLIC_USE_MOCK_CLAUDE=false`

## Common Tasks

```bash
# Run tests
yarn test

# Type check
yarn typecheck

# Lint
yarn lint
```

## Troubleshooting

1. **Installation Issues**
```bash
yarn cache clean
yarn install
```

2. **Type Errors**
```bash
yarn typecheck
```

3. **Build Errors**
```bash
yarn clean
yarn install
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## Mock Response Data

The mock Claude responses are stored in `src/lib/mock-claude.ts`. You can modify these responses to test different scenarios. 