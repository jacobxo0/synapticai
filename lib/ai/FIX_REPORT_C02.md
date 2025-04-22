# Fix Report: C02 - Tone Fallback Issue

## Issue Description
Claude occasionally defaults to an incorrect or robotic tone when responding to users in emotional states that should trigger empathetic or encouraging responses. This creates a jarring user experience and breaks the therapeutic atmosphere.

## Root Cause Analysis

### 1. Prompt Profile Selection
- **Issue**: System sometimes selects default/fallback profile instead of emotion-appropriate one
- **Cause**: Mood classification not properly influencing prompt selection
- **Impact**: Loss of therapeutic tone and context

### 2. Memory Integration
- **Issue**: Previous conversation context not consistently maintained
- **Cause**: Memory injection timing misalignment
- **Impact**: Tone shifts between messages

### 3. Mood Classification
- **Issue**: User mood flags not properly triggering appropriate tone
- **Cause**: Insufficient mood state granularity
- **Impact**: Mismatched emotional responses

## Solution Implementation

### 1. Enhanced Mood Classification
```typescript
export const MoodStateSchema = z.enum([
  'distressed',
  'anxious',
  'overwhelmed',
  'reflective',
  'motivated',
  'uncertain',
  'hopeful',
  'neutral'
]);

export const MoodIntensitySchema = z.enum([
  'low',
  'medium',
  'high',
  'critical'
]);
```

### 2. Tone Fallback Logic
```typescript
function determineAppropriateTone(
  currentMood: MoodState,
  intensity: MoodIntensity,
  previousTone?: EmotionalTone
): EmotionalTone {
  // Never fall back to neutral if previous tone was therapeutic
  if (previousTone && previousTone !== 'neutral') {
    return previousTone;
  }

  // Mood-based tone selection
  switch (currentMood) {
    case 'distressed':
    case 'anxious':
    case 'overwhelmed':
      return 'comforting';
    case 'reflective':
    case 'uncertain':
      return 'reflective';
    case 'motivated':
    case 'hopeful':
      return 'energizing';
    default:
      return previousTone || 'reflective'; // Default to reflective over neutral
  }
}
```

### 3. Context Preservation
```typescript
function buildContextAwarePrompt(
  config: PromptConfig,
  moodState: MoodState,
  previousContext?: string
): Message[] {
  const messages: Message[] = [];
  
  // System message with enhanced context
  const systemMessage = {
    role: 'system' as const,
    content: `You are a therapeutic AI assistant operating in ${config.tone} tone.
    Current user mood: ${moodState}
    Previous context: ${previousContext || 'None'}
    Maintain consistent therapeutic presence and tone.
    Never break character or revert to neutral/robotic responses.`
  };
  
  return messages;
}
```

## Testing Protocol

### 1. Mood Transition Tests
- Test transitions between different emotional states
- Verify tone consistency during transitions
- Check memory retention across mood changes

### 2. Edge Cases
- Test rapid mood changes
- Verify handling of mixed emotions
- Check response to unclear emotional signals

### 3. Validation Criteria
- Tone must remain therapeutic
- No robotic or neutral fallbacks
- Consistent with previous context
- Appropriate to current mood state

## Implementation Notes

### 1. Critical Rules
- Never override therapeutic tone with neutral
- Maintain previous tone unless clear reason to change
- Always consider mood state in tone selection
- Preserve context across messages

### 2. Performance Considerations
- Cache mood classification results
- Optimize context injection
- Monitor response latency

### 3. Monitoring
- Log tone selection decisions
- Track mood classification accuracy
- Monitor context preservation

## Validation Steps

1. **Code Review**
   - [ ] Milo reviews memory integration
   - [ ] Tilda validates tone selection logic
   - [ ] Nora approves therapeutic consistency

2. **Testing**
   - [ ] Run mood transition tests
   - [ ] Verify edge case handling
   - [ ] Check performance metrics

3. **Documentation**
   - [ ] Update prompt templates
   - [ ] Document tone selection rules
   - [ ] Add monitoring guidelines 