# Adaptive Tone Injection System

## Overview
The Adaptive Tone Injection System dynamically adjusts Claude's communication style based on user-selected tone preferences and current emotional state. This system ensures emotionally appropriate responses while maintaining conversational continuity.

## Core Components

### 1. Tone-Mood Matrix
The system uses a predefined matrix of tone-mood combinations to select appropriate microcopy:
- **Supportive**: Empathetic, encouraging, validating
- **Direct**: Action-oriented, structured, clear
- **Curious**: Exploratory, pattern-seeking, insight-driven

### 2. Microcopy Structure
Each tone-mood combination includes:
- **Opening**: Initial response framing
- **Continuation**: Follow-up prompts
- **Fallback**: Default response when mood is unknown

### 3. Context Integration
The system considers:
- User's selected tone preference
- Current emotional state
- Conversation history
- Memory relevance

## Implementation Details

### 1. Tone Selection
```typescript
interface MicrocopyFragment {
  opening: string;
  continuation: string;
  fallback: string;
}
```

### 2. Mood Detection
```typescript
type Mood = 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry';
```

### 3. Weight Distribution
- Base tone weight: 60%
- Mood compatibility: 30%
- Context relevance: 10%

## Usage Guidelines

### 1. Initial Response
```typescript
const microcopy = selectMicrocopy(tonePreference, currentMood);
const opening = microcopy.opening;
```

### 2. Continuation Handling
```typescript
const continuation = getContinuationCue(tonePreference, currentMood);
```

### 3. Fallback Strategy
```typescript
const fallback = getFallbackCue(tonePreference);
```

## Best Practices

### 1. Tone Continuity
- Maintain consistent tone within conversation
- Use appropriate transition phrases
- Avoid abrupt tone shifts

### 2. Mood Sensitivity
- Adjust tone weight based on emotional state
- Add mood-specific adjustments when needed
- Respect emotional boundaries

### 3. Context Awareness
- Consider conversation history
- Weight recent interactions higher
- Maintain topic relevance

## Token Management

### 1. Budget Allocation
- Base tone instruction: ~50 tokens
- Mood adjustment: ~30 tokens
- Context integration: ~40 tokens
- Total tone context: ~120 tokens

### 2. Optimization
- Cache common combinations
- Pre-compute tone adjustments
- Monitor token usage

## Testing Protocol

### 1. Tone-Mood Combinations
- Test all possible combinations
- Verify emotional appropriateness
- Check response quality

### 2. Edge Cases
- Rapid mood changes
- Tone switches
- Missing mood data

### 3. Performance Metrics
- Response time
- Token usage
- User satisfaction

## Maintenance

### 1. Microcopy Updates
- Review tone-mood combinations
- Update based on user feedback
- Maintain consistency

### 2. Performance Monitoring
- Track response quality
- Monitor token usage
- Measure user satisfaction

### 3. Error Handling
- Log tone adjustments
- Track fallback usage
- Monitor system performance 