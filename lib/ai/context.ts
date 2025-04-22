import { prisma } from '@/lib/prisma';
import { cache } from '@/lib/cache';
import { z } from 'zod';

const ContextSchema = z.object({
  key: z.string(),
  value: z.string(),
  ttl: z.number().optional(),
});

export type Context = z.infer<typeof ContextSchema>;

export class ContextEngine {
  private static instance: ContextEngine;

  private constructor() {}

  public static getInstance(): ContextEngine {
    if (!ContextEngine.instance) {
      ContextEngine.instance = new ContextEngine();
    }
    return ContextEngine.instance;
  }

  async getContext(key: string): Promise<string | null> {
    try {
      // Try cache first
      const cached = await cache.get<string>(`context:${key}`);
      if (cached) return cached;

      // Fall back to database
      const context = await prisma.aIContext.findUnique({
        where: { key },
      });

      if (context) {
        // Cache the result
        await cache.set(`context:${key}`, context.value);
        return context.value;
      }

      return null;
    } catch (error) {
      console.error('Error getting context:', error);
      return null;
    }
  }

  async setContext(context: Context): Promise<void> {
    try {
      const { key, value, ttl = 3600 } = context;

      // Update database
      await prisma.aIContext.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });

      // Update cache
      await cache.set(`context:${key}`, value, ttl);
    } catch (error) {
      console.error('Error setting context:', error);
      throw error;
    }
  }

  async deleteContext(key: string): Promise<void> {
    try {
      await prisma.aIContext.delete({
        where: { key },
      });
      await cache.delete(`context:${key}`);
    } catch (error) {
      console.error('Error deleting context:', error);
      throw error;
    }
  }

  async buildContext(conversationId: string): Promise<string> {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10, // Last 10 messages for context
          },
        },
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Build context from messages
      const context = conversation.messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n');

      return context;
    } catch (error) {
      console.error('Error building context:', error);
      throw error;
    }
  }
}

export const contextEngine = ContextEngine.getInstance(); 