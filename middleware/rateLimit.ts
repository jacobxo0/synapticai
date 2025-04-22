import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

// Create rate limiter
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    `${Number(process.env.RATE_LIMIT_WINDOW) || 60}s`
  ),
});

/**
 * Rate limiting middleware for API routes
 * @param req - The incoming request
 * @returns NextResponse or null if rate limit not exceeded
 */
export async function rateLimit(req: Request) {
  try {
    // Get client IP from headers
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    
    // Check rate limit
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    // Add rate limit headers
    const headers = {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    };

    if (!success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: 'Please try again later',
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers,
        }
      );
    }

    return null;
  } catch (error) {
    // Log error but don't block the request
    console.error('Rate limit error:', error);
    return null;
  }
} 