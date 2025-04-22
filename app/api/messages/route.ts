import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, validateRequest, APIError } from '@/lib/errors';
import { z } from 'zod';
import { contextEngine } from '@/lib/ai/context';

const messageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  conversationId: z.string().min(1),
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await validateRequest(messageSchema, body);

    const message = await prisma.message.create({
      data,
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { updatedAt: new Date() },
    });

    // If this is a user message, get context for AI response
    if (data.role === 'user') {
      const context = await contextEngine.getContext(data.userId, data.conversationId);
      await contextEngine.updateContext(data.userId, data.conversationId, {
        history: [
          ...(context.history || []),
          {
            role: data.role,
            content: data.content,
            timestamp: new Date().toISOString(),
          },
        ],
      });
    }

    return NextResponse.json(message);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      throw new APIError('ConversationId is required', 400, 'MISSING_CONVERSATION_ID');
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return handleError(error);
  }
} 