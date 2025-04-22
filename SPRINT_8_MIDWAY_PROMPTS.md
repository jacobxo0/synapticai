# Sprint 8 Midway Analysis Prompts

## 🔍 For Lucie Logs (Data Analysis)

```markdown
[GOAL]
Analyze the reflection loop's data patterns and effectiveness metrics.

[CONTEXT]
You are Lucie Logs. Sprint 8's reflection engine is now live. We need to validate the semantic feedback loops and identify optimization opportunities.

[TASKS]

1. Data Analysis:
   - Calculate reflection depth distribution
   - Map tone-mood correlations
   - Track response time patterns
   - Identify usage trends

2. Pattern Recognition:
   - Find common feedback themes
   - Map emotional resonance patterns
   - Analyze context relevance scores
   - Track improvement trajectories

3. Metrics Validation:
   - Verify success metrics
   - Check performance targets
   - Validate quality benchmarks
   - Assess engagement rates

[DELIVERABLES]
- Data visualization recommendations
- Pattern analysis report
- Performance optimization suggestions
- Next iteration priorities

[GUIDELINES]
- Focus on actionable insights
- Include specific metrics
- Highlight optimization opportunities
- Suggest A/B test ideas
```

## 💭 For Freja Feedback (User Research)

```markdown
[GOAL]
Evaluate user experience and satisfaction with the reflection loop.

[CONTEXT]
You are Freja Feedback. The reflection engine has been live for two weeks. We need to assess user engagement and identify improvement areas.

[TASKS]

1. User Experience:
   - Analyze feedback patterns
   - Map tone effectiveness
   - Track user satisfaction
   - Identify pain points

2. Emotional Impact:
   - Assess mood correlations
   - Evaluate depth perception
   - Track engagement levels
   - Measure improvement rates

3. Feature Optimization:
   - Suggest UI improvements
   - Recommend tone adjustments
   - Propose new features
   - Identify missing elements

[DELIVERABLES]
- User satisfaction report
- Feature enhancement suggestions
- UX improvement recommendations
- Next sprint priorities

[GUIDELINES]
- Focus on user perspective
- Include specific examples
- Highlight success stories
- Suggest quick wins
```

## 📊 Expected Output Format

### Lucie's Analysis
```typescript
interface MidSprintAnalysis {
  metrics: {
    performance: Record<string, number>;
    quality: Record<string, number>;
    engagement: Record<string, number>;
  };
  patterns: {
    depthDistribution: Record<DepthLevel, number>;
    toneEffectiveness: Record<ToneType, number>;
    moodCorrelations: Record<MoodType, number>;
  };
  recommendations: {
    optimizations: string[];
    experiments: string[];
    priorities: string[];
  };
}
```

### Freja's Analysis
```typescript
interface UserExperienceAnalysis {
  feedback: {
    satisfaction: number;
    engagement: number;
    improvement: number;
  };
  patterns: {
    tonePreferences: Record<ToneType, number>;
    depthPreferences: Record<DepthLevel, number>;
    painPoints: string[];
  };
  recommendations: {
    quickWins: string[];
    enhancements: string[];
    newFeatures: string[];
  };
}
```

## 🎯 Success Criteria

### Data Analysis (Lucie)
- 95% metric accuracy
- Clear pattern identification
- Actionable recommendations
- Specific optimization targets

### User Research (Freja)
- 90% feedback coverage
- Clear user insights
- Specific improvement suggestions
- Prioritized feature requests

## ⏱️ Timeline
- Analysis completion: 24 hours
- Report generation: 12 hours
- Review and iteration: 12 hours
- Next sprint planning: 24 hours 