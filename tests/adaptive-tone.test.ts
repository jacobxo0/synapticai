import { test, expect } from '@playwright/test'
import { createTestUserState, resetTestState } from './utils/test-state'
import { generateTestAIContext } from './utils/test-data'

const MOODS = ['happy', 'anxious', 'sad'] as const
const TONES = ['supportive', 'direct', 'curious'] as const

test.describe('Adaptive Tone Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await resetTestState(page)
    const testUser = createTestUserState()
    await page.goto('/')
  })

  test.describe('Tone Consistency', () => {
    test('C01: Maintains selected tone despite mood changes', async ({ page }) => {
      const selectedTone = 'direct'
      
      // Set initial tone
      await page.evaluate((tone) => {
        localStorage.setItem('ai_tone', tone)
      }, selectedTone)
      
      // Test with different moods
      for (const mood of MOODS) {
        // Set mood
        await page.evaluate((mood) => {
          localStorage.setItem('current_mood', mood)
        }, mood)
        
        // Send test message
        await page.click('text=Chat')
        await page.fill('[data-testid="message-input"]', "I need help")
        await page.click('[data-testid="send-message"]')
        
        // Wait for response
        await page.waitForSelector('[data-testid="ai-response"]')
        const response = await page.locator('[data-testid="ai-response"]').textContent()
        
        // Verify tone markers
        const toneMarkers = {
          supportive: ['understand', 'here for you'],
          direct: ['action', 'specific'],
          curious: ['tell me more', 'explore']
        }[selectedTone]
        
        toneMarkers.forEach(marker => {
          expect(response).toContain(marker)
        })
      }
    })
  })

  test.describe('Tone Suggestions', () => {
    test('C02: Suggests appropriate tone shifts', async ({ page }) => {
      // Set initial state
      await page.evaluate(() => {
        localStorage.setItem('ai_tone', 'direct')
        localStorage.setItem('current_mood', 'anxious')
      })
      
      // Send emotional message
      await page.click('text=Chat')
      await page.fill('[data-testid="message-input"]', "I'm feeling really overwhelmed")
      await page.click('[data-testid="send-message"]')
      
      // Verify suggestion UI
      await expect(page.locator('[data-testid="tone-suggestion"]')).toBeVisible()
      await expect(page.locator('[data-testid="suggested-tone"]')).toHaveText('supportive')
      
      // Verify no automatic shift
      const currentTone = await page.evaluate(() => {
        return localStorage.getItem('ai_tone')
      })
      expect(currentTone).toBe('direct')
    })
  })

  test.describe('User Overrides', () => {
    test('C03: Respects user tone overrides', async ({ page }) => {
      // Set initial state
      await page.evaluate(() => {
        localStorage.setItem('ai_tone', 'direct')
        localStorage.setItem('current_mood', 'anxious')
      })
      
      // Send message that would trigger suggestion
      await page.click('text=Chat')
      await page.fill('[data-testid="message-input"]', "I'm feeling really overwhelmed")
      await page.click('[data-testid="send-message"]')
      
      // Override suggestion
      await page.click('[data-testid="keep-current-tone"]')
      
      // Verify tone maintained
      const currentTone = await page.evaluate(() => {
        return localStorage.getItem('ai_tone')
      })
      expect(currentTone).toBe('direct')
      
      // Send another message
      await page.fill('[data-testid="message-input"]', "I need help")
      await page.click('[data-testid="send-message"]')
      
      // Verify tone still maintained
      await page.waitForSelector('[data-testid="ai-response"]')
      const response = await page.locator('[data-testid="ai-response"]').textContent()
      expect(response).toContain('action')
      expect(response).toContain('specific')
    })
  })

  test.describe('Context Changes', () => {
    test('C04: Handles mid-conversation context changes', async ({ page }) => {
      // Set initial state
      await page.evaluate(() => {
        localStorage.setItem('ai_tone', 'supportive')
        localStorage.setItem('current_mood', 'happy')
      })
      
      // Start conversation
      await page.click('text=Chat')
      await page.fill('[data-testid="message-input"]', "I'm feeling great today")
      await page.click('[data-testid="send-message"]')
      
      // Wait for response
      await page.waitForSelector('[data-testid="ai-response"]')
      const response1 = await page.locator('[data-testid="ai-response"]').textContent()
      expect(response1).toContain('understand')
      expect(response1).toContain('here for you')
      
      // Change context
      await page.fill('[data-testid="message-input"]', "Can you help me make a plan?")
      await page.click('[data-testid="send-message"]')
      
      // Verify tone maintained
      await page.waitForSelector('[data-testid="ai-response"]')
      const response2 = await page.locator('[data-testid="ai-response"]').textContent()
      expect(response2).toContain('understand')
      expect(response2).toContain('here for you')
    })
  })

  test.describe('Logging', () => {
    test('C05: Logs tone decisions correctly', async ({ page }) => {
      // Mock analytics
      await page.route('**/api/analytics', async (route) => {
        await route.fulfill({ status: 200 })
      })
      
      // Set initial state
      await page.evaluate(() => {
        localStorage.setItem('ai_tone', 'direct')
        localStorage.setItem('current_mood', 'anxious')
      })
      
      // Send message
      await page.click('text=Chat')
      await page.fill('[data-testid="message-input"]', "I need help")
      await page.click('[data-testid="send-message"]')
      
      // Verify analytics event
      const analyticsEvent = await page.evaluate(() => {
        return (window as any).__ANALYTICS_EVENTS__?.find(
          (e: any) => e.name === 'tone.decision'
        )
      })
      
      expect(analyticsEvent).toBeDefined()
      expect(analyticsEvent.properties).toMatchObject({
        selectedTone: 'direct',
        mood: 'anxious',
        context: 'help request',
        userOverride: false
      })
    })
  })
}) 