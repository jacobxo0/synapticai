import { createClient } from 'redis';
import { promisify } from 'util';

interface CacheConfig {
  url: string;
  password?: string;
  tls?: boolean;
  ttl?: number;
}

class Cache {
  private client: any;
  private memoryCache: Map<string, { value: any; expiry: number }>;
  private ttl: number;
  private isRedisConnected: boolean;

  constructor(config: CacheConfig) {
    this.memoryCache = new Map();
    this.ttl = config.ttl || 3600;
    this.isRedisConnected = false;

    try {
      this.client = createClient({
        url: config.url,
        password: config.password,
        socket: {
          tls: config.tls,
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              return new Error('Max reconnection attempts reached');
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      this.client.on('error', (err: Error) => {
        console.error('Redis Client Error:', err);
        this.isRedisConnected = false;
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.isRedisConnected = true;
      });

      this.client.connect();
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      this.isRedisConnected = false;
    }
  }

  async get(key: string): Promise<any> {
    if (this.isRedisConnected) {
      try {
        const value = await this.client.get(key);
        if (value) {
          return JSON.parse(value);
        }
      } catch (error) {
        console.error('Redis get error:', error);
      }
    }

    // Fallback to memory cache
    const cached = this.memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }
    return null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const expiry = Date.now() + (ttl || this.ttl) * 1000;
    const serializedValue = JSON.stringify(value);

    if (this.isRedisConnected) {
      try {
        await this.client.set(key, serializedValue, {
          EX: ttl || this.ttl,
        });
      } catch (error) {
        console.error('Redis set error:', error);
      }
    }

    // Always update memory cache as fallback
    this.memoryCache.set(key, { value, expiry });
  }

  async delete(key: string): Promise<void> {
    if (this.isRedisConnected) {
      try {
        await this.client.del(key);
      } catch (error) {
        console.error('Redis delete error:', error);
      }
    }
    this.memoryCache.delete(key);
  }

  async clear(): Promise<void> {
    if (this.isRedisConnected) {
      try {
        await this.client.flushAll();
      } catch (error) {
        console.error('Redis clear error:', error);
      }
    }
    this.memoryCache.clear();
  }
}

// Create singleton instance
const cache = new Cache({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true',
  ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
});

export default cache; 