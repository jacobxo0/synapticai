import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useMood } from '@/hooks/useMood';

const MOOD_EMOJIS = [
  { emoji: '😊', label: 'Happy', value: 5 },
  { emoji: '🙂', label: 'Content', value: 4 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🙁', label: 'Sad', value: 2 },
  { emoji: '😢', label: 'Very Sad', value: 1 },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const { moodHistory, isLoading, error, addMood } = useMood();

  const handleMoodSubmit = async () => {
    if (selectedMood === null) return;

    try {
      await addMood(selectedMood, note);
      setSelectedMood(null);
      setNote('');
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  if (error) {
    return (
      <div className="text-center p-4 text-destructive">
        <p>Failed to load mood data. Please try again later.</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">How are you feeling today?</h2>
        
        <div className="flex justify-center space-x-4">
          {MOOD_EMOJIS.map((mood) => (
            <motion.button
              key={mood.value}
              className={cn(
                'text-4xl p-2 rounded-full transition-colors',
                selectedMood === mood.value
                  ? 'bg-primary/20 ring-2 ring-primary'
                  : 'hover:bg-muted'
              )}
              onClick={() => setSelectedMood(mood.value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Select ${mood.label} mood`}
            >
              {mood.emoji}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selectedMood !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <TextInput
                label="What's affecting your mood?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share what's on your mind..."
                className="w-full"
              />
              <Button
                onClick={handleMoodSubmit}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Saving...' : 'Save Mood'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {moodHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Mood History</h3>
          <div className="space-y-3">
            {moodHistory.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-4 p-4 rounded-lg bg-card"
              >
                <span className="text-3xl">{entry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {entry.note && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 