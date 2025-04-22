import { Page } from '@playwright/test'
import { User } from '@prisma/client'

export interface TestUser {
  email: string
  password: string
  name: string
}

export interface TestState {
  user?: User
  isAuthenticated: boolean
}

export const initialTestState: TestState = {
  isAuthenticated: false,
}

export function createTestState(overrides?: Partial<TestState>): TestState {
  return {
    ...initialTestState,
    ...overrides,
  }
}

export function createTestUserState(): TestUser {
  const timestamp = Date.now()
  return {
    email: `test-${timestamp}@mindmate.com`,
    password: 'TestPassword123!',
    name: `