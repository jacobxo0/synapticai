import { buildUserTimeline } from '../timelineBuilder';
import { MoodEntry } from '../moodAnalysis';
import { JournalEntry, Goal } from '../timelineBuilder';

describe('Timeline Builder', () => {
  const mockJournalEntries: JournalEntry[] = [
    {
      id: '1',
      content: 'Had a great day at work',
      timestamp: new Date('2024-03-01T10:00:00'),
      summary: 'Productive workday',
      tone: 'professional',
      sentiment: 0.8
    },
    {
      id: '2',
      content: 'Feeling overwhelmed with tasks',
      timestamp: new Date('2024-03-02T15:00:00'),
      summary: 'Stressful afternoon',
      tone: 'empathetic',
      sentiment: -0.6
    }
  ];

  const mockMoodEntries: MoodEntry[] = [
    {
      timestamp: new Date('2024-03-01T09:00:00'),
      mood: 'happy',
      intensity: 4
    },
    {
      timestamp: new Date('2024-03-02T14:00:00'),
      mood: 'sad',
      intensity: 4
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

  test('builds timeline with all entry types', () => {
    const timeline = buildUserTimeline(mockJournalEntries, mockMoodEntries, mockGoals);
    
    expect(timeline).toHaveLength(6); // 2 journal + 2 mood + 2 goal entries
    expect(timeline[0].metadata.type).toBe('goal');
    expect(timeline[1].metadata.type).toBe('mood');
    expect(timeline[2].metadata.type).toBe('journal');
  });

  test('sorts entries chronologically', () => {
    const timeline = buildUserTimeline(mockJournalEntries, mockMoodEntries, mockGoals);
    
    for (let i = 1; i < timeline.length; i++) {
      const currentDate = new Date(timeline[i].date);
      const previousDate = new Date(timeline[i - 1].date);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(previousDate.getTime());
    }
  });

  test('assigns correct tags to entries', () => {
    const timeline = buildUserTimeline(mockJournalEntries, mockMoodEntries, mockGoals);
    
    const breakthroughEntry = timeline.find(item => item.tag === 'breakthrough');
    expect(breakthroughEntry).toBeDefined();
    expect(breakthroughEntry?.sentiment).toBe(0.8);

    const lowEntry = timeline.find(item => item.tag === 'low');
    expect(lowEntry).toBeDefined();
    expect(lowEntry?.sentiment).toBe(-0.6);

    const milestoneEntry = timeline.find(item => item.tag === 'milestone');
    expect(milestoneEntry).toBeDefined();
    expect(milestoneEntry?.goalMentioned).toBe('Complete project');
  });

  test('handles empty input arrays', () => {
    const timeline = buildUserTimeline([], [], []);
    expect(timeline).toHaveLength(0);
  });

  test('includes metadata for each entry', () => {
    const timeline = buildUserTimeline(mockJournalEntries, mockMoodEntries, mockGoals);
    
    timeline.forEach(item => {
      expect(item.metadata).toBeDefined();
      expect(item.metadata.type).toBeDefined();
      expect(item.metadata.sourceId).toBeDefined();
    });
  });

  test('calculates confidence scores correctly', () => {
    const timeline = buildUserTimeline(mockJournalEntries, mockMoodEntries, mockGoals);
    
    const moodEntry = timeline.find(item => item.metadata.type === 'mood');
    expect(moodEntry?.metadata.confidence).toBe(0.8); // 4/5 intensity

    const journalEntry = timeline.find(item => item.metadata.type === 'journal' && item.sentiment);
    expect(journalEntry?.metadata.confidence).toBe(Math.abs(journalEntry?.sentiment || 0));
  });
}); 