import { scoreJournalEntry } from '../journalScoring';

describe('Journal Scoring Service', () => {
  const testEntries = [
    {
      text: 'Today was a good day. I felt happy and accomplished.',
      expected: {
        emotionalDepth: 0.3,
        linguisticClarity: 0.8,
        selfReflection: 0.2
      }
    },
    {
      text: 'I\'m struggling with conflicting emotions about my career path. On one hand, I feel passionate about my work, but on the other, I question if it aligns with my deeper values. This tension has been growing, and I need to explore what truly matters to me.',
      expected: {
        emotionalDepth: 0.8,
        linguisticClarity: 0.9,
        selfReflection: 0.9
      }
    },
    {
      text: 'The meeting went well. We discussed the project timeline and next steps.',
      expected: {
        emotionalDepth: 0.1,
        linguisticClarity: 0.7,
        selfReflection: 0.1
      }
    }
  ];

  test.each(testEntries)('scores journal entry: %#', async ({ text, expected }) => {
    const scores = await scoreJournalEntry(text);
    
    // Test score ranges
    expect(scores.emotionalDepth).toBeGreaterThanOrEqual(0);
    expect(scores.emotionalDepth).toBeLessThanOrEqual(1);
    expect(scores.linguisticClarity).toBeGreaterThanOrEqual(0);
    expect(scores.linguisticClarity).toBeLessThanOrEqual(1);
    expect(scores.selfReflection).toBeGreaterThanOrEqual(0);
    expect(scores.selfReflection).toBeLessThanOrEqual(1);
    
    // Test relative scoring (within 0.2 of expected)
    expect(Math.abs(scores.emotionalDepth - expected.emotionalDepth)).toBeLessThan(0.2);
    expect(Math.abs(scores.linguisticClarity - expected.linguisticClarity)).toBeLessThan(0.2);
    expect(Math.abs(scores.selfReflection - expected.selfReflection)).toBeLessThan(0.2);
  });

  test('handles empty entry', async () => {
    const scores = await scoreJournalEntry('');
    expect(scores).toEqual({
      emotionalDepth: 0,
      linguisticClarity: 0,
      selfReflection: 0
    });
  });

  test('handles very long entry', async () => {
    const longText = 'Test. '.repeat(1000);
    const scores = await scoreJournalEntry(longText);
    
    expect(scores.emotionalDepth).toBeGreaterThanOrEqual(0);
    expect(scores.emotionalDepth).toBeLessThanOrEqual(1);
    expect(scores.linguisticClarity).toBeGreaterThanOrEqual(0);
    expect(scores.linguisticClarity).toBeLessThanOrEqual(1);
    expect(scores.selfReflection).toBeGreaterThanOrEqual(0);
    expect(scores.selfReflection).toBeLessThanOrEqual(1);
  });

  test('handles error gracefully', async () => {
    // Mock OpenAI to throw error
    jest.spyOn(require('../openai'), 'openai').mockImplementation(() => {
      throw new Error('API Error');
    });

    const scores = await scoreJournalEntry('Test entry');
    expect(scores).toEqual({
      emotionalDepth: 0,
      linguisticClarity: 0,
      selfReflection: 0
    });
  });
}); 