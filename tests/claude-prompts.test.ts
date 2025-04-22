import { claudeRequest, getClaudeConfig } from '@/lib/claude'

describe('Claude Integration', () => {
  beforeEach(() => {
    // Reset environment variables
    process.env.NEXT_PUBLIC_USE_MOCK_CLAUDE = 'true'
    process.env.NEXT_PUBLIC_CLAUDE_API_KEY = undefined
  })

  test('uses mock mode by default', () => {
    const config = getClaudeConfig()
    expect(config.useMock).toBe(true)
  })

  test('handles goal suggestions', async () => {
    const response = await claudeRequest('/suggest-goals', {
      context: 'test context'
    })
    
    expect(response.content).toBeDefined()
    const goals = JSON.parse(response.content)
    expect(Array.isArray(goals)).toBe(true)
    expect(goals.length).toBeGreaterThan(0)
    expect(goals[0]).toHaveProperty('title')
    expect(goals[0]).toHaveProperty('description')
    expect(goals[0]).toHaveProperty('tone')
  })

  test('handles mood analysis', async () => {
    const response = await claudeRequest('/analyze-mood', {
      text: 'test journal entry'
    })
    
    expect(response.content).toBeDefined()
    expect(typeof response.content).toBe('string')
    expect(response.content.length).toBeGreaterThan(0)
  })

  test('falls back to mock on API error', async () => {
    process.env.NEXT_PUBLIC_USE_MOCK_CLAUDE = 'false'
    process.env.NEXT_PUBLIC_CLAUDE_API_KEY = 'invalid-key'
    
    const response = await claudeRequest('/suggest-goals', {
      context: 'test context'
    })
    
    expect(response.content).toBeDefined()
    const goals = JSON.parse(response.content)
    expect(Array.isArray(goals)).toBe(true)
  })
}) 