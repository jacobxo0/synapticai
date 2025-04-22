import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' }
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' }
    },
    {
      name: 'WebKit',
      use: { browserName: 'webkit' }
    }
  ]
}

export default config

export const testConfig = {
  auth: {
    email: 'test@synapticai.app',
    password: 'test123',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/synapticai_test',
  },
  api: {
    baseUrl: process.env.API_URL || 'http://localhost:3000/api',
    timeout: 5000,
  },
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || 'test-key',
    modelVersion: 'claude-3-sonnet-20240229',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379/1',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: 'json',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'test-secret',
    saltRounds: 10,
  },
  features: {
    enableAIChat: true,
    enableJournaling: true,
    enableAnalytics: false,
  }
} 