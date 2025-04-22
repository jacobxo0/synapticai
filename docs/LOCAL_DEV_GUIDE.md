# Local Development Guide

## Quick Start

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Start the development server

```bash
git clone https://github.com/your-org/mind-mate.git
cd mind-mate
npm install
cp .env.example .env.local
npm run dev
```

## Environment Setup

### Required Tools
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)
- Git

### Development Environment Variables
```bash
# Copy and customize these in .env.local
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/mind_mate_dev
CLAUDE_API_KEY=mock_key
CLAUDE_FALLBACK_ENABLED=true
REDIS_URL=redis://localhost:6379
```

## Development Workflow

### 1. Branch Management
```bash
# Create feature branch
git checkout -b feature/your-feature

# Update from main
git pull origin main

# Push changes
git push origin feature/your-feature
```

### 2. Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.ts

# Run tests with coverage
npm run test:coverage
```

### 3. Local Development
```bash
# Start development server
npm run dev

# Start with debug mode
npm run dev:debug

# Start with mock Claude
npm run dev:mock
```

## Claude Integration

### Mock Mode
The application includes a mock Claude implementation for local development:

1. Enable mock mode in `.env.local`:
```bash
CLAUDE_API_KEY=mock_key
CLAUDE_FALLBACK_ENABLED=true
```

2. Mock responses are available in:
- `src/lib/claude/CLAUDE_FALLBACK.ts`
- `src/lib/claude/mockResponses.ts`

### Testing Claude Integration
```typescript
// Example test setup
import { claudeFallback } from '../lib/claude/CLAUDE_FALLBACK';

describe('Claude Integration', () => {
  it('should handle mock responses', async () => {
    const response = await claudeFallback.getResponse({
      context: 'greeting',
      userInput: 'Hello'
    });
    expect(response).toBeDefined();
  });
});
```

## Database Management

### Local Database Setup
```bash
# Create development database
createdb mind_mate_dev

# Run migrations
npm run db:migrate

# Seed development data
npm run db:seed
```

### Database Commands
```bash
# Generate migration
npm run db:create-migration migration_name

# Run migrations
npm run db:migrate

# Rollback migration
npm run db:rollback

# Reset database
npm run db:reset
```

## Frontend Development

### Component Development
```bash
# Start Storybook
npm run storybook

# Build components
npm run build:components
```

### Testing Components
```bash
# Run component tests
npm run test:components

# Run with coverage
npm run test:components:coverage
```

## Debugging

### Backend Debugging
```bash
# Start with debugger
npm run dev:debug

# Attach debugger
node --inspect-brk dist/server.js
```

### Frontend Debugging
```bash
# Start with source maps
npm run dev:sourcemaps

# Debug in browser
chrome://inspect
```

## Common Issues

### 1. Database Connection
```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart
```

### 2. Port Conflicts
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

### 3. Cache Issues
```bash
# Clear npm cache
npm cache clean --force

# Clear build cache
npm run clean
```

## Development Tools

### Recommended Extensions
- ESLint
- Prettier
- TypeScript
- PostgreSQL
- GitLens

### Useful Commands
```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run typecheck

# Build
npm run build
```

## Contributing

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Include tests for new features

### Pull Requests
1. Create feature branch
2. Write tests
3. Update documentation
4. Submit PR with description

### Review Process
1. Code review
2. Test verification
3. Documentation check
4. Merge approval 