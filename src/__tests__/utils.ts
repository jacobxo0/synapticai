import { render, RenderOptions } from '@testing-library/react'
import React, { ReactElement, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a new QueryClient for each test
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

// Custom render function that includes providers
export function renderWithClient(client: QueryClient, ui: ReactNode) {
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  )
}

export function createWrapper() {
  const testQueryClient = createTestQueryClient()
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )
}

// Mock data generators
export const generateMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
})

export const generateMockPrompt = (overrides = {}) => ({
  id: '1',
  title: 'Test Prompt',
  content: 'Test content',
  createdAt: new Date().toISOString(),
  ...overrides,
})

// Test data fixtures
export const mockPrompts = [
  generateMockPrompt({ id: '1' }),
  generateMockPrompt({ id: '2', title: 'Another Prompt' }),
]

// Error boundary test utilities
export const throwError = () => {
  throw new Error('Test error')
}

// Loading state test utilities
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)) 