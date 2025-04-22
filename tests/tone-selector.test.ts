import { test, expect } from '@playwright/test'
import { createTestUserState, resetTestState } from './utils/test-state'
import { generateTestAIContext } from './utils/test-data'

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 }
}

const TEST_PROMPT = "I'm feeling stuck today"

test.describe('Tone Selector Flow', () => {
  test.beforeEach(async ({ page }) => {
    await resetTestState(page)
    const testUser = createTestUserState()
    await page.goto('/')
  })

  test.describe('UI Validation', () => {
    for (const [device, viewport] of Object.entries(VIEWPORTS)) {
      test(`C01: ToneSelectorPreview renders correctly on ${device}`, async ({ page }) => {
        await page.setViewportSize(viewport)
        
        // Navigate to settings
        await page.click('text=Settings')
        
        // Verify tone selector visibility
        await expect(page.locator('[data-testid="tone-selector"]')).toBeVisible()
        
        // Verify all tone options are visible
        const tones = ['supportive', 'direct', 'curious']
        for (const tone of tones) {
          await expect(page.locator(`[data-testid="tone-option-${tone}"]`)).toBeVisible()
        }
        
        // Verify preview text visibility
        await expect(page.locator('[data-testid="tone-preview-text"]')).toBeVisible()
      })
    }
  })

  test.describe('State Management', () => {
    test('C02: Tone selection updates state and persists', async ({ page }) => {
      const tones = ['supportive', 'direct', 'curious']
      
      for (const tone of tones) {
        // Select tone
        await page.click(`[data-testid="tone-option-${tone}"]`)
        
        // Verify Zustand state
        const currentTone = await page.evaluate(() => {
          return (window as any).__ZUSTAND_STATE__.tone.selected
        })
        expect(currentTone).toBe(tone)
        
        // Verify localStorage
        const storedTone = await page.evaluate(() => {
          return localStorage.getItem('ai_tone')
        })
        expect(storedTone).toBe(tone)
        
        // Reload page and verify persistence
        await page.reload()
        const persistedTone = await page.evaluate(() => {
          return localStorage.getItem('ai_tone')
        })
        expect(persistedTone).toBe(tone)
      }
    })
  })

  test.describe('Analytics', () => {
    test('C03: Tone selection analytics events', async ({ page }) => {
      // Mock analytics
      await page.route('**/api/analytics', async (route) => {
        await route.fulfill({ status: 200 })
      })
      
      const tones = ['supportive', 'direct', 'curious']
      for (const tone of tones) {
        // Select tone
        await page.click(`[data-testid="tone-option-${tone}"]`)
        
        // Verify analytics event
        const analyticsEvent = await page.evaluate(() => {
          return (window as any).__ANALYTICS_EVENTS__?.find(
            (e: any) => e.name === 'tone.selected' && e.properties.tone === tone
          )
        })
        expect(analyticsEvent).toBeDefined()
        expect(analyticsEvent.properties.tone).toBe(tone)
      }
    })
  })

  test.describe('Accessibility', () => {
    test('C04: Keyboard navigation and ARIA', async ({ page }) => {
      // Verify ARIA attributes
      await expect(page.locator('[data-testid="tone-selector"]')).toHaveAttribute('role', 'radiogroup')
      
      const tones = ['supportive', 'direct', 'curious']
      for (const tone of tones) {
        const toneOption = page.locator(`[data-testid="tone-option-${tone}"]`)
        await expect(toneOption).toHaveAttribute('role', 'radio')
        await expect(toneOption).toHaveAttribute('aria-label', `Select ${tone} tone`)
      }
      
      // Test keyboard navigation
      await page.keyboard.press('Tab')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('Enter')
      
      // Verify selection
      const selectedTone = await page.evaluate(() => {
        return localStorage.getItem('ai_tone')
      })
      expect(selectedTone).toBe('direct')
    })
  })

  test.describe('Claude Integration', () => {
    test('C05: Claude tone alignment', async ({ page }) => {
      const tones = ['supportive', 'direct', 'curious']
      const responses: Record<string, string> = {}
      
      for (const tone of tones) {
        // Set tone
        await page.click(`[data-testid="tone-option-${tone}"]`)
        
        // Navigate to chat
        await page.click('text=Chat')
        
        // Send test message
        await page.fill('[data-testid="message-input"]', TEST_PROMPT)
        await page.click('[data-testid="send-message"]')
        
        // Wait for response
        await page.waitForSelector('[data-testid="ai-response"]')
        const response = await page.locator('[data-testid="ai-response"]').textContent()
        responses[tone] = response || ''
        
        // Verify tone-specific elements
        const toneMarkers = {
          supportive: ['understand', 'here for you'],
          direct: ['action', 'specific'],
          curious: ['tell me more', 'explore']
        }[tone]
        
        toneMarkers.forEach(marker => {
          expect(response).toContain(marker)
        })
      }
      
      // Compare responses
      expect(responses.supportive).not.toBe(responses.direct)
      expect(responses.direct).not.toBe(responses.curious)
      expect(responses.curious).not.toBe(responses.supportive)
    })
  })
}) 