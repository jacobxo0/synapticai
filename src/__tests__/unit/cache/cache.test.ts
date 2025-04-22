import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCache, Cache } from '@/lib/cache'

describe('Cache', () => {
  let cache: Cache<string, any>
  const mockData = { id: '1', value: 'test' }

  beforeEach(() => {
    cache = createCache<string, any>({
      maxSize: 2,
      ttl: 1000, // 1 second
    })
  })

  it('stores and retrieves data correctly', () => {
    cache.set('key1', mockData)
    expect(cache.get('key1')).toEqual(mockData)
  })

  it('returns undefined for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeUndefined()
  })

  it('respects maxSize limit', () => {
    cache.set('key1', mockData)
    cache.set('key2', { ...mockData, id: '2' })
    cache.set('key3', { ...mockData, id: '3' }) // Should evict key1

    expect(cache.get('key1')).toBeUndefined()
    expect(cache.get('key2')).toBeDefined()
    expect(cache.get('key3')).toBeDefined()
  })

  it('respects TTL', async () => {
    cache.set('key1', mockData)
    expect(cache.get('key1')).toEqual(mockData)

    await new Promise(resolve => setTimeout(resolve, 1100)) // Wait for TTL to expire
    expect(cache.get('key1')).toBeUndefined()
  })

  it('clears cache correctly', () => {
    cache.set('key1', mockData)
    cache.set('key2', { ...mockData, id: '2' })

    cache.clear()
    expect(cache.get('key1')).toBeUndefined()
    expect(cache.get('key2')).toBeUndefined()
  })

  it('handles cache misses correctly', () => {
    const onMiss = vi.fn().mockReturnValue(mockData)
    cache = createCache<string, any>({
      maxSize: 2,
      ttl: 1000,
      onMiss,
    })

    expect(cache.get('key1')).toEqual(mockData)
    expect(onMiss).toHaveBeenCalledWith('key1')
  })

  it('updates existing keys correctly', () => {
    cache.set('key1', mockData)
    const updatedData = { ...mockData, value: 'updated' }
    cache.set('key1', updatedData)

    expect(cache.get('key1')).toEqual(updatedData)
  })
}) 