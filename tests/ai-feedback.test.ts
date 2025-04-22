import { test, expect } from '@playwright/test'
import { createTestUserState, resetTestState } from './utils/test-state'
import { generateTestFeedback, generateTestJournalEntry, generateTestAIContext } from './utils/test-data'

test.describe('AI Feedback Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await resetTestState(page)
    const testUser = createTestUserState()
    await page.goto('/')
  })

  test('C01: Submit AI Feedback', async ({ page }) => {
    const feedback = generateTestFeedback()
    
    // Navigate to feedback page
    await page.click('text=Feedback')
    
    // Fill feedback form
    await page.fill('[data-testid="helpfulness-rating"]', feedback.helpfulness.toString())
    await page.fill('[data-testid="relevance-rating"]', feedback.relevance.toString())
    await page.fill('[data-testid="emotional-support-rating"]', feedback.emotional_support.toString())
    await page.fill('[data-testid="comments"]', feedback.comments)
    
    // Submit feedback
    await page.click('[data-testid="submit-feedback"]')
    
    // Verify success message
    await expect(page.locator('[data-testid="feedback-success"]')).toBeVisible()
    
    // Verify feedback was saved
    const savedFeedback = await page.evaluate(() => {
      return localStorage.getItem('ai_feedback')
    })
    expect(JSON.parse(savedFeedback)).toMatchObject(feedback)
  })

  test('C02: Multiple Feedback Submissions', async ({ page }) => {
    const feedback1 = generateTestFeedback()
    const feedback2 = generateTestFeedback()
    
    // Submit first feedback
    await page.click('text=Feedback')
    await page.fill('[data-testid="helpfulness-rating"]', feedback1.helpfulness.toString())
    await page.fill('[data-testid="relevance-rating"]', feedback1.relevance.toString())
    await page.fill('[data-testid="emotional-support-rating"]', feedback1.emotional_support.toString())
    await page.fill('[data-testid="comments"]', feedback1.comments)
    await page.click('[data-testid="submit-feedback"]')
    
    // Submit second feedback
    await page.fill('[data-testid="helpfulness-rating"]', feedback2.helpfulness.toString())
    await page.fill('[data-testid="relevance-rating"]', feedback2.relevance.toString())
    await page.fill('[data-testid="emotional-support-rating"]', feedback2.emotional_support.toString())
    await page.fill('[data-testid="comments"]', feedback2.comments)
    await page.click('[data-testid="submit-feedback"]')
    
    // Verify both feedbacks were saved
    const savedFeedbacks = await page.evaluate(() => {
      return localStorage.getItem('ai_feedback_history')
    })
    const feedbacks = JSON.parse(savedFeedbacks)
    expect(feedbacks).toHaveLength(2)
    expect(feedbacks[0]).toMatchObject(feedback1)
    expect(feedbacks[1]).toMatchObject(feedback2)
  })

  test('C03: Invalid Feedback Submission', async ({ page }) => {
    await page.click('text=Feedback')
    
    // Try to submit empty feedback
    await page.click('[data-testid="submit-feedback"]')
    
    // Verify error messages
    await expect(page.locator('[data-testid="helpfulness-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="relevance-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emotional-support-error"]')).toBeVisible()
    
    // Verify no feedback was saved
    const savedFeedback = await page.evaluate(() => {
      return localStorage.getItem('ai_feedback')
    })
    expect(savedFeedback).toBeNull()
  })
}) 