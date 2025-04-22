import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoodIcon } from './icons/MoodIcon';

export interface MoodPattern {
  period: string;
  mood: number; // 1-5 scale
  volatility: number; // 0-1 scale
  trend: 'up' | 'down' | 'stable';
}

interface MoodTimelineChartProps {
  data: MoodPattern[];
  className?: string;
  ariaLabel?: string;
}

const MOOD_COLORS = {
  1: '#FF6B6B', // Sad
  2: '#FFB347', // Down
  3: '#A8D5BA', // Neutral
  4: '#4ECDC4', // Good
  5: '#45B7D1', // Great
} as const;

const MOOD_LABELS = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Great',
} as const;

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: Array<{
    payload: MoodPattern;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        role="tooltip"
        aria-label={`Mood data for ${label}`}
      >
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <MoodIcon mood={data.mood} className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {MOOD_LABELS[data.mood as keyof typeof MOOD_LABELS]}
          </span>
        </div>
        {data.volatility > 0.3 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Volatility: {Math.round(data.volatility * 100)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const MoodTimelineChart: React.FC<MoodTimelineChartProps> = ({
  data,
  className,
  ariaLabel = 'Mood timeline chart',
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className={cn('flex items-center justify-center h-64', className)}
        role="status"
        aria-label="No mood data available"
      >
        <div className="text-center">
          <MoodIcon mood={3} className="w-12 h-12 mx-auto mb-2 opacity-50" aria-hidden="true" />
          <p className="text-gray-500 dark:text-gray-400">
            No mood data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn('h-64 w-full', className)}
      role="img"
      aria-label={ariaLabel}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          aria-label="Mood data visualization"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            strokeOpacity={0.3}
          />
          <XAxis
            dataKey="period"
            tick={{ fill: '#6B7280' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            domain={[1, 5]}
            tickCount={5}
            tick={{ fill: '#6B7280' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#4B5563"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => (
              <MoodIcon
                mood={payload.mood}
                className="w-4 h-4"
                style={{
                  position: 'absolute',
                  left: cx - 8,
                  top: cy - 8,
                }}
                aria-hidden="true"
              />
            )}
            activeDot={({ cx, cy, payload }) => (
              <MoodIcon
                mood={payload.mood}
                className="w-6 h-6"
                style={{
                  position: 'absolute',
                  left: cx - 12,
                  top: cy - 12,
                }}
                aria-hidden="true"
              />
            )}
          />
          <ReferenceLine
            y={3}
            stroke="#E5E7EB"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}; 