import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const [todos, goals, latestMood] = await Promise.all([
    prisma.todo.findMany({
      where: { userId: session.user.id },
    }),
    prisma.goal.findMany({
      where: {
        userId: session.user.id,
      },
    }),
    prisma.moodLog.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return NextResponse.json({
    todos,
    goals,
    latestMood,
  });
} 