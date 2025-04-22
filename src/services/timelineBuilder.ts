import { MoodType, MoodEntry } from './moodAnalysis';
import { logger } from '../utils/logger';

export type ToneType = 'professional' | 'friendly' | 'empathetic' | 'casual';
export type TimelineTag = 'milestone' | 'low' | 'breakthrough';

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: Date;
  summary?: string;
  tone?: ToneType;
  sentiment?: number; // -1 to 1 scale
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'archived';
}

export interface TimelineItem {
  date: string; // ISO date string
  entrySummary?: string;
  mood?: MoodType;
  moodIntensity?: number;
  tone?: ToneType;
  goalMentioned?: string;
  tag?: TimelineTag;
  sentiment?: number;
  metadata: {
    type: 'mood' | 'journal' | 'goal';
    sourceId: string;
    confidence?: number;
  };
}

export const buildUserTimeline = (
  entries: JournalEntry[],
  moodData: MoodEntry[],
  goals: Goal[]
): TimelineItem[] => {
  try {
    // Combine all events into a single array
    const allEvents: TimelineItem[] = [];

    // Process journal entries
    entries.forEach(entry => {
      const item: TimelineItem = {
        date: entry.timestamp.toISOString(),
        entrySummary: entry.summary,
        tone: entry.tone,
        sentiment: entry.sentiment,
        metadata: {
          type: 'journal',
          sourceId: entry.id,
          confidence: entry.sentiment ? Math.abs(entry.sentiment) : undefined
        }
      };

      // Add tag based on sentiment
      if (entry.sentiment !== undefined) {
        if (entry.sentiment < -0.5) {
          item.tag = 'low';
        } else if (entry.sentiment > 0.7) {
          item.tag = 'breakthrough';
        }
      }

      allEvents.push(item);
    });

    // Process mood entries
    moodData.forEach(mood => {
      const item: TimelineItem = {
        date: mood.timestamp.toISOString(),
        mood: mood.mood,
        moodIntensity: mood.intensity,
        metadata: {
          type: 'mood',
          sourceId: mood.timestamp.toISOString(),
          confidence: mood.intensity / 5
        }
      };

      // Add tag based on mood and intensity
      if (mood.mood === 'sad' && mood.intensity >= 4) {
        item.tag = 'low';
      } else if (mood.mood === 'happy' && mood.intensity >= 4) {
        item.tag = 'breakthrough';
      }

      allEvents.push(item);
    });

    // Process goals
    goals.forEach(goal => {
      const item: TimelineItem = {
        date: goal.createdAt.toISOString(),
        goalMentioned: goal.title,
        metadata: {
          type: 'goal',
          sourceId: goal.id
        }
      };

      // Add milestone tag for completed goals
      if (goal.status === 'completed') {
        item.tag = 'milestone';
      }

      allEvents.push(item);
    });

    // Sort all events by date
    return allEvents.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    logger.error('Error building user timeline:', error);
    return [];
  }
};

// Helper function to detect significant events
const detectSignificantEvents = (items: TimelineItem[]): TimelineItem[] => {
  return items.map(item => {
    // Skip if already tagged
    if (item.tag) return item;

    // Detect breakthrough based on sentiment and mood
    if (item.sentiment && item.sentiment > 0.7) {
      item.tag = 'breakthrough';
    } else if (item.mood === 'happy' && item.moodIntensity && item.moodIntensity >= 4) {
      item.tag = 'breakthrough';
    }

    // Detect low points based on sentiment and mood
    if (item.sentiment && item.sentiment < -0.5) {
      item.tag = 'low';
    } else if (item.mood === 'sad' && item.moodIntensity && item.moodIntensity >= 4) {
      item.tag = 'low';
    }

    return item;
  });
}; 