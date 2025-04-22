import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Tone = 'casual' | 'analytical' | 'enthusiastic' | 'inquisitive';

export const TONE_CONFIG = {
  casual: {
    label: 'Casual',
    color: 'text-green-500',
    icon: '💬'
  },
  analytical: {
    label: 'Analytical',
    color: 'text-blue-500',
    icon: '📊'
  },
  enthusiastic: {
    label: 'Enthusiastic',
    color: 'text-yellow-500',
    icon: '✨'
  },
  inquisitive: {
    label: 'Inquisitive',
    color: 'text-purple-500',
    icon: '❓'
  }
};

interface ToneState {
  currentTone: Tone;
  setTone: (tone: Tone) => void;
}

export const useToneStore = create<ToneState>()(
  persist(
    (set) => ({
      currentTone: 'casual',
      setTone: (tone) => set({ currentTone: tone }),
    }),
    {
      name: 'synapticai-tone-storage',
    }
  )
); 