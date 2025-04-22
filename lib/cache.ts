import { Redis } from '@upstash/redis';
import { kv } from '@vercel/kv';

// Memory cache fallback
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export class Cache {
  private redis: Redis | null = null;
  private static instance: Cache;

  private constructor() {
    try {
      this.redis = new Redis({
        url: process.env.REDIS_URL!,
        token: process.env.REDIS_TOKEN!,
      });
    } catch (error) {
      console.warn('Redis connection failed, falling back to memory cache');
    }
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.redis) {
        const value = await this.redis.get<T>(key);
        return value;
      }

      const cached = memoryCache.get(key);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.value as T;
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.set(key, value, { ex: ttlSeconds });
      } else {
        memoryCache.set(key, {
          value,
          expiresAt: Date.now() + ttlSeconds * 1000,
        });
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.del(key);
      } else {
        memoryCache.delete(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
}

export const cache = Cache.getInstance(); 