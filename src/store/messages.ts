import { create } from 'zustand';
import { MessageResponse } from '@/types/api';

interface MessagesState {
  messages: MessageResponse[];
  loading: boolean;
  error: Error | null;
  setMessages: (messages: MessageResponse[]) => void;
  addMessage: (message: MessageResponse) => void;
  updateMessage: (message: MessageResponse) => void;
  deleteMessage: (messageId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: [],
  loading: false,
  error: null,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (message) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === message.id ? message : m)),
    })),
  deleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== messageId),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 