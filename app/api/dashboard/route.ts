import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
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