import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ToneBasedSuggestion, JournalTone } from './ToneBasedSuggestion';
import { Textarea } from '../ui/Textarea';

interface JournalEntryScreenProps {
  initialContent?: string;
  tone: JournalTone;
  onContentChange?: (content: string) => void;
  onSave?: () => void;
  className?: string;
}

export const JournalEntryScreen: React.FC<JournalEntryScreenProps> = ({
  initialContent = '',
  tone,
  onContentChange,
  onSave,
  className,
}) => {
  const [content, setContent] = React.useState(initialContent);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange?.(newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSave?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col gap-4', className)}
    >
      <ToneBasedSuggestion
        tone={tone}
        className={cn(
          'transition-opacity duration-300',
          isFocused && 'opacity-50'
        )}
      />
      <Textarea
        value={content}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Start writing..."
        className={cn(
          'min-h-[300px] resize-y',
          'text-lg leading-relaxed',
          'transition-all duration-300',
          isFocused && 'ring-2 ring-blue-500'
        )}
        aria-label="Journal entry"
      />
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          disabled={!content.trim()}
          className={cn(
            'px-4 py-2 rounded-lg',
            'bg-blue-600 text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200'
          )}
        >
          Save Entry
        </motion.button>
      </div>
    </motion.div>
  );
}; 