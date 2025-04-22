# Reflection Prompt Templates

## Supportive Tone

### Prompt Stems
```typescript
{
  stem1: "I hear you're feeling {emotion}. Would you like to explore what this experience is like for you?",
  stem2: "I sense {emotion} is present. What thoughts or feelings come up as you sit with this?",
  fallback: "It's okay to take your time with these feelings. Would you like to explore them further?"
}
```

### Example Response
```typescript
{
  input: "I feel disconnected lately.",
  response: "I hear you're feeling disconnected, and I want you to know I'm here with you. What's it like to experience this sense of disconnection? How does it show up in your daily life? There's no rush to find answers - we can explore this at whatever pace feels right for you."
}
```

## Curious Tone

### Prompt Stems
```typescript
{
  stem1: "I'm curious about what {emotion} means to you in this moment. What comes to mind?",
  stem2: "What patterns do you notice in how {emotion} affects your thoughts and experiences?",
  fallback: "I'm interested in understanding more about this experience. Would you like to explore it together?"
}
```

### Example Response
```typescript
{
  input: "I feel disconnected lately.",
  response: "I'm curious about what this sense of disconnection means to you. What does it feel like in your body or mind? How has this experience evolved over time? I'm interested in understanding more about how this shows up in your life."
}
```

## Direct Tone

### Prompt Stems
```typescript
{
  stem1: "Let's explore {emotion} together. What specific aspects stand out to you?",
  stem2: "I notice {emotion} is present. What thoughts or situations contribute to this feeling?",
  fallback: "Let's focus on one aspect of this experience. What feels most important to explore?"
}
```

### Example Response
```typescript
{
  input: "I feel disconnected lately.",
  response: "Let's explore this sense of disconnection together. What specific areas of your life feel most affected? What thoughts or situations seem to contribute to this feeling? We can focus on understanding one aspect at a time."
}
```

## Implementation Guidelines

### 1. Emotional Safety
- Validate without reinforcing distress
- Provide space for processing
- Maintain gentle pacing
- Respect boundaries

### 2. Reflection Focus
- Encourage self-exploration
- Avoid giving advice
- Support personal insights
- Maintain open-ended approach

### 3. Tone Adaptation
- Match user's emotional intensity
- Allow for natural transitions
- Maintain consistent presence
- Adapt to conversation flow

### 4. Response Structure
1. Acknowledge emotion
2. Invite exploration
3. Provide space for response
4. Offer gentle guidance if needed

## Usage Notes

1. **Context Awareness**
   - Consider previous entries
   - Factor in emotional state
   - Monitor response patterns
   - Adapt to user's pace

2. **Tone Integration**
   - Blend prompts naturally
   - Maintain conversation flow
   - Allow for organic transitions
   - Keep responses authentic

3. **Safety Protocols**
   - Include gentle disclaimers
   - Provide clear boundaries
   - Offer support resources
   - Monitor emotional intensity

4. **Implementation Tips**
   - Use as flexible templates
   - Adapt to individual style
   - Maintain natural rhythm
   - Focus on user's experience 