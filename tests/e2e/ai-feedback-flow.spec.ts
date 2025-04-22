import { test, expect } from '@playwright/test'
import { generateTestUser } from '../utils/test-data'

test.describe('AI Feedback Flow', () => {
  const testUser = generateTestUser()

  test.beforeEach(async ({ page }) => {
    // Login with test user
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(testUser.email)
    await page.getByLabel(/password/i).fill(testUser.password)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('submits complete feedback with rating, tags, and comment', async ({
    page,
  }) => {
    // Navigate to AI chat
    await page.getByRole('link', { name: /chat/i }).click()
    await expect(page).toHaveURL('/chat')

    // Start conversation
    await page.getByLabel(/message/i).fill('How can I improve my mood?')
    await page.getByRole('button', { name: /send/i }).click()

    // Wait for AI response
    await expect(page.getByTestId('ai-response')).toBeVisible()

    // Open feedback modal
    await page.getByRole('button', { name: /rate response/i }).click()
    await expect(page.getByText(/how was this response/i)).toBeVisible()

    // Submit feedback
    await page.getByRole('button', { name: /very helpful/i }).click()
    await page.getByLabel(/tag/i).click()
    await page.getByText(/insightful/i).click()
    await page.getByLabel(/feedback/i).fill('This was exactly what I needed!')
    await page.getByRole('button', { name: /submit feedback/i }).click()

    // Verify feedback saved
    await expect(page.getByText(/feedback submitted/i)).toBeVisible()

    // Verify feedback in API
    const feedbackResponse = await page.evaluate(async () => {
      const response = await fetch('/api/ai/feedback')
      return response.json()
    })

    expect(feedbackResponse).toMatchObject({
      rating: 'very_helpful',
      tags: ['insightful'],
      comment: 'This was exactly what I needed!',
    })
  })

  test('handles partial feedback submission', async ({ page }) => {
    await page.goto('/chat')
    await page.getByLabel(/message/i).fill('Tell me about mindfulness')
    await page.getByRole('button', { name: /send/i }).click()

    // Submit only rating
    await page.getByRole('button', { name: /rate response/i }).click()
    await page.getByRole('button', { name: /somewhat helpful/i }).click()
    await page.getByRole('button', { name: /submit feedback/i }).click()

    // Verify minimal feedback saved
    const feedbackResponse = await page.evaluate(async () => {
      const response = await fetch('/api/ai/feedback')
      return response.json()
    })

    expect(feedbackResponse).toMatchObject({
      rating: 'somewhat_helpful',
      tags: [],
      comment: '',
    })
  })

  test('validates feedback form', async ({ page }) => {
    await page.goto('/chat')
    await page.getByLabel(/message/i).fill('Give me a meditation tip')
    await page.getByRole('button', { name: /send/i }).click()

    // Try to submit without rating
    await page.getByRole('button', { name: /rate response/i }).click()
    await page.getByRole('button', { name: /submit feedback/i }).click()

    // Verify validation message
    await expect(page.getByText(/please select a rating/i)).toBeVisible()
  })

  test('handles API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/ai/feedback', async (route) => {
      await route.abort('failed')
    })

    await page.goto('/chat')
    await page.getByLabel(/message/i).fill('How to handle stress?')
    await page.getByRole('button', { name: /send/i }).click()

    // Submit feedback
    await page.getByRole('button', { name: /rate response/i }).click()
    await page.getByRole('button', { name: /helpful/i }).click()
    await page.getByRole('button', { name: /submit feedback/i }).click()

    // Verify error handling
    await expect(page.getByText(/failed to save feedback/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
  })

  test('matches visual snapshots', async ({ page }) => {
    await page.goto('/chat')
    await page.getByLabel(/message/i).fill('What is mindfulness?')
    await page.getByRole('button', { name: /send/i }).click()

    // Take snapshots
    await page.getByRole('button', { name: /rate response/i }).click()
    await expect(page).toHaveScreenshot('feedback-modal.png')

    await page.getByRole('button', { name: /very helpful/i }).click()
    await expect(page).toHaveScreenshot('feedback-selected.png')
  })
}) 