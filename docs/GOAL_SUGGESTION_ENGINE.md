# Goal Suggestion Engine Guide

## Overview
The Goal Suggestion Engine helps Claude propose optional, tone-aligned goals based on journal entries and reflections. It maintains therapeutic boundaries while encouraging meaningful action.

## Core Components

### 1. Goal Structure
```typescript
interface SuggestedGoal {
  id: string;
  content: string;
  focusArea: string;
  metadata: {
    tone: TonePreference;
    mood: Mood | null;
    duration: 'short' | 'medium' | 'long';
    confidence: number;  // 0-1 scale
    tags: string[];
  };
}
```

### 2. Suggestion Flow
1. Analyze reflection and focus areas
2. Generate tone-aligned goals
3. Add metadata and confidence scores
4. Present as optional suggestions

## Implementation Details

### 1. Goal Generation
- Extract key themes from reflection
- Match tone to goal framing
- Consider emotional context
- Estimate appropriate duration

### 2. Tone Alignment
```typescript
const TONE_GOAL_FRAMING = {
  supportive: {
    prefix: "You might consider",
    action: "exploring",
    duration: "at your own pace"
  },
  direct: {
    prefix: "A potential goal could be",
    action: "implementing",
    duration: "this week"
  },
  curious: {
    prefix: "What if you tried",
    action: "experimenting with",
    duration: "over the next few days"
  }
};
```

### 3. Token Management
- Base prompt: ~100 tokens
- Goal description: ~50 tokens each
- Metadata: ~30 tokens
- Total target: ~200 tokens

## Example Sequences

### 1. Supportive Tone Goal
**Input:**
```json
{
  "reflection": "You're noticing patterns in your work communication. The moments when you speak up feel empowering, but you're still hesitant in group settings.",
  "focusArea": "communication",
  "tone": "supportive",
  "mood": "neutral"
}
```

**Output:**
```typescript
{
  id: "goal_123",
  content: "You might consider exploring one small way to share your perspective in a group setting this week. This could be as simple as asking a clarifying question or building on someone else's point.",
  focusArea: "communication",
  metadata: {
    tone: "supportive",
    mood: "neutral",
    duration: "short",
    confidence: 0.8,
    tags: ["communication", "confidence", "group dynamics"]
  }
}
```

### 2. Direct Tone Goal
**Input:**
```json
{
  "reflection": "Your project management skills are improving, but delegation remains a challenge. You've identified that perfectionism might be holding you back.",
  "focusArea": "work",
  "tone": "direct",
  "mood": "neutral"
}
```

**Output:**
```typescript
{
  id: "goal_124",
  content: "A potential goal could be implementing a small delegation experiment: identify one task you typically handle yourself and delegate it with clear instructions. Track what happens and how you feel about the process.",
  focusArea: "work",
  metadata: {
    tone: "direct",
    mood: "neutral",
    duration: "medium",
    confidence: 0.9,
    tags: ["delegation", "perfectionism", "experiment"]
  }
}
```

## Best Practices

### 1. Goal Framing
- Keep goals small and achievable
- Use exploratory language
- Maintain tone consistency
- Include clear success criteria

### 2. Emotional Safety
- Never make goals mandatory
- Allow easy modification
- Respect emotional boundaries
- Provide opt-out options

### 3. Context Integration
- Consider recent history
- Match tone to mood
- Align with focus areas
- Track goal relationships

## Testing Protocol

### 1. Input Types
- Clear focus areas
- Mixed emotional content
- Multiple focus areas
- Uncertain contexts

### 2. Tone Combinations
- Supportive + various moods
- Direct + various moods
- Curious + various moods

### 3. Performance Metrics
- Goal acceptance rate
- Tone alignment accuracy
- Emotional safety score
- User modification rate

## Maintenance

### 1. Regular Updates
- Review goal templates
- Update tone framing
- Refine duration estimates
- Monitor user feedback

### 2. Performance Monitoring
- Track goal effectiveness
- Monitor tone alignment
- Measure user engagement
- Log system metrics

### 3. Error Prevention
- Validate input data
- Check tone boundaries
- Monitor emotional state
- Log error patterns 