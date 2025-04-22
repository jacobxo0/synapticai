import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { contextEngine } from '@/lib/ai/context';
import { handleError, validateRequest, APIError } from '@/lib/errors';
import { cache } from '@/lib/cache';

const aiRequestSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

type AiRequest = z.infer<typeof aiRequestSchema>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, message } = await validateRequest<AiRequest>(aiRequestSchema, body);

    // Get conversation context
    const context = await contextEngine.getContext(
      `conversation:${conversationId}`,
      'short_term'
    );
    
    // Check cache for similar prompts
    const cacheKey = `ai:${conversationId}:${message}`;
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse) {
      return NextResponse.json({ response: cachedResponse });
    }

    // Process message with AI
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet',
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        context,
      }),
    });

    if (!response.ok) {
      throw new APIError(
        'Failed to get AI response',
        response.status,
        'AI_SERVICE_ERROR'
      );
    }

    const data = await response.json();
    
    // Cache the response
    cache.set(cacheKey, data.response, { ttl: 3600 });

    return NextResponse.json({ response: data.response });
  } catch (error) {
    return handleError(error);
  }
} 