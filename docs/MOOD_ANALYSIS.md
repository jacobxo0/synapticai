# Mood Analysis and Visualization System

## Overview
The Mood Analysis and Visualization System provides comprehensive insights into user mood patterns over time. It analyzes mood entries to detect trends, cycles, and patterns, then presents this information through visualizations and actionable insights.

## Core Components

### 1. Mood Analysis Service
The `analyzeMoodHistory` function processes mood entries to identify:
- Mood distribution and dominant moods
- Volatility and stability metrics
- Streaks and cycles
- Time-based patterns
- Significant events and improvements

### 2. Visualization Service
The `visualizeMoodPatterns` function generates:
- Mood distribution pie charts
- Mood trend line charts
- Intensity heatmaps
- Pattern insights
- Personalized recommendations

## Data Structure

### Mood Entry
```typescript
interface MoodEntry {
  timestamp: Date;
  mood: 'happy' | 'sad' | 'calm' | 'anxious' | 'energetic';
  intensity: number; // 1-5 scale
}
```

### Mood Pattern
```typescript
interface MoodPattern {
  period: string;
  dominantMood: string;
  volatility: number;
  trends: {
    streak: number;
    stability: number;
    cycleLength?: number;
    significantEvents: string[];
    improvement?: boolean;
  };
}
```

### Visualization Output
```typescript
interface MoodVisualization {
  period: string;
  charts: {
    moodDistribution: {
      labels: string[];
      data: number[];
    };
    moodTrend: {
      dates: string[];
      values: number[];
    };
    intensityHeatmap: {
      days: string[];
      hours: string[];
      values: number[][];
    };
  };
  insights: {
    summary: string;
    patterns: string[];
    recommendations: string[];
  };
}
```

## Analysis Features

### 1. Pattern Detection
- Weekly mood distribution
- Mood volatility and stability
- Streak detection (consecutive similar moods)
- Cycle identification (repeating mood patterns)
- Time-of-day patterns

### 2. Trend Analysis
- Mood progression over time
- Intensity variations
- Improvement detection
- Significant event identification

### 3. Visualization Types
- Pie charts for mood distribution
- Line charts for trend analysis
- Heatmaps for time-based patterns
- Textual insights and recommendations

## Usage Example

```typescript
import { analyzeMoodHistory } from '../services/moodAnalysis';
import { visualizeMoodPatterns } from '../services/moodVisualization';

// Analyze mood history
const moodEntries: MoodEntry[] = [...]; // Your mood entries
const patterns = analyzeMoodHistory(moodEntries);

// Generate visualizations
const visualizations = visualizeMoodPatterns(patterns);

// Access insights
console.log(visualizations[0].insights.summary);
console.log(visualizations[0].insights.patterns);
console.log(visualizations[0].insights.recommendations);
```

## Privacy Considerations
- All analysis is performed locally
- No mood data is stored permanently
- Analysis results are anonymized
- No personally identifiable information is processed

## Performance
- Optimized for real-time analysis
- Efficient chunking of large datasets
- Cached calculations for repeated patterns
- Responsive visualization generation

## Testing
The system includes comprehensive tests covering:
- Basic mood analysis
- Edge cases (empty entries, single entries)
- Pattern detection
- Visualization generation
- Recommendation accuracy
- Time-based pattern detection

## Future Improvements
1. Enhanced pattern recognition using machine learning
2. Integration with journal entries for deeper insights
3. Customizable visualization options
4. Export functionality for data analysis
5. Mobile-optimized visualizations
6. Real-time mood tracking integration
7. Social features (anonymous pattern sharing)
8. Advanced recommendation engine 