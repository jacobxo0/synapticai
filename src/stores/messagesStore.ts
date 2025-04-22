import { create } from 'zustand';
import { MessagesState, Message } from '@/types/stores';

export const useMessagesStore = create<MessagesState>()((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  setMessages: (messages: Message[]) => set({ messages, error: null }),
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
      error: null,
    })),
  updateMessage: (id: string, message: Partial<Message>) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...message } : m
      ),
      error: null,
    })),
  deleteMessage: (id: string) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
      error: null,
    })),
  clearMessages: () => set({ messages: [], error: null }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
})); 