import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, validateRequest, APIError } from '@/lib/errors';
import { z } from 'zod';

const moodLevels = {
  VERY_LOW: -2,
  LOW: -1,
  NEUTRAL: 0,
  HIGH: 1,
  VERY_HIGH: 2,
} as const;

const moodLogSchema = z.object({
  mood: z.enum(['VERY_LOW', 'LOW', 'NEUTRAL', 'HIGH', 'VERY_HIGH']),
  notes: z.string().optional(),
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await validateRequest(moodLogSchema, body);

    const moodLog = await prisma.moodLog.create({
      data: {
        ...data,
        mood: moodLevels[data.mood],
      },
    });

    return NextResponse.json(moodLog);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      throw new APIError('UserId is required', 400, 'MISSING_USER_ID');
    }

    const where = {
      userId,
      ...(startDate && endDate
        ? {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {}),
    };

    const moodLogs = await prisma.moodLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Convert mood numbers back to enum values
    const moodLogsWithLevels = moodLogs.map(log => ({
      ...log,
      level: Object.entries(moodLevels).find(([_, value]) => value === log.mood)?.[0] || 'NEUTRAL',
    }));

    return NextResponse.json(moodLogsWithLevels);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      throw new APIError('Id and userId are required', 400, 'MISSING_PARAMS');
    }

    const moodLog = await prisma.moodLog.findUnique({
      where: { id },
    });

    if (!moodLog) {
      throw new APIError('Mood log not found', 404, 'NOT_FOUND');
    }

    if (moodLog.userId !== userId) {
      throw new APIError('Not authorized', 403, 'UNAUTHORIZED');
    }

    await prisma.moodLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
} 