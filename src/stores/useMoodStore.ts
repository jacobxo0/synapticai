import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Mood = 'happy' | 'thoughtful' | 'neutral' | 'focused'

export const MOOD_CONFIG = {
  happy: {
    label: 'Happy',
    icon: '😊',
    color: 'text-green-500',
  },
  thoughtful: {
    label: 'Thoughtful',
    icon: '🤔',
    color: 'text-blue-500',
  },
  neutral: {
    label: 'Neutral',
    icon: '😐',
    color: 'text-gray-500',
  },
  focused: {
    label: 'Focused',
    icon: '🎯',
    color: 'text-purple-500',
  },
}

interface MoodState {
  currentMood: Mood;
  setMood: (mood: Mood) => void;
}

export const useMoodStore = create<MoodState>((set) => ({
  currentMood: 'neutral',
  setMood: (mood) => set({ currentMood: mood }),
})); 