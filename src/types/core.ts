export type Tone = 'casual' | 'analytical' | 'enthusiastic' | 'inquisitive';

export type Mood = 'happy' | 'focused' | 'thoughtful' | 'neutral';

export interface ToneConfig {
  label: string;
  icon: string;
  color: string;
}

export interface MoodConfig {
  label: string;
  icon: string;
  color: string;
}

export interface UserPreferences {
  defaultTone: Tone;
  defaultMood: Mood;
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export type Resource = 
  | 'USER'
  | 'GOAL'
  | 'MOOD'
  | 'CONVERSATION'
  | 'MESSAGE'
  | 'JOURNAL'
  | 'REFLECTION'; 