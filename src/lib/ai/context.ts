import { z } from 'zod';
import { cache } from '../cache';

export const AIContextSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  tone: z.enum(['professional', 'friendly', 'empathetic', 'direct']).optional(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string()
  })).optional(),
  preferences: z.object({
    language: z.string().optional(),
    responseLength: z.enum(['concise', 'detailed']).optional(),
    includeExamples: z.boolean().optional()
  }).optional()
});

export type AIContext = z.infer<typeof AIContextSchema>;

export const contextEngine = {
  async getContext(userId: string, sessionId: string): Promise<AIContext> {
    const cacheKey = `context:${userId}:${sessionId}`;
    const cachedContext = cache.get<AIContext>(cacheKey);
    
    if (cachedContext) {
      return cachedContext;
    }

    const context = createContext(userId, sessionId);
    cache.set(cacheKey, context);
    return context;
  },

  async updateContext(userId: string, sessionId: string, updates: Partial<AIContext>): Promise<AIContext> {
    const cacheKey = `context:${userId}:${sessionId}`;
    const currentContext = await this.getContext(userId, sessionId);
    
    const updatedContext = {
      ...currentContext,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    cache.set(cacheKey, updatedContext);
    return updatedContext;
  },

  async clearContext(userId: string, sessionId: string): Promise<void> {
    const cacheKey = `context:${userId}:${sessionId}`;
    cache.delete(cacheKey);
  }
};

export const createContext = (userId: string, sessionId: string, options?: Partial<AIContext>): AIContext => {
  return {
    userId,
    sessionId,
    tone: options?.tone || 'professional',
    history: options?.history || [],
    preferences: options?.preferences || {
      language: 'en',
      responseLength: 'concise',
      includeExamples: true
    }
  };
};

export const validateContext = (context: unknown): AIContext => {
  return AIContextSchema.parse(context);
}; 