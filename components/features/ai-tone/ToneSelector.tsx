import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const TONE_OPTIONS = [
  {
    id: 'professional',
    label: 'Professional',
    description: 'Clinical and precise language',
  },
  {
    id: 'friendly',
    label: 'Friendly',
    description: 'Warm and conversational tone',
  },
  {
    id: 'supportive',
    label: 'Supportive',
    description: 'Empathetic and encouraging',
  },
  {
    id: 'direct',
    label: 'Direct',
    description: 'Clear and straightforward',
  },
];

interface ToneSelectorProps {
  className?: string;
  currentTone?: string;
  onToneChange?: (toneId: string) => void;
}

export function ToneSelector({
  className,
  currentTone = 'friendly',
  onToneChange,
}: ToneSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('rounded-lg bg-card p-4 shadow-sm', className)}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">AI Tone Preference</h3>
          <p className="text-sm text-muted-foreground">
            Choose how Claude communicates with you
          </p>
        </div>

        <div className="grid gap-2">
          {TONE_OPTIONS.map((tone) => (
            <motion.button
              key={tone.id}
              className={cn(
                'flex flex-col items-start p-3 rounded-lg border transition-colors',
                currentTone === tone.id
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:bg-muted/50'
              )}
              onClick={() => onToneChange?.(tone.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="font-medium">{tone.label}</div>
              <div className="text-sm text-muted-foreground">
                {tone.description}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Preview tone change
            }}
          >
            Preview Tone
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 