import { useState, useCallback } from 'react';
import { useGoalsStore } from '@/stores/goalsStore';
import { Goal, GoalPriority } from '@/components/goals/GoalDashboard';

interface GoalSuggestion {
  title: string;
  description: string;
  tone: string;
}

interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

interface GoalSuggestionsHook {
  suggestions: GoalSuggestion[];
  isLoading: boolean;
  error: ApiError | null;
  fetchSuggestions: (context: string) => Promise<void>;
  addSuggestion: (suggestion: GoalSuggestion) => void;
  clearSuggestions: () => void;
}

const DEFAULT_GOAL_PRIORITY: GoalPriority = 'medium';
const DEFAULT_GOAL_DUE_DAYS = 7;

export const useGoalSuggestions = (): GoalSuggestionsHook => {
  const [suggestions, setSuggestions] = useState<GoalSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const addGoal = useGoalsStore((state) => state.addGoal);

  const fetchSuggestions = useCallback(async (context: string): Promise<void> => {
    if (!context.trim()) {
      setError({ message: 'Context cannot be empty' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/claude/suggest-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data?.suggestions)) {
        throw new Error('Invalid response format');
      }

      setSuggestions(data.suggestions);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        details: err,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSuggestion = useCallback((suggestion: GoalSuggestion): void => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + DEFAULT_GOAL_DUE_DAYS);

    addGoal({
      title: suggestion.title,
      description: suggestion.description,
      tone: suggestion.tone,
      priority: DEFAULT_GOAL_PRIORITY,
      dueDate: dueDate.toISOString(),
    });

    setSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
  }, [addGoal]);

  const clearSuggestions = useCallback((): void => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    addSuggestion,
    clearSuggestions,
  };
}; 