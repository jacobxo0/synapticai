import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError, validateRequest, APIError } from '@/lib/errors';
import { z } from 'zod';

const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED']).optional(),
  dueDate: z.string().datetime().optional(),
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await validateRequest(goalSchema, body);

    const goal = await prisma.goal.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
      throw new APIError('UserId is required', 400, 'MISSING_USER_ID');
    }

    const where = {
      userId,
      ...(status ? { status } : {}),
    };

    const goals = await prisma.goal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(goals);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      throw new APIError('Id and userId are required', 400, 'MISSING_PARAMS');
    }

    const body = await req.json();
    const updates = await validateRequest(goalSchema.partial(), body);

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new APIError('Goal not found', 404, 'NOT_FOUND');
    }

    if (goal.userId !== userId) {
      throw new APIError('Not authorized', 403, 'UNAUTHORIZED');
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
      },
    });

    return NextResponse.json(updatedGoal);
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

    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new APIError('Goal not found', 404, 'NOT_FOUND');
    }

    if (goal.userId !== userId) {
      throw new APIError('Not authorized', 403, 'UNAUTHORIZED');
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
} 