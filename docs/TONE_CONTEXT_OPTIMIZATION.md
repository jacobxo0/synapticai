# Tone Context Optimization Guide

## Overview
This document outlines the optimization of tone handling in Claude prompts, focusing on the interaction between user-selected tone, current mood, and conversation context.

## Tone-Mood Compatibility Matrix

### Supportive Tone
| Mood        | Compatibility | Adjustment Needed | Example Prompt |
|-------------|---------------|-------------------|----------------|
| Happy       | High          | None              | "I'm glad you're feeling positive! Let's build on this energy..." |
| Neutral     | High          | None              | "I'm here to support you. What's on your mind today?" |
| Sad         | High          | None              | "I hear your sadness. Would you like to talk about what's weighing on you?" |
| Anxious     | Medium        | Add calming focus | "Let's take this one step at a time. What feels most manageable right now?" |
| Angry       | Low           | Add de-escalation | "I understand you're upset. Let's find a way to process these feelings together." |

### Direct Tone
| Mood        | Compatibility | Adjustment Needed | Example Prompt |
|-------------|---------------|-------------------|----------------|
| Happy       | High          | None              | "Great! Let's outline your next steps clearly..." |
| Neutral     | High          | None              | "Here's what we need to focus on: [specific steps]" |
| Sad         | Low           | Add empathy layer | "I see this is hard. Let's break it down into manageable pieces..." |
| Anxious     | Medium        | Add structure      | "Let's create a clear plan to address this. First, we'll..." |
| Angry       | Low           | Add cooling period | "Let's take a moment, then we can create an action plan." |

### Curious Tone
| Mood        | Compatibility | Adjustment Needed | Example Prompt |
|-------------|---------------|-------------------|----------------|
| Happy       | High          | None              | "What aspects of this success are most meaningful to you?" |
| Neutral     | High          | None              | "What patterns do you notice in how you approach this?" |
| Sad         | Medium        | Add gentle focus  | "What might help you feel more supported right now?" |
| Anxious     | Low           | Add grounding     | "Let's explore what feels most stable in this situation." |
| Angry       | Low           | Add reflection    | "What's at the heart of what's upsetting you?" |

## Implementation Rules

### 1. Priority Order
1. User's explicit tone preference
2. Mood-appropriate tone adjustments
3. Context-specific tone modifications
4. Default supportive tone

### 2. Token Budget Allocation
- Base tone instruction: ~50 tokens
- Mood adjustment: ~30 tokens
- Context integration: ~40 tokens
- Total tone context: ~120 tokens

### 3. Tone-Specific Memory Tags
```typescript
const TONE_MEMORY_TAGS = {
  supportive: ['empathy', 'support', 'encouragement'],
  direct: ['action', 'steps', 'clarity'],
  curious: ['exploration', 'patterns', 'insights']
};
```

## Optimization Strategies

### 1. Dynamic Tone Weighting
```typescript
interface ToneWeight {
  baseWeight: number;    // User preference (0.6)
  moodWeight: number;    // Mood compatibility (0.3)
  contextWeight: number; // Conversation context (0.1)
}
```

### 2. Conflict Resolution
1. **High Conflict** (e.g., Sad mood + Direct tone)
   - Add empathy layer
   - Soften direct language
   - Example: "I understand this is difficult. Let's break this down gently..."

2. **Medium Conflict**
   - Balance tone elements
   - Add transitional phrases
   - Example: "While maintaining our focus, let's also consider..."

3. **Low Conflict**
   - Proceed with primary tone
   - Minor adjustments only
   - Example: "Let's explore this directly, with care..."

### 3. Memory Integration
- Tag memories with tone relevance
- Weight tone-aligned memories higher
- Example memory format:
  ```typescript
  {
    content: string;
    toneRelevance: {
      supportive: number;
      direct: number;
      curious: number;
    }
  }
  ```

## Best Practices

### 1. Prompt Construction
- Lead with tone preference
- Integrate mood adjustments
- Add context-specific modifiers
- Example:
  ```
  AI Tone: Supportive (with direct elements)
  Current Mood: Anxious
  Context: Goal setting
  
  Maintain a supportive tone while providing clear structure.
  Focus on manageable steps and gentle encouragement.
  ```

### 2. Error Prevention
- Validate tone-mood combinations
- Check token usage
- Monitor response quality
- Log tone adjustments

### 3. Performance Optimization
- Cache common tone combinations
- Pre-compute tone adjustments
- Use efficient string concatenation
- Monitor memory usage

## Testing Protocol

### 1. Tone-Mood Combinations
- Test all tone-mood pairs
- Verify adjustment accuracy
- Check response quality
- Measure token usage

### 2. Edge Cases
- Rapid mood changes
- Tone switches mid-conversation
- Empty mood data
- Invalid tone selections

### 3. Performance Metrics
- Response time
- Token usage
- User satisfaction
- Tone consistency 