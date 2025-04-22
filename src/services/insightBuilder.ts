import { MoodType, MoodEntry } from './moodAnalysis';
import { JournalEntry, Goal, TimelineItem } from './timelineBuilder';
import { logger } from '../utils/logger';

export interface MoodTrend {
  mood: MoodType;
  frequency: number;
  averageIntensity: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface InsightSummary {
  moodStats: {
    trends: MoodTrend[];
    averageMood: number;
    volatility: number;
    dominantMood: MoodType;
  };
  toneProfile: {
    tone: string;
    usage: number;
    effectiveness: number;
  }[];
  goalStats: {
    completed: number;
    paused: number;
    active: number;
    completionRate: number;
    averageCompletionTime: number;
  };
  depthScore: {
    overall: number;
    byCategory: {
      emotional: number;
      analytical: number;
      reflective: number;
    };
    trend: 'improving' | 'declining' | 'stable';
  };
}

export const buildInsightSummary = (
  timeline: TimelineItem[],
  moodData: MoodEntry[],
  journalEntries: JournalEntry[],
  goals: Goal[]
): InsightSummary => {
  try {
    // Calculate mood statistics
    const moodStats = calculateMoodStats(moodData);
    
    // Analyze tone usage and effectiveness
    const toneProfile = analyzeToneProfile(journalEntries);
    
    // Calculate goal progress metrics
    const goalStats = calculateGoalStats(goals);
    
    // Calculate reflection depth scores
    const depthScore = calculateDepthScore(journalEntries);

    return {
      moodStats,
      toneProfile,
      goalStats,
      depthScore
    };
  } catch (error) {
    logger.error('Error building insight summary:', error);
    throw error;
  }
};

const calculateMoodStats = (moodData: MoodEntry[]): InsightSummary['moodStats'] => {
  if (moodData.length === 0) {
    return {
      trends: [],
      averageMood: 0,
      volatility: 0,
      dominantMood: 'neutral'
    };
  }

  // Calculate mood frequencies and intensities
  const moodCounts: Record<MoodType, { count: number; totalIntensity: number }> = {
    happy: { count: 0, totalIntensity: 0 },
    sad: { count: 0, totalIntensity: 0 },
    anxious: { count: 0, totalIntensity: 0 },
    calm: { count: 0, totalIntensity: 0 },
    energetic: { count: 0, totalIntensity: 0 },
    tired: { count: 0, totalIntensity: 0 },
    neutral: { count: 0, totalIntensity: 0 }
  };

  moodData.forEach(entry => {
    moodCounts[entry.mood].count++;
    moodCounts[entry.mood].totalIntensity += entry.intensity;
  });

  // Calculate trends
  const trends: MoodTrend[] = Object.entries(moodCounts)
    .map(([mood, stats]) => ({
      mood: mood as MoodType,
      frequency: stats.count / moodData.length,
      averageIntensity: stats.count > 0 ? stats.totalIntensity / stats.count : 0,
      trend: calculateMoodTrend(mood as MoodType, moodData)
    }))
    .filter(trend => trend.frequency > 0);

  // Calculate volatility
  const moodValues = moodData.map(entry => entry.intensity);
  const volatility = calculateVolatility(moodValues);

  // Find dominant mood
  const dominantMood = Object.entries(moodCounts)
    .reduce((a, b) => a[1].count > b[1].count ? a : b)[0] as MoodType;

  return {
    trends,
    averageMood: moodValues.reduce((a, b) => a + b, 0) / moodValues.length,
    volatility,
    dominantMood
  };
};

const calculateMoodTrend = (mood: MoodType, moodData: MoodEntry[]): MoodTrend['trend'] => {
  const relevantEntries = moodData.filter(entry => entry.mood === mood);
  if (relevantEntries.length < 2) return 'stable';

  const intensities = relevantEntries.map(entry => entry.intensity);
  const trend = intensities[0] - intensities[intensities.length - 1];
  
  if (trend > 0.5) return 'increasing';
  if (trend < -0.5) return 'decreasing';
  return 'stable';
};

const calculateVolatility = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

const analyzeToneProfile = (journalEntries: JournalEntry[]): InsightSummary['toneProfile'] => {
  const toneCounts: Record<string, { count: number; totalSentiment: number }> = {};
  
  journalEntries.forEach(entry => {
    if (!entry.tone) return;
    
    if (!toneCounts[entry.tone]) {
      toneCounts[entry.tone] = { count: 0, totalSentiment: 0 };
    }
    
    toneCounts[entry.tone].count++;
    if (entry.sentiment) {
      toneCounts[entry.tone].totalSentiment += entry.sentiment;
    }
  });

  return Object.entries(toneCounts).map(([tone, stats]) => ({
    tone,
    usage: stats.count / journalEntries.length,
    effectiveness: stats.totalSentiment / stats.count
  }));
};

const calculateGoalStats = (goals: Goal[]): InsightSummary['goalStats'] => {
  const stats = {
    completed: 0,
    paused: 0,
    active: 0,
    completionRate: 0,
    averageCompletionTime: 0
  };

  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const activeGoals = goals.filter(goal => goal.status === 'active');
  const pausedGoals = goals.filter(goal => goal.status === 'archived');

  stats.completed = completedGoals.length;
  stats.active = activeGoals.length;
  stats.paused = pausedGoals.length;
  stats.completionRate = goals.length > 0 ? completedGoals.length / goals.length : 0;

  // Calculate average completion time
  if (completedGoals.length > 0) {
    const totalCompletionTime = completedGoals.reduce((sum, goal) => {
      return sum + (goal.updatedAt.getTime() - goal.createdAt.getTime());
    }, 0);
    stats.averageCompletionTime = totalCompletionTime / completedGoals.length;
  }

  return stats;
};

const calculateDepthScore = (journalEntries: JournalEntry[]): InsightSummary['depthScore'] => {
  if (journalEntries.length === 0) {
    return {
      overall: 0,
      byCategory: {
        emotional: 0,
        analytical: 0,
        reflective: 0
      },
      trend: 'stable'
    };
  }

  // Calculate depth scores based on content length, sentiment variation, and tone
  const scores = journalEntries.map(entry => {
    const emotionalScore = entry.sentiment ? Math.abs(entry.sentiment) : 0;
    const analyticalScore = entry.content.split(' ').length / 100; // Normalize by word count
    const reflectiveScore = entry.tone === 'empathetic' ? 0.8 : 0.5;

    return {
      emotional: emotionalScore,
      analytical: Math.min(analyticalScore, 1),
      reflective: reflectiveScore
    };
  });

  // Calculate average scores
  const averageScores = {
    emotional: scores.reduce((sum, score) => sum + score.emotional, 0) / scores.length,
    analytical: scores.reduce((sum, score) => sum + score.analytical, 0) / scores.length,
    reflective: scores.reduce((sum, score) => sum + score.reflective, 0) / scores.length
  };

  // Calculate overall score (weighted average)
  const overallScore = (
    averageScores.emotional * 0.4 +
    averageScores.analytical * 0.3 +
    averageScores.reflective * 0.3
  );

  // Determine trend
  const trend = calculateDepthTrend(scores);

  return {
    overall: overallScore,
    byCategory: averageScores,
    trend
  };
};

const calculateDepthTrend = (scores: { emotional: number; analytical: number; reflective: number }[]): InsightSummary['depthScore']['trend'] => {
  if (scores.length < 2) return 'stable';

  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));

  const firstHalfAvg = firstHalf.reduce((sum, score) => 
    sum + (score.emotional + score.analytical + score.reflective) / 3, 0
  ) / firstHalf.length;

  const secondHalfAvg = secondHalf.reduce((sum, score) => 
    sum + (score.emotional + score.analytical + score.reflective) / 3, 0
  ) / secondHalf.length;

  const difference = secondHalfAvg - firstHalfAvg;
  
  if (difference > 0.1) return 'improving';
  if (difference < -0.1) return 'declining';
  return 'stable';
}; 