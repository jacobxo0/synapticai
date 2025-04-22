import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
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
        status: { not: 'COMPLETED' }
      },
    }),
    prisma.moodLog.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({
    todoCount: todos.length,
    completedTodoCount: todos.filter(todo => todo.completed).length,
    activeGoals: goals.length,
    latestMood: latestMood ? {
      mood: latestMood.mood,
      note: latestMood.note,
    } : undefined,
  });
} 