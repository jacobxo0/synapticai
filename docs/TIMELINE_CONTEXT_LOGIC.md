# Timeline Context Injection Guide

## Overview
The Timeline Context Injection system enables Claude to provide time-aware reflections and coaching by incorporating historical context, emotional milestones, and goal progression into the conversation.

## Core Components

### 1. Timeline Structure
```typescript
interface TimelineContext {
  summary: string;
  anchors: TimelineAnchor[];
  recentStreaks: Streak[];
  goalHistory: GoalFocus[];
  metadata: {
    lastUpdated: Date;
    tokenCount: number;
    emotionalState: 'stable' | 'sensitive' | 'trauma';
  };
}

interface TimelineAnchor {
  id: string;
  date: Date;
  type: 'milestone' | 'shift' | 'pattern';
  description: string;
  emotionalTags: string[];
  relevance: number; // 0-1 scale
}

interface Streak {
  type: 'journaling' | 'reflection' | 'goal';
  startDate: Date;
  endDate: Date | null;
  count: number;
}

interface GoalFocus {
  area: string;
  startDate: Date;
  intensity: number; // 0-1 scale
  progress: number; // 0-1 scale
}
```

### 2. Context Flow
1. Analyze recent entries for timeline data
2. Identify emotional milestones and patterns
3. Calculate streaks and goal progress
4. Generate timeline summary
5. Inject into Claude's context

## Implementation Details

### 1. Timeline Analysis
- Extract key dates and events
- Identify emotional patterns
- Track goal progression
- Calculate engagement metrics

### 2. Context Generation
```typescript
const TIMELINE_TEMPLATES = {
  stable: {
    summary: "Looking at your journey, we can see...",
    anchors: "Notable moments include...",
    progress: "Your progress in {area} shows..."
  },
  sensitive: {
    summary: "In recent weeks, you've been exploring...",
    anchors: "Some significant experiences were...",
    progress: "You've been working with {area}..."
  },
  trauma: {
    summary: "Your recent entries show...",
    anchors: "Important to note...",
    progress: "In {area}, you've been..."
  }
};
```

### 3. Token Management
- Base timeline: ~150 tokens
- Anchors: ~50 tokens each
- Streaks: ~30 tokens each
- Goal history: ~40 tokens each
- Total target: ~300 tokens

## Example Sequences

### 1. Stable Emotional State
**Input:**
```json
{
  "entries": [
    {
      "date": "2024-03-01",
      "content": "Started new meditation practice...",
      "mood": "calm"
    },
    {
      "date": "2024-03-15",
      "content": "Noticed improved focus...",
      "mood": "positive"
    }
  ],
  "emotionalState": "stable"
}
```

**Output:**
```typescript
{
  summary: "Over the past month, you've established a consistent meditation practice, with noticeable improvements in focus and emotional regulation.",
  anchors: [
    {
      id: "anchor_1",
      date: "2024-03-01",
      type: "milestone",
      description: "Started meditation practice",
      emotionalTags: ["calm", "discipline"],
      relevance: 0.9
    }
  ],
  recentStreaks: [
    {
      type: "journaling",
      startDate: "2024-03-01",
      endDate: null,
      count: 15
    }
  ],
  goalHistory: [
    {
      area: "mindfulness",
      startDate: "2024-03-01",
      intensity: 0.8,
      progress: 0.6
    }
  ]
}
```

### 2. Sensitive State
**Input:**
```json
{
  "entries": [
    {
      "date": "2024-03-10",
      "content": "Feeling overwhelmed with work...",
      "mood": "anxious"
    },
    {
      "date": "2024-03-12",
      "content": "Talking with manager helped...",
      "mood": "relieved"
    }
  ],
  "emotionalState": "sensitive"
}
```

**Output:**
```typescript
{
  summary: "In recent days, you've navigated some work-related challenges, showing resilience in seeking support and finding solutions.",
  anchors: [
    {
      id: "anchor_2",
      date: "2024-03-12",
      type: "shift",
      description: "Positive resolution of work stress",
      emotionalTags: ["anxiety", "relief"],
      relevance: 0.8
    }
  ],
  recentStreaks: [
    {
      type: "reflection",
      startDate: "2024-03-10",
      endDate: null,
      count: 3
    }
  ],
  goalHistory: [
    {
      area: "work-life balance",
      startDate: "2024-03-10",
      intensity: 0.9,
      progress: 0.4
    }
  ]
}
```

## Best Practices

### 1. Timeline Construction
- Focus on recent relevant events
- Maintain emotional sensitivity
- Track meaningful patterns
- Respect privacy boundaries

### 2. Emotional Safety
- Adjust detail level based on state
- Provide opt-out options
- Respect trauma triggers
- Allow timeline suppression

### 3. Context Integration
- Match tone to emotional state
- Align with current focus
- Track progression patterns
- Maintain continuity

## Testing Protocol

### 1. Timeline Types
- Stable progression
- Sensitive periods
- Trauma recovery
- Mixed emotional states

### 2. Context Combinations
- Journal + reflection
- Goal + milestone
- Streak + pattern
- Multiple focus areas

### 3. Performance Metrics
- Timeline accuracy
- Emotional safety
- Context relevance
- Token efficiency

## Maintenance

### 1. Regular Updates
- Review timeline patterns
- Update emotional tags
- Refine milestone detection
- Monitor user feedback

### 2. Performance Monitoring
- Track context usage
- Monitor emotional impact
- Measure relevance
- Log system metrics

### 3. Error Prevention
- Validate timeline data
- Check emotional boundaries
- Monitor token usage
- Log error patterns 