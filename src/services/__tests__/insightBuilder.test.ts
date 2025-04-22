import { buildInsightSummary } from '../insightBuilder';
import { MoodEntry } from '../moodAnalysis';
import { JournalEntry, Goal, TimelineItem } from '../timelineBuilder';

describe('Insight Builder', () => {
  const mockTimeline: TimelineItem[] = [
    {
      date: '2024-03-01T09:00:00',
      mood: 'happy',
      moodIntensity: 4,
      metadata: {
        type: 'mood',
        sourceId: '1'
      }
    },
    {
      date: '2024-03-01T10:00:00',
      entrySummary: 'Productive morning',
      tone: 'professional',
      sentiment: 0.8,
      metadata: {
        type: 'journal',
        sourceId: '1'
      }
    }
  ];

  const mockMoodData: MoodEntry[] = [
    {
      timestamp: new Date('2024-03-01T09:00:00'),
      mood: 'happy',
      intensity: 4
    },
    {
      timestamp: new Date('2024-03-02T14:00:00'),
      mood: 'sad',
      intensity: 3
    },
    {
      timestamp: new Date('2024-03-03T18:00:00'),
      mood: 'happy',
      intensity: 5
    }
  ];

  const mockJournalEntries: JournalEntry[] = [
    {
      id: '1',
      content: 'Had a great day at work. Learned many new things and felt productive.',
      timestamp: new Date('2024-03-01T10:00:00'),
      summary: 'Productive workday',
      tone: 'professional',
      sentiment: 0.8
    },
    {
      id: '2',
      content: 'Feeling a bit overwhelmed with tasks. Need to take a break.',
      timestamp: new Date('2024-03-02T15:00:00'),
      summary: 'Stressful afternoon',
      tone: 'empathetic',
      sentiment: -0.6
    }
  ];

  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Complete project',
      description: 'Finish the main project',
      createdAt: new Date('2024-03-01T08:00:00'),
      updatedAt: new Date('2024-03-01T08:00:00'),
      status: 'completed'
    },
    {
      id: '2',
      title: 'Learn new skill',
      description: 'Start learning TypeScript',
      createdAt: new Date('2024-03-02T09:00:00'),
      updatedAt: new Date('2024-03-02T09:00:00'),
      status: 'active'
    }
  ];

  test('builds complete insight summary', () => {
    const summary = buildInsightSummary(mockTimeline, mockMoodData, mockJournalEntries, mockGoals);
    
    expect(summary.moodStats.trends).toHaveLength(2); // happy and sad
    expect(summary.toneProfile).toHaveLength(2); // professional and empathetic
    expect(summary.goalStats.completed).toBe(1);
    expect(summary.depthScore.overall).toBeGreaterThan(0);
  });

  test('calculates mood statistics correctly', () => {
    const summary = buildInsightSummary(mockTimeline, mockMoodData, mockJournalEntries, mockGoals);
    
    const happyTrend = summary.moodStats.trends.find(t => t.mood === 'happy');
    expect(happyTrend).toBeDefined();
    expect(happyTrend?.frequency).toBeGreaterThan(0);
    expect(happyTrend?.averageIntensity).toBeGreaterThan(0);
    
    expect(summary.moodStats.volatility).toBeGreaterThan(0);
    expect(summary.moodStats.dominantMood).toBeDefined();
  });

  test('analyzes tone profile correctly', () => {
    const summary = buildInsightSummary(mockTimeline, mockMoodData, mockJournalEntries, mockGoals);
    
    const professionalTone = summary.toneProfile.find(t => t.tone === 'professional');
    expect(professionalTone).toBeDefined();
    expect(professionalTone?.usage).toBe(0.5);
    expect(professionalTone?.effectiveness).toBe(0.8);
  });

  test('calculates goal statistics correctly', () => {
    const summary = buildInsightSummary(mockTimeline, mockMoodData, mockJournalEntries, mockGoals);
    
    expect(summary.goalStats.completed).toBe(1);
    expect(summary.goalStats.active).toBe(1);
    expect(summary.goalStats.completionRate).toBe(0.5);
    expect(summary.goalStats.averageCompletionTime).toBeGreaterThan(0);
  });

  test('calculates depth score correctly', () => {
    const summary = buildInsightSummary(mockTimeline, mockMoodData, mockJournalEntries, mockGoals);
    
    expect(summary.depthScore.overall).toBeGreaterThan(0);
    expect(summary.depthScore.byCategory.emotional).toBeGreaterThan(0);
    expect(summary.depthScore.byCategory.analytical).toBeGreaterThan(0);
    expect(summary.depthScore.byCategory.reflective).toBeGreaterThan(0);
    expect(['improving', 'declining', 'stable']).toContain(summary.depthScore.trend);
  });

  test('handles empty input arrays', () => {
    const summary = buildInsightSummary([], [], [], []);
    
    expect(summary.moodStats.trends).toHaveLength(0);
    expect(summary.toneProfile).toHaveLength(0);
    expect(summary.goalStats.completed).toBe(0);
    expect(summary.depthScore.overall).toBe(0);
  });

  test('calculates mood trends correctly', () => {
    const increasingMoodData: MoodEntry[] = [
      { timestamp: new Date(), mood: 'happy', intensity: 2 },
      { timestamp: new Date(), mood: 'happy', intensity: 3 },
      { timestamp: new Date(), mood: 'happy', intensity: 4 }
    ];

    const summary = buildInsightSummary(mockTimeline, increasingMoodData, mockJournalEntries, mockGoals);
    const happyTrend = summary.moodStats.trends.find(t => t.mood === 'happy');
    expect(happyTrend?.trend).toBe('increasing');
  });
}); 