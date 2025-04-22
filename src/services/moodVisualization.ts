import { MoodPattern, MoodType } from './moodAnalysis';

export interface MoodVisualization {
  period: string;
  charts: {
    moodDistribution: {
      type: 'pie';
      data: { mood: MoodType; percentage: number }[];
    };
    moodTrend: {
      type: 'line';
      data: { date: string; value: number }[];
    };
    intensityHeatmap: {
      type: 'heatmap';
      data: { day: string; hour: number; intensity: number }[];
    };
  };
  insights: {
    summary: string;
    patterns: string[];
    recommendations: string[];
  };
}

export const visualizeMoodPatterns = (patterns: MoodPattern[]): MoodVisualization[] => {
  return patterns.map(pattern => ({
    period: pattern.period,
    charts: {
      moodDistribution: {
        type: 'pie',
        data: Object.entries(pattern.details.moodDistribution)
          .map(([mood, percentage]) => ({
            mood: mood as MoodType,
            percentage: Math.round(percentage * 100)
          }))
          .filter(d => d.percentage > 0)
      },
      moodTrend: {
        type: 'line',
        data: pattern.details.significantEvents.dips
          .concat(pattern.details.significantEvents.spikes)
          .map(entry => ({
            date: entry.timestamp.toISOString().split('T')[0],
            value: MOOD_WEIGHTS[entry.mood] * entry.intensity
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
      },
      intensityHeatmap: {
        type: 'heatmap',
        data: pattern.details.significantEvents.dips
          .concat(pattern.details.significantEvents.spikes)
          .map(entry => ({
            day: entry.timestamp.toLocaleDateString('en-US', { weekday: 'short' }),
            hour: entry.timestamp.getHours(),
            intensity: entry.intensity
          }))
      }
    },
    insights: generateInsights(pattern)
  }));
};

const MOOD_WEIGHTS: Record<MoodType, number> = {
  happy: 1,
  calm: 0.8,
  energetic: 0.6,
  neutral: 0,
  tired: -0.4,
  anxious: -0.6,
  sad: -0.8
};

const generateInsights = (pattern: MoodPattern): {
  summary: string;
  patterns: string[];
  recommendations: string[];
} => {
  const summary = generateSummary(pattern);
  const patterns = detectPatterns(pattern);
  const recommendations = generateRecommendations(pattern, patterns);
  
  return {
    summary,
    patterns,
    recommendations
  };
};

const generateSummary = (pattern: MoodPattern): string => {
  const { dominantMood, volatility, improvement, trends } = pattern;
  
  let summary = `During this period, your dominant mood was ${dominantMood}. `;
  
  if (volatility > 0.6) {
    summary += 'Your mood showed significant variation. ';
  } else if (volatility > 0.3) {
    summary += 'Your mood was moderately stable. ';
  } else {
    summary += 'Your mood remained relatively stable. ';
  }
  
  if (improvement !== undefined) {
    summary += improvement
      ? 'There was an overall improvement in your mood. '
      : 'Your mood showed a declining trend. ';
  }
  
  if (trends.streak > 3) {
    summary += `You maintained the same mood for ${trends.streak} consecutive entries. `;
  }
  
  if (trends.cycleLength) {
    summary += `A mood cycle of ${trends.cycleLength} days was detected. `;
  }
  
  return summary.trim();
};

const detectPatterns = (pattern: MoodPattern): string[] => {
  const patterns: string[] = [];
  const { trends, details } = pattern;
  
  // Detect time-based patterns
  const timePatterns = analyzeTimePatterns(details.significantEvents);
  patterns.push(...timePatterns);
  
  // Detect intensity patterns
  if (details.averageIntensity > 4) {
    patterns.push('High intensity mood entries');
  } else if (details.averageIntensity < 2) {
    patterns.push('Low intensity mood entries');
  }
  
  // Detect stability patterns
  if (trends.stability > 0.8) {
    patterns.push('Very stable mood pattern');
  } else if (trends.stability < 0.3) {
    patterns.push('Frequent mood changes');
  }
  
  return patterns;
};

const analyzeTimePatterns = (events: {
  dips: { timestamp: Date }[];
  spikes: { timestamp: Date }[];
}): string[] => {
  const patterns: string[] = [];
  
  // Analyze time of day patterns
  const morningEvents = [...events.dips, ...events.spikes].filter(
    e => e.timestamp.getHours() >= 6 && e.timestamp.getHours() < 12
  ).length;
  
  const afternoonEvents = [...events.dips, ...events.spikes].filter(
    e => e.timestamp.getHours() >= 12 && e.timestamp.getHours() < 18
  ).length;
  
  const eveningEvents = [...events.dips, ...events.spikes].filter(
    e => e.timestamp.getHours() >= 18 || e.timestamp.getHours() < 6
  ).length;
  
  if (morningEvents > afternoonEvents && morningEvents > eveningEvents) {
    patterns.push('More mood events in the morning');
  } else if (afternoonEvents > morningEvents && afternoonEvents > eveningEvents) {
    patterns.push('More mood events in the afternoon');
  } else if (eveningEvents > morningEvents && eveningEvents > afternoonEvents) {
    patterns.push('More mood events in the evening');
  }
  
  return patterns;
};

const generateRecommendations = (
  pattern: MoodPattern,
  detectedPatterns: string[]
): string[] => {
  const recommendations: string[] = [];
  
  // General recommendations based on volatility
  if (pattern.volatility > 0.6) {
    recommendations.push(
      'Consider practicing mindfulness to help stabilize your mood',
      'Try to identify triggers for mood changes'
    );
  }
  
  // Recommendations based on patterns
  if (detectedPatterns.includes('More mood events in the morning')) {
    recommendations.push(
      'Start your day with a calming routine',
      'Consider morning meditation or exercise'
    );
  }
  
  if (detectedPatterns.includes('More mood events in the evening')) {
    recommendations.push(
      'Establish a relaxing evening routine',
      'Try journaling before bed to process the day'
    );
  }
  
  // Recommendations based on improvement
  if (pattern.improvement === false) {
    recommendations.push(
      'Focus on small, positive changes each day',
      'Consider discussing mood patterns with a professional'
    );
  }
  
  return recommendations;
}; 