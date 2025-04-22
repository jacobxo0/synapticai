# Adaptive Tone System Developer Guide

## System Architecture

### Core Components
1. **Context Builder** (`src/lib/context/contextBuilder.ts`)
   - Aggregates user context
   - Processes mood data
   - Analyzes journal entries
   - Generates context summary

2. **Tone Selector** (`src/lib/tone/adaptiveToneCopy.ts`)
   - Implements tone selection logic
   - Manages tone transitions
   - Handles manual overrides
   - Processes feedback

3. **State Management** (`src/lib/store/toneStore.ts`)
   - Zustand store implementation
   - Tone state persistence
   - User preferences
   - Analytics tracking

## Implementation Details

### Context Building
```typescript
interface ContextData {
  mood: MoodData;
  journal: JournalEntry[];
  conversation: ConversationContext;
  preferences: UserPreferences;
}

class ContextBuilder {
  async buildContext(userId: string): Promise<ContextData> {
    // Implementation details
  }
}
```

### Tone Selection Logic
```typescript
interface ToneSelection {
  tone: Tone;
  confidence: number;
  context: string[];
}

class ToneSelector {
  async selectTone(context: ContextData): Promise<ToneSelection> {
    // Implementation details
  }
}
```

### State Management
```typescript
interface ToneState {
  currentTone: Tone;
  isAutomatic: boolean;
  lastOverride: Date;
  preferences: TonePreferences;
}

const useToneStore = create<ToneState>((set) => ({
  // Implementation details
}));
```

## Key Files and Functions

### `contextBuilder.ts`
- `buildContext()`: Main context aggregation
- `analyzeMood()`: Mood pattern analysis
- `processJournal()`: Journal entry processing
- `generateSummary()`: Context summary generation

### `adaptiveToneCopy.ts`
- `selectTone()`: Primary tone selection
- `handleOverride()`: Manual override handling
- `processFeedback()`: User feedback processing
- `adjustConfidence()`: Confidence level adjustment

### Tone Store
- `setTone()`: Tone state updates
- `toggleAutomatic()`: Automatic mode control
- `updatePreferences()`: Preference management
- `trackAnalytics()`: Usage analytics

## Prompt Injection Flow

1. **Context Collection**
   ```typescript
   const context = await contextBuilder.buildContext(userId);
   ```

2. **Tone Selection**
   ```typescript
   const toneSelection = await toneSelector.selectTone(context);
   ```

3. **Prompt Construction**
   ```typescript
   const prompt = buildPrompt(message, toneSelection, context);
   ```

4. **Response Generation**
   ```typescript
   const response = await generateResponse(prompt);
   ```

## Logging and Analytics

### Event Tracking
```typescript
interface ToneEvent {
  timestamp: Date;
  userId: string;
  eventType: 'selection' | 'override' | 'feedback';
  data: ToneEventData;
}

async function trackToneEvent(event: ToneEvent): Promise<void> {
  // Implementation details
}
```

### Analytics Metrics
- Tone selection frequency
- Override patterns
- User feedback
- Context accuracy
- Response effectiveness

## Testing Guidelines

### Unit Tests
```typescript
describe('ToneSelector', () => {
  it('should select appropriate tone for mood', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('AdaptiveToneSystem', () => {
  it('should handle full conversation flow', async () => {
    // Test implementation
  });
});
```

## Performance Considerations

1. **Context Caching**
   - Cache context for 5 minutes
   - Invalidate on significant changes
   - Implement LRU cache strategy

2. **Batch Processing**
   - Process journal entries in batches
   - Use background processing for analysis
   - Implement rate limiting

3. **State Optimization**
   - Minimize store updates
   - Use selective updates
   - Implement debouncing

## Security Measures

1. **Data Protection**
   - Encrypt sensitive context
   - Implement access controls
   - Secure state persistence

2. **Privacy Compliance**
   - GDPR compliance
   - Data minimization
   - User consent tracking

## Deployment Notes

1. **Configuration**
   ```typescript
   const config = {
     contextTTL: 300000, // 5 minutes
     maxJournalEntries: 10,
     minConfidence: 0.7,
     analyticsSampleRate: 0.1
   };
   ```

2. **Environment Variables**
   ```env
   TONE_SELECTION_ENABLED=true
   CONTEXT_CACHE_SIZE=1000
   ANALYTICS_ENABLED=true
   ```

## Troubleshooting

### Common Issues
1. **Context Staleness**
   - Check cache invalidation
   - Verify update triggers
   - Monitor context age

2. **Tone Selection Errors**
   - Review selection logic
   - Check confidence thresholds
   - Verify context quality

3. **Performance Issues**
   - Monitor cache hit rates
   - Check batch processing
   - Review state updates

## Contributing

1. **Code Style**
   - Follow TypeScript best practices
   - Use consistent naming
   - Document complex logic

2. **Pull Requests**
   - Include tests
   - Update documentation
   - Provide performance metrics

## Resources

- [API Documentation](API_DOCS.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Performance Metrics](METRICS.md) 