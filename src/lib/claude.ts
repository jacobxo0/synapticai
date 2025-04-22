import { mockClaudeRequest, ClaudeResponse } from './mock-claude'

const API_BASE_URL = 'https://api.anthropic.com/v1'

export interface ClaudeConfig {
  useMock: boolean
  apiKey?: string
  mockDelay?: number
}

export function getClaudeConfig(): ClaudeConfig {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_CLAUDE === 'true'
  const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY
  const mockDelay = Number(process.env.NEXT_PUBLIC_MOCK_RESPONSE_DELAY) || 1000

  return {
    useMock: useMock || !apiKey,
    apiKey,
    mockDelay
  }
}

export async function claudeRequest(
  endpoint: string,
  data: any
): Promise<ClaudeResponse> {
  const { useMock, apiKey, mockDelay } = getClaudeConfig()
  
  if (useMock) {
    console.log(`[Claude] Using mock response for ${endpoint}`)
    return mockClaudeRequest(endpoint, data, mockDelay)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('[Claude] API request failed, falling back to mock:', error)
    return mockClaudeRequest(endpoint, data, mockDelay)
  }
} 