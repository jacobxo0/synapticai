import { faker } from '@faker-js/faker'

export const generateTestUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
})

export const generateMockAIResponse = () => ({
  id: faker.string.uuid(),
  content: faker.lorem.paragraphs(2),
  timestamp: new Date().toISOString(),
  mood: faker.helpers.arrayElement(['happy', 'calm', 'anxious', 'sad']),
})

export const generateMockFeedback = () => ({
  id: faker.string.uuid(),
  rating: faker.helpers.arrayElement(['very_helpful', 'helpful', 'somewhat_helpful', 'not_helpful']),
  tags: faker.helpers.arrayElements(['insightful', 'practical', 'empathetic', 'detailed'], 2),
  comment: faker.lorem.sentence(),
  timestamp: new Date().toISOString(),
})

export const mockClaudeResponse = {
  id: 'claude-response-1',
  content: 'Here are some mindfulness techniques to help improve your mood...',
  suggestions: ['Deep breathing', 'Gratitude journaling', 'Mindful walking'],
}

export const mockErrorResponse = {
  error: 'Failed to process request',
  message: 'Please try again later',
  code: 'INTERNAL_SERVER_ERROR',
}

// Mock API responses
export const mockAPIResponses = {
  '/api/auth/login': {
    success: {
      token: 'mock-jwt-token',
      user: generateTestUser(),
    },
    error: mockErrorResponse,
  },
  '/api/ai/chat': {
    success: mockClaudeResponse,
    error: mockErrorResponse,
  },
  '/api/ai/feedback': {
    success: {
      message: 'Feedback submitted successfully',
    },
    error: mockErrorResponse,
  },
}

export function generateTestFeedback() {
  return {
    helpfulness: Math.floor(Math.random() * 5) + 1,
    relevance: Math.floor(Math.random() * 5) + 1,
    emotional_support: Math.floor(Math.random() * 5) + 1,
    comments: 'Test feedback comment',
    timestamp: new Date().toISOString()
  }
}

export function generateTestJournalEntry() {
  return {
    content: 'Test journal entry content',
    mood: 'neutral',
    timestamp: new Date().toISOString()
  }
}

export function generateTestAIContext() {
  return {
    mood: 'neutral',
    energy_level: 5,
    emotional_state: 'calm',
    recent_events: ['test event 1', 'test event 2'],
    goals: ['test goal 1', 'test goal 2']
  }
}

export function generateTestUserProfile() {
  return {
    name: 'Test User',
    email: 'test@synapticai.com',
    age: 25,
    gender: 'other',
    goals: ['reduce stress', 'improve sleep'],
    preferences: {
      theme: 'light',
      notifications: true,
      ai_tone: 'professional'
    }
  }
}

export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@synapticai.com',
  // ... existing code ...
}; 