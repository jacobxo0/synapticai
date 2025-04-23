import { create } from 'zustand';

export type Tone = 'casual' | 'analytical' | 'enthusiastic' | 'inquisitive';

export const TONE_CONFIG = {
  casual: {
    label: 'Casual',
    icon: '😊',
    color: 'text-blue-500',
  },
  analytical: {
    label: 'Analytical',
    icon: '🔍',
    color: 'text-purple-500',
  },
  enthusiastic: {
    label: 'Enthusiastic',
    icon: '🎉',
    color: 'text-yellow-500',
  },
  inquisitive: {
    label: 'Inquisitive',
    icon: '❓',
    color: 'text-green-500',
  },
};

interface ToneState {
  currentTone: Tone;
  setTone: (tone: Tone) => void;
}

export const useToneStore = create<ToneState>((set) => ({
  currentTone: 'casual',
  setTone: (tone) => set({ currentTone: tone }),
})); 