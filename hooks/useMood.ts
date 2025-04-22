import { useState, useEffect } from 'react';

interface MoodEntry {
  id: string;
  emoji: string;
  value: number;
  note?: string;
  timestamp: string;
}

interface UseMoodReturn {
  moodHistory: MoodEntry[];
  isLoading: boolean;
  error: Error | null;
  addMood: (moodValue: number, note?: string) => Promise<void>;
  fetchMoodHistory: () => Promise<void>;
}

export function useMood(): UseMoodReturn {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMoodHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mood');
      if (!response.ok) throw new Error('Failed to fetch mood history');
      const data = await response.json();
      setMoodHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const addMood = async (moodValue: number, note?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moodValue, note }),
      });

      if (!response.ok) throw new Error('Failed to save mood');

      const newEntry = await response.json();
      setMoodHistory(prev => [newEntry, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  return {
    moodHistory,
    isLoading,
    error,
    addMood,
    fetchMoodHistory,
  };
} 