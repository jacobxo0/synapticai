import { Conversation, Message, User } from '@prisma/client';

export type MemoryType = 'short_term' | 'long_term' | 'episodic' | 'semantic';

export interface Memory {
  id: string;
  userId: string;
  type: MemoryType;
  content: string;
  tags: string[];
  priority: number;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  conversationId?: string;
  messageId?: string;
  metadata?: Record<string, any>;
}

export interface MemoryStore {
  memories: Memory[];
  addMemory(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memory>;
  getMemories(userId: string, options?: MemoryQueryOptions): Promise<Memory[]>;
  updateMemory(id: string, updates: Partial<Memory>): Promise<Memory>;
  deleteMemory(id: string): Promise<void>;
  cleanup(): Promise<void>;
}

export interface MemoryQueryOptions {
  type?: MemoryType;
  tags?: string[];
  minPriority?: number;
  minWeight?: number;
  limit?: number;
  includeExpired?: boolean;
}

export interface ContextBuilder {
  buildContext(userId: string, scope: ContextScope): Promise<string>;
}

export type ContextScope = 'conversation' | 'session' | 'long_term' | 'custom';

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  defaultValues?: Record<string, any>;
  metadata?: Record<string, any>;
} 