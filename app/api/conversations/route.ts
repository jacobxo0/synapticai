import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, validateRequest, APIError } from '@/lib/errors';
import { z } from 'zod';

const conversationSchema = z.object({
  title: z.string().min(1).max(100),
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await validateRequest(conversationSchema, body);

    const conversation = await prisma.conversation.create({
      data,
    });

    return NextResponse.json(conversation);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      throw new APIError('UserId is required', 400, 'MISSING_USER_ID');
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    return handleError(error);
  }
} 