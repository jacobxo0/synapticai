import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToneSelectorPreview } from '../components/ToneSelectorPreview';
import { AdaptiveResponsePreview } from '../components/AdaptiveResponsePreview';
import { useToneStore } from '../stores/useToneStore';
import { trackEvent } from '../utils/analytics';

interface JournalEntry {
  content: string;
  mood: number;
  timestamp: string;
}

export default function JournalPage() {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState(5);
  const [submittedEntry, setSubmittedEntry] = useState<JournalEntry | null>(null);
  const { currentTone } = useToneStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: JournalEntry = {
      content: entry,
      mood,
      timestamp: new Date().toISOString(),
    };
    setSubmittedEntry(newEntry);
    trackEvent('journal.entry.submitted', { mood, tone: currentTone });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <ToneSelectorPreview />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling today?
            </label>
            <input
              type="range"
              id="mood"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <label htmlFor="entry" className="block text-sm font-medium text-gray-700 mb-2">
              Your Journal Entry
            </label>
            <textarea
              id="entry"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your thoughts here..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Entry
          </button>
        </form>

        <AnimatePresence>
          {submittedEntry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="text-sm text-gray-600 mb-4">
                This is how Claude may begin responding to your entry
              </div>
              <AdaptiveResponsePreview
                mood={submittedEntry.mood}
                entry={submittedEntry.content}
                onRefresh={() => trackEvent('reflection.preview.rendered')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 