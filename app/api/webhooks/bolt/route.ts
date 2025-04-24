import { NextResponse } from 'next/server';
import { syncBoltData } from '@/lib/sync-service';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-bolt-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const payload = await request.json();
    const result = await syncBoltData(payload);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 