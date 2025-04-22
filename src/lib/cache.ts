interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 3600) { // Default 1 hour TTL
    this.store = new Map();
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.defaultTTL;
    this.store.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl * 1000;
    
    if (isExpired) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl * 1000;
    if (isExpired) {
      this.store.delete(key);
      return false;
    }
    
    return true;
  }
}

export const cache = new Cache();
export default cache; 