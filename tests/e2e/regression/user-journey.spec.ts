import { test, expect } from '@playwright/test'
import { createTestUserState, setLocalStorageState, resetTestState } from '../../utils/test-state'
import { mockAPIResponses } from '../../utils/test-data'

test.describe('Complete User Journey', () => {
  const testUser = createTestUserState()

  test.beforeEach(async ({ page }) => {
    await resetTestState(page)
    await page.goto('/')
  })

  test('full user journey with mood tracking and AI feedback', async ({ page }) => {
    // 1. Registration
    await page.getByRole('link', { name: /sign up/i }).click()
    await page.getByLabel(/email/i).fill(testUser.email)
    await page.getByLabel(/password/i).fill(testUser.password)
    await page.getByRole('button', { name: /create account/i }).click()

    // Verify onboarding state
    await expect(page).toHaveURL('/onboarding')
    await expect(page.getByText(/welcome to mind mate/i)).toBeVisible()

    // 2. Onboarding flow
    await page.getByRole('button', { name: /get started/i }).click()
    await expect(page.getByText(/meet your ai companion/i)).toBeVisible()
    await page.getByRole('button', { name: /next/i }).click()

    // 3. Mood tracking
    await expect(page.getByText(/how are you feeling/i)).toBeVisible()
    await page.getByRole('button', { name: /happy/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()

    // Verify mood saved
    const moodState = await page.evaluate(() => localStorage.getItem('mood'))
    expect(moodState).toBe('happy')

    // 4. Journal entry
    await page.getByLabel(/how was your day/i).fill('Today was a great day!')
    await page.getByRole('button', { name: /save entry/i }).click()
    await expect(page.getByText(/entry saved/i)).toBeVisible()

    // 5. AI Interaction
    await page.getByRole('button', { name: /chat with claude/i }).click()
    await expect(page.getByText(/claude is thinking/i)).toBeVisible()

    // Verify AI response contains mood context
    const aiResponse = await page.getByTestId('ai-response').textContent()
    expect(aiResponse).toContain('happy')
    expect(aiResponse).toContain('great day')

    // 6. Feedback
    await page.getByRole('button', { name: /rate response/i }).click()
    await page.getByRole('button', { name: /very helpful/i }).click()
    await page.getByLabel(/tag/i).click()
    await page.getByText(/insightful/i).click()
    await page.getByLabel(/feedback/i).fill('This was exactly what I needed!')
    await page.getByRole('button', { name: /submit feedback/i }).click()

    // Verify feedback saved
    await expect(page.getByText(/feedback submitted/i)).toBeVisible()

    // Verify complete user state
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

  test('handles network errors during critical flows', async ({ page }) => {
    // Mock API failures
    await page.route('**/api/**', async (route) => {
      await route.abort('failed')
    })

    // Attempt registration
    await page.getByRole('link', { name: /sign up/i }).click()
    await page.getByLabel(/email/i).fill(testUser.email)
    await page.getByLabel(/password/i).fill(testUser.password)
    await page.getByRole('button', { name: /create account/i }).click()

    // Verify error handling
    await expect(page.getByText(/something went wrong/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
  })

  test('validates required fields throughout journey', async ({ page }) => {
    // Skip required fields in onboarding
    await page.goto('/onboarding')
    await page.getByRole('button', { name: /get started/i }).click()
    await page.getByRole('button', { name: /next/i }).click()

    // Verify validation messages
    await expect(page.getByText(/please select a mood/i)).toBeVisible()

    // Skip required fields in journal
    await page.getByRole('button', { name: /skip/i }).click()
    await page.getByRole('button', { name: /save entry/i }).click()
    await expect(page.getByText(/please write something/i)).toBeVisible()
  })

  test('matches visual snapshots of key screens', async ({ page }) => {
    // Take snapshots of critical screens
    await page.goto('/onboarding')
    await expect(page).toHaveScreenshot('onboarding-welcome.png')

    await page.getByRole('button', { name: /get started/i }).click()
    await expect(page).toHaveScreenshot('onboarding-intro.png')

    await page.getByRole('button', { name: /next/i }).click()
    await expect(page).toHaveScreenshot('mood-selection.png')

    // Journal screen
    await page.getByRole('button', { name: /happy/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page).toHaveScreenshot('journal-entry.png')

    // AI chat screen
    await page.getByRole('button', { name: /chat with claude/i }).click()
    await expect(page).toHaveScreenshot('ai-chat.png')
  })
}) 