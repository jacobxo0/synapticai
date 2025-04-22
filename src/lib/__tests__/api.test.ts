import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApiClient } from '../api'
import { ApiError } from '../../types/errors'

describe('ApiClient', () => {
  let client: ApiClient
  const mockBaseUrl = 'http://api.test'
  
  beforeEach(() => {
    client = new ApiClient({
      baseUrl: mockBaseUrl,
      headers: { 'Content-Type': 'application/json' },
      cache: true,
      retries: 3
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: 'test' }
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        status: 200
      })

      const response = await client.get('/test')
      expect(response).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/test`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object)
        })
      )
    })

    it('should use cache for repeated GET requests', async () => {
      const mockResponse = { data: 'test' }
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        status: 200
      })

      await client.get('/test')
      await client.get('/test')
      
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should retry failed requests', async () => {
      const mockError = new Error('Network error')
      const mockSuccess = { data: 'test' }
      
      global.fetch = vi.fn()
        .mockRejectedValueOnce(mockError)
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSuccess),
          status: 200
        })

      const response = await client.get('/test')
      expect(response).toEqual(mockSuccess)
      expect(fetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { name: 'test' }
      const mockResponse = { id: 1, ...mockData }
      
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        status: 201
      })

      const response = await client.post('/test', mockData)
      expect(response).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        `${mockBaseUrl}/test`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockData),
          headers: expect.any(Object)
        })
      )
    })
  })

  describe('Error handling', () => {
    it('should throw ApiError for non-200 responses', async () => {
      const errorResponse = { message: 'Not found' }
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(errorResponse),
        status: 404
      })

      await expect(client.get('/test')).rejects.toThrow(ApiError)
      await expect(client.get('/test')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Not found'
      })
    })

    it('should throw after max retries exceeded', async () => {
      const mockError = new Error('Network error')
      global.fetch = vi.fn().mockRejectedValue(mockError)

      await expect(client.get('/test')).rejects.toThrow('Network error')
      expect(fetch).toHaveBeenCalledTimes(3) // Default max retries
    })
  })

  describe('Cache management', () => {
    it('should clear cache when requested', async () => {
      const mockResponse = { data: 'test' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        status: 200
      })

      await client.get('/test')
      client.clearCache()
      await client.get('/test')
      
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should respect cache TTL', async () => {
      const mockResponse = { data: 'test' }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        status: 200
      })

      await client.get('/test')
      
      // Advance time past cache TTL
      vi.advanceTimersByTime(6 * 60 * 1000) // 6 minutes
      
      await client.get('/test')
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })
}) 