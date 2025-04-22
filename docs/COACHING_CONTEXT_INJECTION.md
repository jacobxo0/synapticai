# Coaching Context Injection Guide

## Overview
The Coaching Context Injection system integrates coaching prompts into Claude's context after reflection sequences, helping users transition from reflection to action while maintaining therapeutic boundaries.

## Core Components

### 1. Context Detection
```typescript
interface CoachingConditions {
  isReflectionSequence: boolean;  // Journal entry followed by reflection
  isActiveTone: boolean;          // Direct or curious tone
  isSuitableMood: boolean;        // Not sad or anxious
  hasTokenCapacity: boolean;      // Enough tokens remaining
}
```

### 2. Injection Flow
1. Journal entry detected
2. Reflection generated
3. Coaching conditions evaluated
4. Coaching context injected (if appropriate)

## Implementation Details

### 1. Sequence Detection
- Journal entry length > 100 words
- Reflection contains key phrases
- Appropriate tone and mood
- Sufficient token capacity

### 2. Token Management
- Base context: ~2000 tokens
- Reflection: ~400 tokens
- Coaching: ~450 tokens
- Total target: ~3000 tokens

### 3. Context Integration
```typescript
interface ContextSections {
  baseContext: string;
  reflectionContext: string;
  coachingContext?: string;
  metadata: {
    tokensUsed: number;
    tokensRemaining: number;
  };
}
```

## Example Sequences

### 1. Successful Coaching Injection
**Input Sequence:**
```
1. Journal Entry (200 words):
"I've been working on my project management skills. I've noticed I'm better at organizing tasks but still struggle with delegation. My team seems responsive when I give clear instructions."

2. Reflection:
"You're making progress in project management and noticing specific areas of growth and challenge. The connection between clear communication and team response is particularly interesting."

3. Context:
{
  tone: "direct",
  mood: "neutral",
  focusAreas: ["work", "leadership"]
}
```

**Output:**
```
[Base Context]
... existing context ...

[Reflection Context]
... reflection prompt ...

[Coaching Context]
[Context]
Emotional State: neutral
Focus Areas: work, leadership
Tone: direct

[Reflection Summary]
You're making progress in project management and noticing specific areas of growth and challenge.

[Action Frame]
Let's identify specific steps for building on your delegation skills. What specific aspects of delegation feel challenging? How might you experiment with different approaches to team communication?

[Boundaries]
These are starting points for your exploration. The pace and direction of your growth journey are entirely yours to determine.

[Metadata]
Tone: direct
Mood: neutral
Focus Areas: work, leadership
Token Estimate: 420
```

### 2. Skipped Coaching (Mood Check)
**Input Sequence:**
```
1. Journal Entry (150 words):
"I'm feeling really overwhelmed with my workload. Every time I try to delegate, I worry things won't get done right. I'm losing sleep over this."

2. Reflection:
"You're experiencing significant stress around delegation and perfectionism. This is affecting both your work and personal wellbeing."

3. Context:
{
  tone: "direct",
  mood: "anxious",
  focusAreas: ["work", "wellbeing"]
}
```

**Output:**
```
[Base Context]
... existing context ...

[Reflection Context]
... reflection prompt ...

[No Coaching Context]
Reason: Unsuitable mood (anxious) for coaching
```

## Best Practices

### 1. Sequence Detection
- Verify complete reflection sequence
- Check message timing and content
- Validate emotional readiness
- Monitor token usage

### 2. Context Integration
- Maintain natural flow
- Respect emotional boundaries
- Preserve user agency
- Track token limits

### 3. Error Prevention
- Validate input sequence
- Check emotional state
- Monitor token usage
- Log injection decisions

## Testing Protocol

### 1. Sequence Types
- Complete reflection → coaching
- Incomplete reflection → no coaching
- Unsuitable mood → no coaching
- Token limit → no coaching

### 2. Edge Cases
- Very short entries
- Multiple reflections
- Mixed emotional content
- Token boundary cases

### 3. Performance Metrics
- Sequence detection accuracy
- Token usage efficiency
- Context integration quality
- User response patterns

## Maintenance

### 1. Regular Updates
- Review sequence detection
- Update mood suitability
- Refine token management
- Monitor user feedback

### 2. Performance Monitoring
- Track injection success
- Monitor token efficiency
- Measure user engagement
- Log system metrics

### 3. Error Prevention
- Validate input data
- Check sequence integrity
- Monitor emotional state
- Log error patterns 