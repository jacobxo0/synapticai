# MindMate V2 Project Rules

## Development Standards

### 1. Code Quality
- All code must be written in TypeScript
- Strict type checking must be enabled
- ESLint and Prettier must be used for code formatting
- No `any` types allowed without explicit justification

### 2. Testing Requirements
- Unit tests required for all new features
- Integration tests for API endpoints
- E2E tests for critical user flows
- Minimum 80% test coverage
- Snapshot tests for UI components

### 3. Documentation
- All new features must be documented
- API endpoints must have OpenAPI/Swagger documentation
- Complex business logic must have inline documentation
- README must be kept up to date

### 4. Security
- No hardcoded secrets or API keys
- Input validation required for all user inputs
- Rate limiting on API endpoints
- Regular security audits

### 5. Performance
- Page load time < 3 seconds
- API response time < 500ms
- Optimize bundle size
- Implement proper caching strategies

## Workflow Rules

### 1. Branch Management
- Main branch protected
- Feature branches must be prefixed with `feature/`
- Bug fixes must be prefixed with `fix/`
- Hotfixes must be prefixed with `hotfix/`

### 2. Pull Requests
- Must have at least one reviewer
- Must pass all CI checks
- Must include tests
- Must update documentation if needed

### 3. Commit Messages
- Follow conventional commits
- Must be descriptive
- Must reference issue number if applicable

### 4. Sprint Management
- Sprint duration: 2 weeks
- Daily standups required
- Sprint planning at start
- Sprint review at end

## Agent Responsibilities

### Project Manager
- Maintains roadmap
- Coordinates between agents
- Ensures quality standards
- Tracks progress

### Frontend Agent
- React components
- UI/UX implementation
- Accessibility
- Performance optimization

### Backend Agent
- API development
- Database management
- Business logic
- Security implementation

### Test Agent
- Test implementation
- Coverage monitoring
- Quality assurance
- Performance testing

### AI Agent
- Prompt engineering
- Context management
- AI integration
- Response validation 