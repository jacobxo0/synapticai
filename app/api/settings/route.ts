import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/errors';
import { z } from 'zod';
import { validateRequest } from '@/lib/errors';

const settingsSchema = z.object({
  userId: z.string().min(1),
  theme: z.enum(['light', 'dark']).optional(),
  notifications: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      throw new AppError(400, 'UserId is required', 'MISSING_USER_ID');
    }

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId,
          theme: 'light',
          notifications: true,
        },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updates = await validateRequest(settingsSchema, body);

    const settings = await prisma.userSettings.upsert({
      where: { userId: updates.userId },
      update: {
        theme: updates.theme,
        notifications: updates.notifications,
      },
      create: {
        userId: updates.userId,
        theme: updates.theme || 'light',
        notifications: updates.notifications ?? true,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return handleError(error);
  }
} 