// Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  conversationId: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

export interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Conversation Types
export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ConversationsState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, conversation: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
} 