import { create } from 'zustand';
import { UserResponse } from '@/types/api';

interface UserState {
  user: UserResponse | null;
  loading: boolean;
  error: Error | null;
  setUser: (user: UserResponse | null) => void;
  updateUser: (user: Partial<UserResponse>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 