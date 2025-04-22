import { analyzeMoodHistory, MoodEntry } from '../moodAnalysis';
import { visualizeMoodPatterns } from '../moodVisualization';

describe('Mood Analysis Service', () => {
  const testEntries: MoodEntry[] = [
    {
      timestamp: new Date('2024-03-01T09:00:00'),
      mood: 'happy',
      intensity: 4
    },
    {
      timestamp: new Date('2024-03-02T14:00:00'),
      mood: 'calm',
      intensity: 3
    },
    {
      timestamp: new Date('2024-03-03T18:00:00'),
      mood: 'anxious',
      intensity: 4
    },
    {
      timestamp: new Date('2024-03-04T10:00:00'),
      mood: 'happy',
      intensity: 5
    },
    {
      timestamp: new Date('2024-03-05T15:00:00'),
      mood: 'sad',
      intensity: 3
    },
    {
      timestamp: new Date('2024-03-06T20:00:00'),
      mood: 'calm',
      intensity: 2
    },
    {
      timestamp: new Date('2024-03-07T11:00:00'),
      mood: 'energetic',
      intensity: 4
    }
  ];

  test('analyzes mood history correctly', async () => {
    const patterns = analyzeMoodHistory(testEntries);
    
    expect(patterns).toHaveLength(1); // One week of data
    expect(patterns[0].period).toBe('2024-03-01 to 2024-03-07');
    expect(patterns[0].dominantMood).toBeDefined();
    expect(patterns[0].volatility).toBeGreaterThanOrEqual(0);
    expect(patterns[0].volatility).toBeLessThanOrEqual(1);
    expect(patterns[0].trends.streak).toBeGreaterThanOrEqual(0);
    expect(patterns[0].trends.stability).toBeGreaterThanOrEqual(0);
    expect(patterns[0].trends.stability).toBeLessThanOrEqual(1);
  });

  test('handles empty entries', () => {
    const patterns = analyzeMoodHistory([]);
    expect(patterns).toHaveLength(0);
  });

  test('handles single entry', () => {
    const patterns = analyzeMoodHistory([testEntries[0]]);
    expect(patterns).toHaveLength(1);
    expect(patterns[0].dominantMood).toBe('happy');
    expect(patterns[0].volatility).toBe(0);
  });

  test('detects mood cycles', () => {
    // Create entries with a clear 3-day cycle
    const cyclicEntries: MoodEntry[] = [];
    const moods: MoodEntry['mood'][] = ['happy', 'sad', 'calm'];
    
    for (let i = 0; i < 9; i++) {
      cyclicEntries.push({
        timestamp: new Date(`2024-03-${i + 1}T12:00:00`),
        mood: moods[i % 3],
        intensity: 3
      });
    }
    
    const patterns = analyzeMoodHistory(cyclicEntries);
    expect(patterns[0].trends.cycleLength).toBe(3);
  });

  test('visualizes mood patterns correctly', () => {
    const patterns = analyzeMoodHistory(testEntries);
    const visualizations = visualizeMoodPatterns(patterns);
    
    expect(visualizations).toHaveLength(1);
    expect(visualizations[0].charts.moodDistribution).toBeDefined();
    expect(visualizations[0].charts.moodTrend).toBeDefined();
    expect(visualizations[0].charts.intensityHeatmap).toBeDefined();
    expect(visualizations[0].insights.summary).toBeDefined();
    expect(visualizations[0].insights.patterns).toBeDefined();
    expect(visualizations[0].insights.recommendations).toBeDefined();
  });

  test('generates appropriate recommendations', () => {
    // Create entries with high volatility
    const volatileEntries: MoodEntry[] = [];
    const moods: MoodEntry['mood'][] = ['happy', 'sad', 'happy', 'sad'];
    
    for (let i = 0; i < 7; i++) {
      volatileEntries.push({
        timestamp: new Date(`2024-03-${i + 1}T12:00:00`),
        mood: moods[i % 4],
        intensity: 5
      });
    }
    
    const patterns = analyzeMoodHistory(volatileEntries);
    const visualizations = visualizeMoodPatterns(patterns);
    
    expect(visualizations[0].insights.recommendations).toContain(
      'Consider practicing mindfulness to help stabilize your mood'
    );
  });

  test('detects time-based patterns', () => {
    // Create entries with more morning events
    const morningEntries: MoodEntry[] = [];
    
    for (let i = 0; i < 7; i++) {
      morningEntries.push({
        timestamp: new Date(`2024-03-${i + 1}T09:00:00`),
        mood: 'happy',
        intensity: 4
      });
    }
    
    const patterns = analyzeMoodHistory(morningEntries);
    const visualizations = visualizeMoodPatterns(patterns);
    
    expect(visualizations[0].insights.patterns).toContain(
      'More mood events in the morning'
    );
  });
}); 