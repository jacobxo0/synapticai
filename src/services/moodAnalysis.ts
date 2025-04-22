import { logger } from '../utils/logger';

export type MoodType = 'happy' | 'sad' | 'anxious' | 'calm' | 'energetic' | 'tired' | 'neutral';
export type MoodIntensity = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  timestamp: Date;
  mood: MoodType;
  intensity: MoodIntensity;
  note?: string;
}

export interface MoodPattern {
  period: string;
  dominantMood: MoodType;
  volatility: number;
  improvement?: boolean;
  trends: {
    streak: number;
    stability: number;
    cycleLength?: number;
  };
  details: {
    averageIntensity: number;
    moodDistribution: Record<MoodType, number>;
    significantEvents: {
      dips: MoodEntry[];
      spikes: MoodEntry[];
    };
  };
}

const MOOD_WEIGHTS: Record<MoodType, number> = {
  happy: 1,
  calm: 0.8,
  energetic: 0.6,
  neutral: 0,
  tired: -0.4,
  anxious: -0.6,
  sad: -0.8
};

export const analyzeMoodHistory = (moodEntries: MoodEntry[]): MoodPattern[] => {
  try {
    // Sort entries by timestamp
    const sortedEntries = [...moodEntries].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );

    // Split into weekly periods
    const weeklyPatterns = splitIntoPeriods(sortedEntries, 'week');
    
    // Analyze each period
    return weeklyPatterns.map(periodEntries => {
      const period = formatPeriod(periodEntries[0].timestamp, 'week');
      
      // Calculate basic statistics
      const moodDistribution = calculateMoodDistribution(periodEntries);
      const dominantMood = findDominantMood(moodDistribution);
      const volatility = calculateVolatility(periodEntries);
      const averageIntensity = calculateAverageIntensity(periodEntries);
      
      // Detect patterns
      const streak = detectStreak(periodEntries);
      const stability = calculateStability(periodEntries);
      const cycleLength = detectCycles(periodEntries);
      
      // Find significant events
      const significantEvents = findSignificantEvents(periodEntries);
      
      // Determine improvement
      const improvement = detectImprovement(periodEntries);
      
      return {
        period,
        dominantMood,
        volatility,
        improvement,
        trends: {
          streak,
          stability,
          cycleLength
        },
        details: {
          averageIntensity,
          moodDistribution,
          significantEvents
        }
      };
    });
  } catch (error) {
    logger.error('Error analyzing mood history:', error);
    return [];
  }
};

const splitIntoPeriods = (entries: MoodEntry[], period: 'day' | 'week' | 'month'): MoodEntry[][] => {
  const periods: MoodEntry[][] = [];
  let currentPeriod: MoodEntry[] = [];
  let currentPeriodStart: Date | null = null;

  for (const entry of entries) {
    const entryPeriod = getPeriodStart(entry.timestamp, period);
    
    if (!currentPeriodStart || entryPeriod.getTime() !== currentPeriodStart.getTime()) {
      if (currentPeriod.length > 0) {
        periods.push(currentPeriod);
      }
      currentPeriod = [entry];
      currentPeriodStart = entryPeriod;
    } else {
      currentPeriod.push(entry);
    }
  }

  if (currentPeriod.length > 0) {
    periods.push(currentPeriod);
  }

  return periods;
};

const getPeriodStart = (date: Date, period: 'day' | 'week' | 'month'): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  
  if (period === 'week') {
    start.setDate(start.getDate() - start.getDay());
  } else if (period === 'month') {
    start.setDate(1);
  }
  
  return start;
};

const formatPeriod = (date: Date, period: 'day' | 'week' | 'month'): string => {
  const start = getPeriodStart(date, period);
  const end = new Date(start);
  
  if (period === 'week') {
    end.setDate(end.getDate() + 6);
  } else if (period === 'month') {
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
  } else {
    end.setDate(end.getDate() + 1);
  }
  
  return `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`;
};

const calculateMoodDistribution = (entries: MoodEntry[]): Record<MoodType, number> => {
  const distribution: Record<MoodType, number> = {
    happy: 0,
    sad: 0,
    anxious: 0,
    calm: 0,
    energetic: 0,
    tired: 0,
    neutral: 0
  };
  
  entries.forEach(entry => {
    distribution[entry.mood]++;
  });
  
  // Convert to percentages
  Object.keys(distribution).forEach(mood => {
    distribution[mood as MoodType] = distribution[mood as MoodType] / entries.length;
  });
  
  return distribution;
};

const findDominantMood = (distribution: Record<MoodType, number>): MoodType => {
  return Object.entries(distribution).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0] as MoodType;
};

const calculateVolatility = (entries: MoodEntry[]): number => {
  if (entries.length < 2) return 0;
  
  const moodValues = entries.map(entry => 
    MOOD_WEIGHTS[entry.mood] * entry.intensity
  );
  
  const mean = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
  const variance = moodValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / moodValues.length;
  
  return Math.sqrt(variance);
};

const calculateAverageIntensity = (entries: MoodEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
};

const detectStreak = (entries: MoodEntry[]): number => {
  if (entries.length < 2) return 0;
  
  let currentStreak = 1;
  let maxStreak = 1;
  
  for (let i = 1; i < entries.length; i++) {
    if (entries[i].mood === entries[i - 1].mood) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
};

const calculateStability = (entries: MoodEntry[]): number => {
  if (entries.length < 2) return 1;
  
  const moodChanges = entries.slice(1).filter((entry, i) => 
    entry.mood !== entries[i].mood
  ).length;
  
  return 1 - (moodChanges / (entries.length - 1));
};

const detectCycles = (entries: MoodEntry[]): number | undefined => {
  if (entries.length < 7) return undefined;
  
  // Simple cycle detection based on mood repetition
  const moods = entries.map(entry => entry.mood);
  const maxCycleLength = Math.min(7, Math.floor(entries.length / 2));
  
  for (let cycleLength = 2; cycleLength <= maxCycleLength; cycleLength++) {
    let isCycle = true;
    for (let i = 0; i < entries.length - cycleLength; i++) {
      if (moods[i] !== moods[i + cycleLength]) {
        isCycle = false;
        break;
      }
    }
    if (isCycle) return cycleLength;
  }
  
  return undefined;
};

const findSignificantEvents = (entries: MoodEntry[]): {
  dips: MoodEntry[];
  spikes: MoodEntry[];
} => {
  const dips: MoodEntry[] = [];
  const spikes: MoodEntry[] = [];
  
  if (entries.length < 3) return { dips, spikes };
  
  const moodValues = entries.map(entry => 
    MOOD_WEIGHTS[entry.mood] * entry.intensity
  );
  
  const mean = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
  const stdDev = Math.sqrt(
    moodValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / moodValues.length
  );
  
  entries.forEach((entry, i) => {
    const value = MOOD_WEIGHTS[entry.mood] * entry.intensity;
    if (value < mean - 2 * stdDev) {
      dips.push(entry);
    } else if (value > mean + 2 * stdDev) {
      spikes.push(entry);
    }
  });
  
  return { dips, spikes };
};

const detectImprovement = (entries: MoodEntry[]): boolean | undefined => {
  if (entries.length < 7) return undefined;
  
  const moodValues = entries.map(entry => 
    MOOD_WEIGHTS[entry.mood] * entry.intensity
  );
  
  // Split into two halves
  const midPoint = Math.floor(entries.length / 2);
  const firstHalf = moodValues.slice(0, midPoint);
  const secondHalf = moodValues.slice(midPoint);
  
  const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  return secondMean > firstMean;
}; 