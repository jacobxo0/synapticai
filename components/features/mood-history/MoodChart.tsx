import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MoodChartProps {
  className?: string;
  data?: Array<{
    date: string;
    value: number;
    note?: string;
  }>;
}

export function MoodChart({ className, data = [] }: MoodChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('rounded-lg bg-card p-4 shadow-sm', className)}
      role="img"
      aria-label="Mood trend chart"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Mood Trends</h3>
        <div className="text-sm text-muted-foreground">
          Last 30 days
        </div>
      </div>
      
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Chart visualization coming soon
      </div>
    </motion.div>
  );
} 