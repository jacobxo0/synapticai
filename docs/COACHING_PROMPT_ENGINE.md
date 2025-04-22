# Coaching Prompt Engine Guide

## Overview
The Coaching Prompt Engine transforms journal entries and Claude's reflections into goal-oriented, action-focused prompts while maintaining therapeutic boundaries. It helps users move from reflection to meaningful next steps.

## Core Components

### 1. Input Processing
```typescript
interface CoachingInput {
  entry: string;          // Original journal entry
  reflection: string;     // Claude's previous reflection
  mood: Mood | null;      // Current user mood
  tone: TonePreference;   // Selected tone preference
  focusAreas?: string[];  // Detected focus areas
}
```

### 2. Prompt Structure
```typescript
interface CoachingPrompt {
  context: string;        // Emotional and focus context
  reflection: string;     // Key insights from previous reflection
  actionFrame: string;    // Action-oriented framing
  boundaries: string;     // Therapeutic boundaries
  metadata: {
    tone: TonePreference;
    mood: Mood | null;
    focusAreas: string[];
    tokenEstimate: number;
  };
}
```

## Implementation Details

### 1. Context Building
- Extract key emotional themes
- Identify focus areas
- Map mood to appropriate action framing
- Apply tone-specific language

### 2. Action Framing
- Use exploratory language
- Focus on user agency
- Maintain therapeutic boundaries
- Suggest reflective actions

### 3. Token Management
- Base prompt: ~150 tokens
- Context section: ~100 tokens
- Reflection summary: ~50 tokens
- Action framing: ~100 tokens
- Boundaries: ~50 tokens
- Total target: ~450 tokens

## Example Payloads

### 1. Work-Life Balance Focus
**Input:**
```json
{
  "entry": "I'm feeling overwhelmed with work deadlines and haven't had time for my family. My partner seems distant.",
  "reflection": "You're experiencing tension between professional responsibilities and personal relationships. This imbalance is affecting your emotional wellbeing.",
  "mood": "anxious",
  "tone": "supportive",
  "focusAreas": ["work", "relationships", "wellbeing"]
}
```

**Output:**
```
[Context]
Emotional State: anxious, overwhelmed
Focus Areas: work-life balance, relationships, wellbeing
Tone: supportive

[Reflection Summary]
You've identified a significant tension between work demands and personal relationships, with particular concern about your partner's emotional distance.

[Action Frame]
You might consider exploring what a balanced week would look like for you. What small adjustments could you make to create more space for connection? How might you communicate your needs while respecting your professional commitments?

[Boundaries]
Remember, these are suggestions for exploration, not directives. You know your situation best, and any changes should feel right for you.

[Metadata]
Tone: supportive
Mood: anxious
Focus Areas: work, relationships, wellbeing
Token Estimate: 420
```

### 2. Personal Growth Focus
**Input:**
```json
{
  "entry": "I want to grow in my career but feel stuck. Not sure what steps to take next.",
  "reflection": "You're seeking growth and direction in your professional life, but uncertainty is creating hesitation.",
  "mood": "neutral",
  "tone": "direct",
  "focusAreas": ["work", "goals"]
}
```

**Output:**
```
[Context]
Emotional State: seeking direction
Focus Areas: career growth, goal setting
Tone: direct

[Reflection Summary]
You're ready for professional growth but need clarity on your next steps. The uncertainty is holding you back from taking action.

[Action Frame]
What specific aspects of your current role feel limiting? What skills or experiences would you like to develop? You might consider mapping out your ideal career path and identifying the gaps between where you are and where you want to be.

[Boundaries]
These are starting points for your exploration. The pace and direction of your growth journey are entirely yours to determine.

[Metadata]
Tone: direct
Mood: neutral
Focus Areas: work, goals
Token Estimate: 380
```

## Best Practices

### 1. Action Framing
- Use exploratory language ("You might consider...")
- Focus on user agency ("What feels right for you?")
- Suggest reflective actions ("How might you...")
- Avoid prescriptive language

### 2. Tone Adaptation
- Supportive: Emphasize self-compassion
- Direct: Focus on clear next steps
- Curious: Encourage exploration

### 3. Emotional Boundaries
- Never give direct advice
- Maintain therapeutic distance
- Respect user autonomy
- Focus on process over outcome

## Testing Protocol

### 1. Input Types
- Short entries (<100 words)
- Medium entries (100-200 words)
- Long entries (>200 words)

### 2. Mood Combinations
- Positive + Supportive
- Neutral + Direct
- Negative + Curious

### 3. Focus Areas
- Single focus
- Multiple focuses
- No clear focus

## Maintenance

### 1. Regular Updates
- Review action framing effectiveness
- Update focus area detection
- Refine tone adaptation
- Monitor token usage

### 2. Performance Monitoring
- Track response quality
- Monitor user engagement
- Measure action effectiveness
- Log system metrics

### 3. Error Prevention
- Validate input data
- Check token limits
- Monitor tone boundaries
- Log error patterns 