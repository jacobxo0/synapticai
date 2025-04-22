'use client';

import { useState } from 'react';
import MoodTimelineChart from '../components/MoodTimelineChart';
import ReflectionFeedbackWidget from '../components/ReflectionFeedbackWidget';
import AdaptiveResponsePreview from '../components/AdaptiveResponsePreview';
import ToneSelectorPreview from '../components/ToneSelectorPreview';
import { useGoalSuggestions } from '../hooks/useGoalSuggestions';

const mockMoodData = [
  { period: 'Mon', mood: 3, volatility: 0.2, trend: 'stable' as const },
  { period: 'Tue', mood: 4, volatility: 0.1, trend: 'up' as const },
  { period: 'Wed', mood: 4, volatility: 0.3, trend: 'stable' as const },
  { period: 'Thu', mood: 2, volatility: 0.4, trend: 'down' as const },
  { period: 'Fri', mood: 3, volatility: 0.2, trend: 'up' as const },
  { period: 'Sat', mood: 5, volatility: 0.1, trend: 'up' as const },
  { period: 'Sun', mood: 4, volatility: 0.2, trend: 'down' as const },
];

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const { suggestions, loading, error } = useGoalSuggestions();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-2">
        Welcome to SynapticAI <span role="img" aria-label="brain">🧠</span>
      </h1>

      {/* Mood Input Section */}
      <section className="mb-12">
        <h2 className="text-2xl mb-4">How are you feeling today?</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 p-3 border rounded-lg"
            placeholder="Share your thoughts..."
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Reflect
          </button>
        </div>
      </section>

      {/* Mood Timeline */}
      <section className="mb-12">
        <h2 className="text-2xl mb-4">Your Mood Timeline</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <MoodTimelineChart data={mockMoodData} />
        </div>
      </section>

      {/* Reflection Feedback */}
      <section className="mb-12">
        <h2 className="text-2xl mb-4">Reflection Insights</h2>
        <ReflectionFeedbackWidget />
      </section>

      {/* AI Response Preview */}
      <section className="mb-12">
        <h2 className="text-2xl mb-4">AI Response Style</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdaptiveResponsePreview />
          <ToneSelectorPreview />
        </div>
      </section>

      {/* Goals Section */}
      <section className="mb-12">
        <h2 className="text-2xl mb-4">Your Goals</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {loading ? (
            <p>Loading suggestions...</p>
          ) : error ? (
            <p className="text-red-600">Error loading suggestions: {error}</p>
          ) : (
            <ul className="space-y-4">
              {suggestions?.map((suggestion, index) => (
                <li key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  {suggestion.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
} 