# Reflection Context Injection Guide

## Overview
The Reflection Context Injection system integrates journal entries with mood and tone preferences to create meaningful Claude prompts. It analyzes entry content, determines appropriate reflection depth, and generates context-aware questions.

## Core Components

### 1. Reflection Engine
- Entry analysis with sentiment detection
- Depth scoring algorithm
- Focus area identification
- Question generation

### 2. Context Integration
- Tone preference injection
- Mood awareness
- Session type handling
- Token management

### 3. Metadata Tracking
```typescript
interface ReflectionMetadata {
  tone: TonePreference;
  mood: Mood | null;
  sentiment: string;
  depthScore: number;
}
```

## Implementation Details

### 1. Prompt Construction
```typescript
interface ReflectionPrompt {
  opening: string;    // Tone-appropriate introduction
  context: string;    // Emotional and focus context
  questions: string[]; // Depth-appropriate questions
  closing: string;    // Supportive conclusion
  metadata: ReflectionMetadata;
}
```

### 2. Depth Scoring
- Length factor (0-0.3)
- Complexity factor (0-0.3)
- Emotional depth factor (0-0.4)
- Total score range: 0-1

### 3. Token Management
- Base prompt: ~100 tokens
- Context section: ~50 tokens
- Questions: ~20 tokens each
- Metadata: ~30 tokens
- Total target: ~200 tokens

## Example Payloads

### 1. Surface-Level Journal Entry
**Input:**
```json
{
  "entry": "Had a productive day at work. Finished my project early.",
  "mood": "happy",
  "tone": "supportive"
}
```

**Output:**
```
I'm glad you're feeling positive! Let's build on this energy...

Emotional Context: happy, productive
Reflection Depth: surface (35%)
Focus Areas: work
Sentiment: positive

Let's explore this together. Consider these questions:
- What stood out to you in this experience?
- How did you feel in the moment?
- What was most noticeable about this situation?
- How does this relate to your professional growth?

Take your time to reflect on these questions. There are no right or wrong answers.

[Metadata]
Tone: supportive
Mood: happy
Sentiment: positive
Depth Score: 35%
```

### 2. Deep-Level Journal Entry
**Input:**
```json
{
  "entry": "Struggling with work-life balance. Feel like I'm always behind, and it's affecting my relationships. Need to find a way to prioritize what matters.",
  "mood": "anxious",
  "tone": "direct"
}
```

**Output:**
```
Let's create a clear plan to address this. First, we'll...

Emotional Context: struggling, behind, affecting
Reflection Depth: deep (85%)
Focus Areas: work, relationships, wellbeing
Sentiment: negative

Let's explore this together. Consider these questions:
- What deeper meaning might this hold for you?
- How might this experience contribute to your growth?
- What transformation might be possible here?
- What does this reveal about your connections with others?
- What impact might this have on your overall wellbeing?

Take your time to reflect on these questions. There are no right or wrong answers.

[Metadata]
Tone: direct
Mood: anxious
Sentiment: negative
Depth Score: 85%
```

## Best Practices

### 1. Prompt Construction
- Maintain natural flow
- Avoid emotion stacking
- Respect emotional boundaries
- Keep questions relevant

### 2. Context Integration
- Match tone to mood
- Consider session type
- Monitor token usage
- Log reflection metrics

### 3. Error Handling
- Fallback to supportive tone
- Handle missing mood data
- Validate entry content
- Monitor depth scores

## Testing Protocol

### 1. Entry Types
- Short entries (<100 words)
- Medium entries (100-200 words)
- Long entries (>200 words)

### 2. Mood Combinations
- Positive + Supportive
- Neutral + Direct
- Negative + Curious

### 3. Performance Metrics
- Response time
- Token usage
- Depth score accuracy
- Question relevance

## Maintenance

### 1. Regular Updates
- Review question effectiveness
- Update emotion detection
- Refine depth scoring
- Monitor token usage

### 2. Performance Monitoring
- Track response quality
- Monitor token efficiency
- Measure user engagement
- Log system metrics

### 3. Error Prevention
- Validate input data
- Check token limits
- Monitor system health
- Log error patterns 