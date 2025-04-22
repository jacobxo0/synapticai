import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreakTrackerProps {
  className?: string;
  currentStreak?: number;
  longestStreak?: number;
  lastEntryDate?: string;
}

export function StreakTracker({
  className,
  currentStreak = 0,
  longestStreak = 0,
  lastEntryDate,
}: StreakTrackerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('rounded-lg bg-card p-4 shadow-sm', className)}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Journaling Streak</h3>
          <div className="text-sm text-muted-foreground">
            {lastEntryDate
              ? `Last entry: ${new Date(lastEntryDate).toLocaleDateString()}`
              : 'No entries yet'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </div>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStreak / Math.max(longestStreak, 7)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
} 