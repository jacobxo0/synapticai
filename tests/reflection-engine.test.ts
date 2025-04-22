import { test, expect } from '@playwright/test'
import { createTestUserState, resetTestState } from './utils/test-state'
import { generateTestJournalEntry, generateTestAIContext } from './utils/test-data'

const TEST_ENTRIES = {
  supportive: {
    content: "I'm feeling overwhelmed with work. Everything seems to be piling up and I don't know where to start.",
    mood: 'anxious',
    depth: 'surface'
  },
  direct: {
    content: "Need to improve my productivity. Current methods aren't working. Looking for specific steps to take.",
    mood: 'neutral',
    depth: 'practical'
  },
  curious: {
    content: "I've been thinking about my career path. What makes work meaningful? How do I find purpose in what I do?",
    mood: 'reflective',
    depth: 'deep'
  }
}

test.describe('Reflection Engine', () => {
  test.beforeEach(async ({ page }) => {
    await resetTestState(page)
    const testUser = createTestUserState()
    await page.goto('/')
  })

  test.describe('Prompt Building', () => {
    test('C01: buildReflectionPrompt formats correctly', async ({ page }) => {
      for (const [tone, entry] of Object.entries(TEST_ENTRIES)) {
        // Set tone
        await page.evaluate((tone) => {
          localStorage.setItem('ai_tone', tone)
        }, tone)
        
        // Set mood and depth
        await page.evaluate(({ mood, depth }) => {
          localStorage.setItem('current_mood', mood)
          localStorage.setItem('reflection_depth', depth)
        }, entry)
        
        // Submit journal entry
        await page.click('text=Journal')
        await page.fill('[data-testid="journal-input"]', entry.content)
        await page.click('[data-testid="submit-entry"]')
        
        // Get generated prompt
        const prompt = await page.evaluate(() => {
          return (window as any).__REFLECTION_PROMPT__
        })
        
        // Verify prompt structure
        expect(prompt).toContain(`[TONE: ${tone}]`)
        expect(prompt).toContain(`[MOOD: ${entry.mood}]`)
        expect(prompt).toContain(`[DEPTH: ${entry.depth}]`)
        expect(prompt).toContain(entry.content)
        
        // Verify tone-specific elements
        const toneMarkers = {
          supportive: ['understand', 'here for you'],
          direct: ['action', 'specific'],
          curious: ['tell me more', 'explore']
        }[tone]
        
        toneMarkers.forEach(marker => {
          expect(prompt).toContain(marker)
        })
      }
    })
  })

  test.describe('Integration', () => {
    test('C02: Journal entry processing and Claude context', async ({ page }) => {
      const entry = TEST_ENTRIES.supportive
      
      // Set initial state
      await page.evaluate(() => {
        localStorage.setItem('ai_tone', 'supportive')
        localStorage.setItem('current_mood', entry.mood)
        localStorage.setItem('reflection_depth', entry.depth)
      })
      
      // Submit entry
      await page.click('text=Journal')
      await page.fill('[data-testid="journal-input"]', entry.content)
      await page.click('[data-testid="submit-entry"]')
      
      // Wait for processing
      await page.waitForSelector('[data-testid="processing-complete"]')
      
      // Verify Claude context
      const context = await page.evaluate(() => {
        return (window as any).__CLAUDE_CONTEXT__
      })
      
      expect(context).toMatchObject({
        tone: 'supportive',
        mood: entry.mood,
        depth: entry.depth,
        content: entry.content
      })
      
      // Verify token usage
      const tokenCount = await page.evaluate(() => {
        return (window as any).__TOKEN_COUNT__
      })
      expect(tokenCount).toBeLessThan(4000) // Max token threshold
    })
  })

  test.describe('Error Handling', () => {
    test('C03: Handles invalid entries gracefully', async ({ page }) => {
      // Set initial state
      await page.evaluate(() => {
        localStorage.setItem('ai_tone', 'supportive')
        localStorage.setItem('current_mood', 'neutral')
        localStorage.setItem('reflection_depth', 'surface')
      })
      
      // Submit empty entry
      await page.click('text=Journal')
      await page.click('[data-testid="submit-entry"]')
      
      // Verify error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Entry cannot be empty')
      
      // Submit entry that's too long
      const longEntry = 'a'.repeat(10001)
      await page.fill('[data-testid="journal-input"]', longEntry)
      await page.click('[data-testid="submit-entry"]')
      
      // Verify error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Entry is too long')
    })
  })

  test.describe('Logging', () => {
    test('C04: Logs reflection processing correctly', async ({ page }) => {
      // Mock analytics
      await page.route('**/api/analytics', async (route) => {
        await route.fulfill({ status: 200 })
      })
      
      const entry = TEST_ENTRIES.direct
      
      // Set initial state
      await page.evaluate(() => {
        localStorage.setItem('ai_tone', 'direct')
        localStorage.setItem('current_mood', entry.mood)
        localStorage.setItem('reflection_depth', entry.depth)
      })
      
      // Submit entry
      await page.click('text=Journal')
      await page.fill('[data-testid="journal-input"]', entry.content)
      await page.click('[data-testid="submit-entry"]')
      
      // Verify analytics events
      const events = await page.evaluate(() => {
        return (window as any).__ANALYTICS_EVENTS__
      })
      
      expect(events).toContainEqual(
        expect.objectContaining({
          name: 'reflection.processed',
          properties: {
            tone: 'direct',
            mood: entry.mood,
            depth: entry.depth,
            length: entry.content.length
          }
        })
      )
    })
  })
}) 