# Reflection Engine Documentation

## Overview
The Reflection Engine transforms journal entries into meaningful Claude prompts that support introspection and emotional awareness. It analyzes entry content, determines appropriate reflection depth, and generates context-aware questions.

## Core Components

### 1. Entry Analysis
- Emotional content detection
- Depth level assessment
- Focus area identification
- Context tag generation

### 2. Prompt Structure
```typescript
interface ReflectionPrompt {
  opening: string;    // Tone-appropriate introduction
  context: string;    // Emotional and focus context
  questions: string[]; // Depth-appropriate questions
  closing: string;    // Supportive conclusion
}
```

### 3. Depth Levels
- **Surface**: Basic emotional awareness
- **Moderate**: Pattern recognition
- **Deep**: Meaning and transformation

## Implementation Details

### 1. Context Analysis
```typescript
interface ReflectionContext {
  emotion: string[];      // Detected emotional content
  depth: 'surface' | 'moderate' | 'deep';
  focus: string[];        // Identified focus areas
}
```

### 2. Question Selection
- Depth-appropriate base questions
- Focus-specific additional questions
- Tone-aligned phrasing

### 3. Token Management
- Base prompt: ~100 tokens
- Context section: ~50 tokens
- Questions: ~20 tokens each
- Closing: ~30 tokens

## Example Prompts

### 1. Surface-Level Entry
**Input:**
```
"Had a good day at work. Finished my project early and got positive feedback."
```

**Output:**
```
I'm glad you're feeling positive! Let's build on this energy...

Emotional Context: happy, positive
Reflection Depth: surface
Focus Areas: work

Let's explore this together. Consider these questions:
- What stood out to you in this experience?
- How did you feel in the moment?
- What was most noticeable about this situation?
- How does this relate to your professional growth?

Take your time to reflect on these questions. There are no right or wrong answers.
```

### 2. Deep-Level Entry
**Input:**
```
"Struggling with work-life balance. Feel like I'm always behind, and it's affecting my relationships. Need to find a way to prioritize what matters."
```

**Output:**
```
I hear your concern. Let's explore what might help you feel more supported right now...

Emotional Context: struggling, behind, affecting
Reflection Depth: deep
Focus Areas: work, relationships, wellbeing

Let's explore this together. Consider these questions:
- What deeper meaning might this hold for you?
- How might this experience contribute to your growth?
- What transformation might be possible here?
- What does this reveal about your connections with others?
- What impact might this have on your overall wellbeing?

Take your time to reflect on these questions. There are no right or wrong answers.
```

## Best Practices

### 1. Emotional Awareness
- Avoid emotion stacking
- Maintain natural flow
- Respect emotional boundaries

### 2. Question Design
- Progressive depth
- Open-ended phrasing
- Focus relevance

### 3. Tone Integration
- Match user's tone preference
- Maintain consistency
- Support emotional state

## Token Budget Guidelines

### 1. Component Limits
- Opening: 50 tokens
- Context: 50 tokens
- Questions: 20 tokens each
- Closing: 30 tokens
- Total target: ~200 tokens

### 2. Optimization
- Cache common patterns
- Pre-compute questions
- Monitor token usage

## Testing Protocol

### 1. Entry Types
- Short entries (<100 words)
- Medium entries (100-200 words)
- Long entries (>200 words)

### 2. Focus Areas
- Work
- Relationships
- Goals
- Wellbeing

### 3. Emotional States
- Positive
- Neutral
- Challenging

## Maintenance

### 1. Question Updates
- Review effectiveness
- Add new patterns
- Remove unused questions

### 2. Performance Monitoring
- Track response quality
- Monitor token usage
- Measure user engagement

### 3. Error Handling
- Log analysis failures
- Track question selection
- Monitor prompt generation 