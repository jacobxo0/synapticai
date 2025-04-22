# MindMate V2

A sophisticated mental health tracking and AI-powered insights platform.

## Project Structure

```
mindmate-v2/
├── src/
│   ├── frontend/         # React frontend application
│   ├── backend/          # Node.js backend services
│   ├── ai/              # AI integration and prompt management
│   └── shared/          # Shared types and utilities
├── tests/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   ├── e2e/            # End-to-end tests
│   └── snapshots/      # Component snapshots
├── docs/               # Project documentation
└── scripts/           # Build and deployment scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- TypeScript 5+
- Docker (for local development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/mindmate-v2.git
cd mindmate-v2
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers:
```bash
yarn dev
```

## Development Workflow

1. Create a new feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the project rules

3. Run tests and checks:
```bash
yarn test
yarn lint
yarn type-check
```

4. Create a pull request following the commit checklist

## Documentation

- [Project Rules](PROJECT_RULES.md)
- [Testing Guidelines](TESTING_GUIDELINES.md)
- [Commit Checklist](COMMIT_CHECKLIST.md)
- [Roadmap](ROADMAP.md)

## Contributing

1. Follow the project rules and guidelines
2. Write tests for new features
3. Update documentation as needed
4. Submit PRs with clear descriptions

## License

MIT License - see LICENSE file for details 