import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Mood = 'happy' | 'thoughtful' | 'focused' | 'neutral'

export const MOOD_CONFIG = {
  happy: {
    label: 'Happy',
    color: 'text-yellow-500',
    icon: '😊'
  },
  thoughtful: {
    label: 'Thoughtful',
    color: 'text-blue-500',
    icon: '🤔'
  },
  focused: {
    label: 'Focused',
    color: 'text-purple-500',
    icon: '🎯'
  },
  neutral: {
    label: 'Neutral',
    color: 'text-gray-500',
    icon: '😐'
  }
}

interface MoodState {
  currentMood: Mood
  setMood: (mood: Mood) => void
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      currentMood: 'neutral',
      setMood: (mood) => set({ currentMood: mood })
    }),
    {
      name: 'synapticai-mood-storage'
    }
  )
) 