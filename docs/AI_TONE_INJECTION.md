# AI Tone Injection System

## Overview
The AI tone injection system allows users to customize Claude's communication style in Mind Mate. This document outlines how tones are implemented, injected, and interpreted.

## Tone Types

### 1. Supportive (Default)
- **Style**: Warm, empathetic, encouraging
- **Use Case**: Emotional support, personal growth
- **Example Prompt**:
  ```
  I understand you're feeling [emotion]. That's completely valid. 
  Would you like to explore what's behind these feelings?
  ```

### 2. Direct
- **Style**: Clear, concise, action-oriented
- **Use Case**: Problem-solving, goal setting
- **Example Prompt**:
  ```
  Let's break this down into steps. First, [action]. 
  Then, we can [next action]. Does this approach work for you?
  ```

### 3. Curious
- **Style**: Inquisitive, exploratory, thought-provoking
- **Use Case**: Self-discovery, reflection
- **Example Prompt**:
  ```
  What patterns do you notice in how you're approaching this?
  How might a different perspective change things?
  ```

## Implementation

### 1. Tone Storage
- Uses Zustand store with localStorage persistence
- Default tone: 'supportive'
- Persists across sessions

### 2. Context Injection
- Tone preference injected at the start of system prompt
- Format: `AI Tone Preference: [TONE]\n[SYSTEM_PROMPT]`
- Example:
  ```
  AI Tone Preference: Supportive
  Maintain a warm, supportive tone while providing guidance. 
  Show empathy and understanding.
  ```

### 3. Priority Order
1. User's explicit tone preference
2. Context-appropriate tone (e.g., direct for goal setting)
3. Default supportive tone

## Best Practices

### 1. Tone Consistency
- Maintain chosen tone throughout conversation
- Avoid sudden tone shifts
- Respect user's emotional state

### 2. Context Awareness
- Consider conversation topic
- Factor in user's mood
- Adapt to conversation flow

### 3. Fallback Handling
- Default to supportive tone if preference unclear
- Log tone changes for debugging
- Provide clear user feedback on tone changes

## Example Prompts

### Supportive Tone
```
System: You are a supportive mental health companion. 
Maintain a warm, empathetic tone while providing guidance.

User: I'm feeling overwhelmed with work.

AI: I hear how challenging this is for you. Would you like to 
talk about what specifically is feeling overwhelming?
```

### Direct Tone
```
System: You are a direct and practical guide. 
Focus on clear, actionable advice.

User: I need to improve my time management.

AI: Let's create a concrete plan. First, list your top 3 priorities. 
Then, we'll block time for each. Ready to start?
```

### Curious Tone
```
System: You are an inquisitive guide. 
Ask thoughtful questions to encourage self-discovery.

User: I'm not sure what career path to choose.

AI: What aspects of your current work bring you the most energy? 
How might those qualities guide your next steps?
```

## Technical Details

### 1. Storage
```typescript
interface ToneState {
  tone: TonePreference;
  setTone: (tone: TonePreference) => void;
  resetTone: () => void;
}
```

### 2. Configuration
```typescript
const TONE_CONFIG = {
  supportive: {
    label: 'Supportive',
    systemPrompt: 'Maintain a warm, supportive tone...'
  },
  // ...other tones
};
```

### 3. Context Building
```typescript
buildToneContext(tonePreference: TonePreference): string {
  const config = TONE_CONFIG[tonePreference];
  return `AI Tone Preference: ${config.label}\n${config.systemPrompt}`;
}
```

## Testing

### 1. Tone Persistence
- Verify tone persists across page reloads
- Check localStorage storage
- Test tone changes during conversation

### 2. Context Integration
- Ensure tone doesn't conflict with mood
- Verify tone appears in system prompt
- Test with different conversation types

### 3. Edge Cases
- Test with no tone preference
- Verify fallback behavior
- Check tone changes during active conversation 