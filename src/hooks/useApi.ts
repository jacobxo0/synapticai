import { useState, useCallback, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface UseApiOptions<TBody = unknown> {
  method?: HttpMethod
  path?: string
  body?: TBody
  headers?: Record<string, string>
  signal?: AbortSignal
}

interface ApiError {
  message: string
  code?: string
  details?: unknown
}

interface ApiResponse<T> {
  data: T
  message?: string
}

interface UseApiHook<T> {
  data: T | null
  error: ApiError | null
  isLoading: boolean
  fetchData: <TBody = unknown>(options?: UseApiOptions<TBody>) => Promise<T>
  cancelRequest: () => void
}

const API_BASE_URL = '/api'
const DEFAULT_TIMEOUT = 30000 // 30 seconds

export function useApi<T>(endpoint: string): UseApiHook<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { token } = useAuthStore()

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const fetchData = useCallback(async <TBody = unknown>(
    options: UseApiOptions<TBody> = {}
  ): Promise<T> => {
    if (!endpoint?.trim()) {
      throw new Error('API endpoint is required')
    }

    // Cancel any existing request
    cancelRequest()

    // Create new AbortController for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Create timeout promise
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, DEFAULT_TIMEOUT)

    setIsLoading(true)
    setError(null)

    try {
      const url = `${API_BASE_URL}${endpoint}${options.path || ''}`
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...(options.body && { body: JSON.stringify(options.body) }),
        signal: options.signal || abortController.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error ${response.status}`)
      }

      const responseData = await response.json()

      // Validate response format
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response format')
      }

      const result = responseData as ApiResponse<T>
      setData(result.data)
      return result.data
    } catch (err) {
      // Don't set error state if request was cancelled
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Request cancelled')
      }

      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An error occurred',
        details: err,
      }
      setError(apiError)
      throw apiError
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [endpoint, token, cancelRequest])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRequest()
    }
  }, [cancelRequest])

  return {
    data,
    error,
    isLoading,
    fetchData,
    cancelRequest,
  }
} 