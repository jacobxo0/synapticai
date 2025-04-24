import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { exportData } from '@/lib/export-service';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const result = await exportData(userId);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const exportId = searchParams.get('exportId');
    const userId = session.user.id;

    if (exportId) {
      const status = await boltApi.getExportStatus(userId, exportId);
      return NextResponse.json(status);
    } else {
      const history = await boltApi.getExportHistory(userId);
      return NextResponse.json(history);
    }
  } catch (error) {
    console.error('Export status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 