import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoodIcon } from '../icons/MoodIcon';

export interface JournalTone {
  tone: 'supportive' | 'reflective' | 'encouraging' | 'analytical';
  mood: number; // 1-5 scale
  prompts: string[];
}

interface ToneBasedSuggestionProps {
  tone: JournalTone;
  className?: string;
}

const TONE_STYLES = {
  supportive: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
  },
  reflective: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
  },
  encouraging: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
  },
  analytical: {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    border: 'border-gray-200 dark:border-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
  },
};

export const ToneBasedSuggestion: React.FC<ToneBasedSuggestionProps> = ({
  tone,
  className,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = React.useState(0);
  const styles = TONE_STYLES[tone.tone];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => 
        (prev + 1) % tone.prompts.length
      );
    }, 8000); // Rotate prompts every 8 seconds

    return () => clearInterval(interval);
  }, [tone.prompts.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-4 rounded-lg border',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <MoodIcon
          mood={tone.mood}
          className="w-6 h-6 mt-1"
        />
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentPromptIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={cn('text-sm', styles.text)}
            >
              {tone.prompts[currentPromptIndex]}
            </motion.p>
          </AnimatePresence>
          <div className="flex gap-1 mt-2">
            {tone.prompts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromptIndex(index)}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-opacity',
                  index === currentPromptIndex
                    ? 'opacity-100'
                    : 'opacity-30',
                  styles.bg
                )}
                aria-label={`View prompt ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 