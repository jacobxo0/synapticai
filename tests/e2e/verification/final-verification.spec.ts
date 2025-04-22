import { test, expect } from '@playwright/test'
import { createTestUserState, setLocalStorageState, resetTestState } from '../../utils/test-state'
import { mockAPIResponses } from '../../utils/test-data'

test.describe('Final Production Verification', () => {
  const testUser = createTestUserState()
  let feedbackId: string

  test.beforeEach(async ({ page }) => {
    await resetTestState(page)
    await page.goto('/')
  })

  test.describe('C01: AI Feedback Saving', () => {
    test('should save valid feedback and confirm database write', async ({ page }) => {
      // Complete onboarding and reach feedback stage
      await completeOnboardingFlow(page)
      
      // Submit initial feedback
      const feedbackPayload = {
        rating: 'very_helpful',
        tags: ['insightful', 'supportive'],
        comment: 'This response was exactly what I needed!'
      }
      
      await page.getByRole('button', { name: /rate response/i }).click()
      await page.getByRole('button', { name: /very helpful/i }).click()
      await page.getByLabel(/tag/i).click()
      await page.getByText(/insightful/i).click()
      await page.getByLabel(/feedback/i).fill(feedbackPayload.comment)
      await page.getByRole('button', { name: /submit feedback/i }).click()

      // Verify feedback saved
      await expect(page.getByText(/feedback submitted/i)).toBeVisible()
      
      // Confirm database write via API
      const response = await page.request.get('/api/feedback/latest')
      expect(response.status()).toBe(200)
      const feedback = await response.json()
      expect(feedback).toMatchObject(feedbackPayload)
      feedbackId = feedback.id
    })

    test('should handle multiple feedback submissions', async ({ page }) => {
      await completeOnboardingFlow(page)
      
      // Submit first feedback
      await submitFeedback(page, {
        rating: 'helpful',
        tags: ['insightful'],
        comment: 'First feedback'
      })
      
      // Submit second feedback
      await submitFeedback(page, {
        rating: 'very_helpful',
        tags: ['supportive'],
        comment: 'Second feedback'
      })
      
      // Verify both feedbacks saved
      const response = await page.request.get('/api/feedback/history')
      expect(response.status()).toBe(200)
      const feedbacks = await response.json()
      expect(feedbacks).toHaveLength(2)
    })

    test('should handle invalid feedback payload', async ({ page }) => {
      await completeOnboardingFlow(page)
      
      // Attempt to submit invalid feedback
      await page.route('**/api/feedback', async (route) => {
        await route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Invalid feedback payload' })
        })
      })
      
      await page.getByRole('button', { name: /rate response/i }).click()
      await page.getByRole('button', { name: /submit feedback/i }).click()
      
      // Verify error handling
      await expect(page.getByText(/invalid feedback/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
    })
  })

  test.describe('C02: Claude Tone Fallback', () => {
    test('should use appropriate tone for low-energy mood', async ({ page }) => {
      await completeOnboardingFlow(page)
      
      // Set low-energy mood
      await page.getByRole('button', { name: /tired/i }).click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Start AI chat
      await page.getByRole('button', { name: /chat with claude/i }).click()
      await page.getByLabel(/message/i).fill('I feel exhausted today')
      await page.getByRole('button', { name: /send/i }).click()
      
      // Verify tone
      const response = await page.getByTestId('ai-response').textContent()
      expect(response).toContain('rest')
      expect(response).toContain('gentle')
      expect(response).not.toContain('energetic')
    })

    test('should use appropriate tone for high-emotion mood', async ({ page }) => {
      await completeOnboardingFlow(page)
      
      // Set high-emotion mood
      await page.getByRole('button', { name: /excited/i }).click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Start AI chat
      await page.getByRole('button', { name: /chat with claude/i }).click()
      await page.getByLabel(/message/i).fill('I won the lottery!')
      await page.getByRole('button', { name: /send/i }).click()
      
      // Verify tone
      const response = await page.getByTestId('ai-response').textContent()
      expect(response).toContain('celebrate')
      expect(response).toContain('amazing')
      expect(response).not.toContain('calm')
    })

    test('should activate fallback tone only when context fails', async ({ page }) => {
      await completeOnboardingFlow(page)
      
      // Simulate context failure
      await page.route('**/api/context', async (route) => {
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Context service unavailable' })
        })
      })
      
      await page.getByRole('button', { name: /chat with claude/i }).click()
      await page.getByLabel(/message/i).fill('How are you?')
      await page.getByRole('button', { name: /send/i }).click()
      
      // Verify fallback tone
      const response = await page.getByTestId('ai-response').textContent()
      expect(response).toContain('default')
      expect(response).toContain('neutral')
    })
  })

  test.describe('Full Flow Verification', () => {
    test('should complete full user journey successfully', async ({ page }) => {
      // 1. Onboarding
      await page.getByRole('link', { name: /sign up/i }).click()
      await page.getByLabel(/email/i).fill(testUser.email)
      await page.getByLabel(/password/i).fill(testUser.password)
      await page.getByRole('button', { name: /create account/i }).click()
      
      // 2. Profile Setup
      await page.getByLabel(/name/i).fill(testUser.name)
      await page.getByRole('button', { name: /continue/i }).click()
      
      // 3. Mood Selection
      await page.getByRole('button', { name: /happy/i }).click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // 4. Journal Entry
      await page.getByLabel(/how was your day/i).fill('Today was amazing!')
      await page.getByRole('button', { name: /save entry/i }).click()
      
      // 5. AI Chat
      await page.getByRole('button', { name: /chat with claude/i }).click()
      await page.getByLabel(/message/i).fill('Tell me about my mood')
      await page.getByRole('button', { name: /send/i }).click()
      
      // 6. Feedback
      await submitFeedback(page, {
        rating: 'very_helpful',
        tags: ['insightful'],
        comment: 'Great analysis!'
      })
      
      // Verify final state
      const finalState = await page.evaluate(() => ({
        onboarded: localStorage.getItem('onboarded'),
        session_01: localStorage.getItem('session_01'),
        mood: localStorage.getItem('mood'),
        feedback: localStorage.getItem('last_feedback'),
      }))
      
      expect(finalState).toEqual({
        onboarded: 'true',
        session_01: 'completed',
        mood: 'happy',
        feedback: expect.stringContaining('very_helpful'),
      })
    })

    test('should handle network errors gracefully', async ({ page }) => {
      // Mock API failures
      await page.route('**/api/**', async (route) => {
        await route.abort('failed')
      })
      
      // Attempt full flow
      await page.getByRole('link', { name: /sign up/i }).click()
      await page.getByLabel(/email/i).fill(testUser.email)
      await page.getByLabel(/password/i).fill(testUser.password)
      await page.getByRole('button', { name: /create account/i }).click()
      
      // Verify error handling
      await expect(page.getByText(/something went wrong/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
    })
  })
})

