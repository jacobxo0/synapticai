import { test, expect } from '@playwright/test'
import { generateTestUser } from '../utils/test-data'

test.describe('Complete User Flow', () => {
  const testUser = generateTestUser()

  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/')
  })

  test('full user journey: onboarding → mood → journal → AI → feedback', async ({
    page,
  }) => {
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
    await expect(page.getByText(/how are you feeling/i)).toBeVisible()

    // 3. Mood tracking
    await page.getByRole('button', { name: /happy/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()

    // 4. Journal entry
    await page.getByLabel(/how was your day/i).fill('Today was a great day!')
    await page.getByRole('button', { name: /save entry/i }).click()
    await expect(page.getByText(/entry saved/i)).toBeVisible()

    // 5. AI Interaction
    await page.getByRole('button', { name: /chat with claude/i }).click()
    await expect(page.getByText(/claude is thinking/i)).toBeVisible()
    await expect(page.getByTestId('ai-response')).toBeVisible()

    // 6. Feedback
    await page.getByRole('button', { name: /rate response/i }).click()
    await page.getByRole('button', { name: /helpful/i }).click()
    await page.getByLabel(/feedback/i).fill('Very helpful response!')
    await page.getByRole('button', { name: /submit feedback/i }).click()

    // Verify feedback saved
    await expect(page.getByText(/feedback submitted/i)).toBeVisible()

    // Verify user state
    const userState = await page.evaluate(() => {
      return {
        onboarded: localStorage.getItem('onboarded'),
        session_01: localStorage.getItem('session_01'),
      }
    })

    expect(userState.onboarded).toBe('true')
    expect(userState.session_01).toBe('completed')
  })

  test('handles network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/**', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/onboarding')
    await page.getByRole('button', { name: /get started/i }).click()

    // Verify error handling
    await expect(page.getByText(/something went wrong/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
  })

  test('validates required fields', async ({ page }) => {
    await page.goto('/onboarding')
    await page.getByRole('button', { name: /get started/i }).click()

    // Skip required fields
    await page.getByRole('button', { name: /next/i }).click()

    // Verify validation messages
    await expect(page.getByText(/please select a mood/i)).toBeVisible()
  })

  test('matches visual snapshots', async ({ page }) => {
    // Take snapshots of key screens
    await page.goto('/onboarding')
    await expect(page).toHaveScreenshot('onboarding-welcome.png')

    await page.getByRole('button', { name: /get started/i }).click()
    await expect(page).toHaveScreenshot('onboarding-intro.png')

    await page.getByRole('button', { name: /next/i }).click()
    await expect(page).toHaveScreenshot('mood-selection.png')
  })
}) 