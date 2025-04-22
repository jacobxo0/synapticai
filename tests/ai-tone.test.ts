import { test, expect } from '@playwright/test'
import { createTestUserState, resetTestState } from './utils/test-state'
import { generateTestAIContext } from './utils/test-data'

const TEST_PROMPTS = [
  "I'm feeling stuck today",
  "I can't sleep lately",
  "I'm overwhelmed with work",
  "Things don't feel meaningful right now"
]

const TONES = ['supportive', 'direct', 'curious'] as const

test.describe('AI Tone Validation', () => {
  test.beforeEach(async ({ page }) => {
    await resetTestState(page)
    const testUser = createTestUserState()
    await page.goto('/')
  })

  test.describe('Tone Consistency', () => {
    for (const tone of TONES) {
      test(`C01: ${tone} tone consistency`, async ({ page }) => {
        // Set tone preference
        await page.evaluate((tone) => {
          localStorage.setItem('ai_tone', tone)
        }, tone)

        // Test each prompt
        for (const prompt of TEST_PROMPTS) {
          // Navigate to chat
          await page.click('text=Chat')
          
          // Send message
          await page.fill('[data-testid="message-input"]', prompt)
          await page.click('[data-testid="send-message"]')
          
          // Wait for response
          await page.waitForSelector('[data-testid="ai-response"]')
          
          // Verify tone-specific elements
          const response = await page.locator('[data-testid="ai-response"]').textContent()
          
          // Tone-specific assertions
          switch (tone) {
            case 'supportive':
              expect(response).toContain('understand')
              expect(response).toContain('here for you')
              expect(response).toContain('care')
              break
            case 'direct':
              expect(response).toContain('action')
              expect(response).toContain('specific')
              expect(response).toContain('steps')
              break
            case 'curious':
              expect(response).toContain('tell me more')
              expect(response).toContain('explore')
              expect(response).toContain('understand')
              break
          }
          
          // Verify no tone bleed
          TONES.filter(t => t !== tone).forEach(otherTone => {
            const otherToneMarkers = {
              supportive: ['here for you', 'care'],
              direct: ['action', 'specific'],
              curious: ['tell me more', 'explore']
            }[otherTone]
            
            otherToneMarkers.forEach(marker => {
              expect(response).not.toContain(marker)
            })
          })
        }
      })
    }
  })

  test.describe('Tone Switching', () => {
    test('C02: Tone switching consistency', async ({ page }) => {
      const testPrompts = TEST_PROMPTS.slice(0, 2) // Use first two prompts for this test
      
      for (const tone of TONES) {
        // Set new tone
        await page.evaluate((tone) => {
          localStorage.setItem('ai_tone', tone)
        }, tone)
        
        // Test with each prompt
        for (const prompt of testPrompts) {
          await page.click('text=Chat')
          await page.fill('[data-testid="message-input"]', prompt)
          await page.click('[data-testid="send-message"]')
          
          await page.waitForSelector('[data-testid="ai-response"]')
          const response = await page.locator('[data-testid="ai-response"]').textContent()
          
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
      }
    })
  })

  test.describe('Error Handling', () => {
    test('C03: Invalid tone fallback', async ({ page }) => {
      // Set invalid tone
      await page.evaluate(() => {
        localStorage.setItem('ai_tone', 'invalid_tone')
      })
      
      // Send test message
      await page.click('text=Chat')
      await page.fill('[data-testid="message-input"]', TEST_PROMPTS[0])
      await page.click('[data-testid="send-message"]')
      
      // Verify fallback to default tone
      await page.waitForSelector('[data-testid="ai-response"]')
      const response = await page.locator('[data-testid="ai-response"]').textContent()
      
      // Default tone should be supportive
      expect(response).toContain('understand')
      expect(response).toContain('here for you')
    })
  })
}) 