async function completeOnboardingFlow(page: any) {
  await page.getByRole('link', { name: /sign up/i }).click()
  await page.getByLabel(/email/i).fill(testUser.email)
  await page.getByLabel(/password/i).fill(testUser.password)
  await page.getByRole('button', { name: /create account/i }).click()
  await page.getByLabel(/name/i).fill(testUser.name)
  await page.getByRole('button', { name: /continue/i }).click()
  await page.getByRole('button', { name: /happy/i }).click()
  await page.getByRole('button', { name: /continue/i }).click()
  await page.getByLabel(/how was your day/i).fill('Today was great!')
  await page.getByRole('button', { name: /save entry/i }).click()
}

async function submitFeedback(page: any, feedback: { rating: string; tags: string[]; comment: string }) {
  await page.getByRole('button', { name: /rate response/i }).click()
  await page.getByRole('button', { name: new RegExp(feedback.rating, 'i') }).click()
  for (const tag of feedback.tags) {
    await page.getByLabel(/tag/i).click()
    await page.getByText(new RegExp(tag, 'i')).click()
  }
  await page.getByLabel(/feedback/i).fill(feedback.comment)
  await page.getByRole('button', { name: /submit feedback/i }).click()
  await expect(page.getByText(/feedback submitted/i)).toBeVisible()
} 