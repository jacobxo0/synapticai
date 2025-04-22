import { ApiError } from '../types/errors'

interface ApiClientConfig {
  baseUrl: string
  headers?: Record<string, string>
  cache?: boolean
  retries?: number
  cacheTTL?: number // in milliseconds
}

interface CacheEntry {
  data: any
  timestamp: number
}

export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>
  private cache: Map<string, CacheEntry>
  private maxRetries: number
  private cacheTTL: number

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    }
    this.cache = new Map()
    this.maxRetries = config.retries || 3
    this.cacheTTL = config.cacheTTL || 5 * 60 * 1000 // 5 minutes default
  }

  private async request(
    path: string,
    options: RequestInit,
    retryCount = 0
  ): Promise<any> {
    const url = `${this.baseUrl}${path}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.headers
      })

      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(data.message || 'API request failed', response.status)
      }

      return data
    } catch (error) {
      if (retryCount < this.maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, retryCount) * 100
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.request(path, options, retryCount + 1)
      }
      throw error
    }
  }

  private getCacheKey(path: string, options: RequestInit): string {
    return `${options.method}:${path}`
  }

  private isCacheValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.cacheTTL
  }

  async get<T>(path: string): Promise<T> {
    const cacheKey = this.getCacheKey(path, { method: 'GET' })
    const cached = this.cache.get(cacheKey)

    if (cached && this.isCacheValid(cached)) {
      return cached.data
    }

    const data = await this.request(path, { method: 'GET' })
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    return data
  }

  async post<T>(path: string, body: any): Promise<T> {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  async put<T>(path: string, body: any): Promise<T> {
    return this.request(path, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
  }

  async delete(path: string): Promise<void> {
    return this.request(path, { method: 'DELETE' })
  }

  clearCache(): void {
    this.cache.clear()
  }
} 