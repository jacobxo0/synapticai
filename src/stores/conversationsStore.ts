import { create } from 'zustand';
import { ConversationsState, Conversation } from '@/types/stores';

export const useConversationsStore = create<ConversationsState>()((set) => ({
  conversations: [],
  selectedConversation: null,
  isLoading: false,
  error: null,
  setConversations: (conversations: Conversation[]) => set({ conversations, error: null }),
  addConversation: (conversation: Conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
      error: null,
    })),
  updateConversation: (id: string, conversation: Partial<Conversation>) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...conversation } : c
      ),
      selectedConversation:
        state.selectedConversation?.id === id
          ? { ...state.selectedConversation, ...conversation }
          : state.selectedConversation,
      error: null,
    })),
  deleteConversation: (id: string) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      selectedConversation:
        state.selectedConversation?.id === id
          ? null
          : state.selectedConversation,
      error: null,
    })),
  setSelectedConversation: (conversation: Conversation | null) =>
    set({ selectedConversation: conversation, error: null }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
})); 