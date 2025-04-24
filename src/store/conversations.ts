import { create } from 'zustand';
import { ConversationResponse } from '@/types/api';

interface ConversationsState {
  conversations: ConversationResponse[];
  loading: boolean;
  error: Error | null;
  setConversations: (conversations: ConversationResponse[]) => void;
  addConversation: (conversation: ConversationResponse) => void;
  updateConversation: (conversation: ConversationResponse) => void;
  deleteConversation: (conversationId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  conversations: [],
  loading: false,
  error: null,
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),
  updateConversation: (conversation) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversation.id ? conversation : c
      ),
    })),
  deleteConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 