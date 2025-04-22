// Common Types
export type Theme = 'light' | 'dark' | 'system'

// Component Props
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface ThemeProps extends BaseProps {
  theme?: Theme
}

// API Types
export interface ApiResponse<T> {
  data: T
  error?: string
  status: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number
  total: number
  limit: number
}

// AI Types
export interface PromptTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  context?: Record<string, unknown>
}

export interface AiContext {
  conversationId: string
  userId: string
  timestamp: number
  metadata: Record<string, unknown>
}

// Database Types
export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  conversationId: string
  createdAt: Date
  metadata?: Record<string, unknown>
}

// Cache Types
export interface CacheConfig {
  ttl: number
  prefix: string
  fallback?: boolean
}

export interface CacheEntry<T> {
  key: string
  value: T
  expiresAt: number
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export type ErrorHandler = (error: ApiError) => void

// Utility Types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type AsyncResult<T> = Promise<T>
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E }

// Core Types
export * from './core';

// Feature Types
export * from './goals';
export * from './reflection';
export * from './analytics';
export * from './errors';

// API Types
export * from './api';

// Store Types
export * from './stores'; 