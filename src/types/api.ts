import { Tone, Mood } from './core';

export interface MessageResponse {
  id: string;
  content: string;
  role: string;
  createdAt: string;
  conversationId: string;
  userId: string;
}

export interface ConversationResponse {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: MessageResponse[];
}

export interface UserResponse {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isOnboarded: boolean;
  preferences: {
    tone: Tone;
    mood: Mood;
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
} 