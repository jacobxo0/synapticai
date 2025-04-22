# Consent-Aware Memory Engine

## Overview
The Consent-Aware Memory Engine ensures Claude only uses data that users have explicitly consented to, with granular control over different types of memory and context.

## Core Components

### 1. Consent Types
```typescript
interface ConsentSettings {
  moodTracking: {
    enabled: boolean;
    temporaryOptOut?: boolean;
    lastUpdated: Date;
  };
  toneContinuity: {
    enabled: boolean;
    temporaryOptOut?: boolean;
    lastUpdated: Date;
  };
  goalLinking: {
    enabled: boolean;
    temporaryOptOut?: boolean;
    lastUpdated: Date;
  };
  reflectionHistory: {
    enabled: boolean;
    temporaryOptOut?: boolean;
    lastUpdated: Date;
  };
}

interface SessionConsent {
  sessionId: string;
  timestamp: Date;
  overrides: Partial<ConsentSettings>;
}
```

### 2. Memory Filtering
```typescript
interface FilteredContext {
  mood: MoodData | null;
  tone: ToneData | null;
  goals: GoalData[] | null;
  reflections: ReflectionData[] | null;
  metadata: {
    consentStatus: {
      [K in keyof ConsentSettings]: boolean;
    };
    fallbackUsed: boolean;
  };
}
```

### 3. Claude Prompt Variations
```typescript
const PROMPT_VARIATIONS = {
  fullContext: "Using your full context and history...",
  limitedContext: "With limited context available...",
  neutralContext: "In a neutral context..."
} as const;
```

## Implementation Details

### 1. Consent Management
```typescript
class ConsentManager {
  private userSettings: ConsentSettings;
  private sessionOverrides: Map<string, SessionConsent>;

  constructor(initialSettings: ConsentSettings) {
    this.userSettings = initialSettings;
    this.sessionOverrides = new Map();
  }

  updateConsent(type: keyof ConsentSettings, enabled: boolean): void {
    this.userSettings[type].enabled = enabled;
    this.userSettings[type].lastUpdated = new Date();
  }

  setTemporaryOptOut(sessionId: string, type: keyof ConsentSettings): void {
    const session = this.sessionOverrides.get(sessionId) || {
      sessionId,
      timestamp: new Date(),
      overrides: {}
    };
    session.overrides[type] = { enabled: false, temporaryOptOut: true };
    this.sessionOverrides.set(sessionId, session);
  }
}
```

### 2. Context Filtering
```typescript
function filterContextByConsent(
  userSettings: ConsentSettings,
  sessionData: SessionConsent,
  rawContext: any
): FilteredContext {
  const filtered: FilteredContext = {
    mood: null,
    tone: null,
    goals: null,
    reflections: null,
    metadata: {
      consentStatus: {},
      fallbackUsed: false
    }
  };

  // Apply consent rules
  Object.entries(userSettings).forEach(([type, settings]) => {
    const isEnabled = settings.enabled && !sessionData.overrides[type]?.temporaryOptOut;
    filtered.metadata.consentStatus[type] = isEnabled;
    
    if (isEnabled) {
      filtered[type] = rawContext[type];
    }
  });

  // Use fallback if no context available
  if (Object.values(filtered.metadata.consentStatus).every(v => !v)) {
    filtered.metadata.fallbackUsed = true;
  }

  return filtered;
}
```

### 3. Claude Integration
```typescript
function buildClaudePrompt(filteredContext: FilteredContext): string {
  if (filteredContext.metadata.fallbackUsed) {
    return PROMPT_VARIATIONS.neutralContext;
  }

  const enabledTypes = Object.entries(filteredContext.metadata.consentStatus)
    .filter(([_, enabled]) => enabled)
    .map(([type]) => type);

  if (enabledTypes.length === Object.keys(filteredContext.metadata.consentStatus).length) {
    return PROMPT_VARIATIONS.fullContext;
  }

  return PROMPT_VARIATIONS.limitedContext.replace(
    '{enabledTypes}',
    enabledTypes.join(', ')
  );
}
```

## Safety Measures

### 1. Consent Verification
- Double-check consent status before each memory access
- Log all consent changes
- Maintain audit trail
- Validate session overrides

### 2. Fallback Behavior
- Use neutral context when no consent
- Acknowledge memory limitations
- Avoid assumptions
- Maintain conversation flow

### 3. Error Prevention
- Validate consent settings
- Check session validity
- Handle edge cases
- Log violations

## Example Usage

### 1. Setting Up Consent
```typescript
const consentManager = new ConsentManager({
  moodTracking: { enabled: true, lastUpdated: new Date() },
  toneContinuity: { enabled: false, lastUpdated: new Date() },
  goalLinking: { enabled: true, lastUpdated: new Date() },
  reflectionHistory: { enabled: true, lastUpdated: new Date() }
});

// Temporary opt-out for current session
consentManager.setTemporaryOptOut('session123', 'moodTracking');
```

### 2. Filtering Context
```typescript
const filteredContext = filterContextByConsent(
  consentManager.getSettings(),
  consentManager.getSessionOverride('session123'),
  rawContext
);

const prompt = buildClaudePrompt(filteredContext);
```

### 3. Claude Response
```typescript
// With full consent
"Based on your mood patterns and reflection history..."

// With limited consent
"While respecting your privacy settings regarding mood tracking..."

// With no consent
"Let's explore this topic together..."
```

## Best Practices

### 1. Privacy
- Never override opt-outs
- Clear consent boundaries
- Transparent data usage
- Regular consent reviews

### 2. User Experience
- Clear memory status
- Easy consent management
- Contextual explanations
- Smooth transitions

### 3. Technical
- Efficient filtering
- Minimal data storage
- Secure consent tracking
- Performance optimization

## Testing Protocol

### 1. Consent Scenarios
- Full consent
- Partial consent
- No consent
- Temporary opt-outs

### 2. Edge Cases
- Consent changes mid-session
- Invalid session IDs
- Missing settings
- Data conflicts

### 3. Performance
- Filtering speed
- Memory usage
- Session handling
- Error recovery

## Maintenance

### 1. Regular Updates
- Review consent patterns
- Update safety measures
- Optimize performance
- Add new features

### 2. Monitoring
- Track consent changes
- Monitor violations
- Log errors
- Measure performance

### 3. Documentation
- Update examples
- Document changes
- Maintain guides
- Track issues 