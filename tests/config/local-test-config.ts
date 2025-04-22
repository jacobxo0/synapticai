import { defineConfig } from '@playwright/test';

export default defineConfig({
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
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'WebKit',
      use: { browserName: 'webkit' },
    },
  ],

  // Lokal test miljø konfiguration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },

  // Test data konfiguration
  testData: {
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3001',
    testUser: {
      email: 'test@synapticai.app',
      password: 'test123',
      name: 'Test Bruger'
    },
    testJournal: {
      content: 'Dette er en test journal indgang',
      mood: 'neutral',
      tags: ['test', 'local']
    }
  },

  // Database konfiguration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/synapticai_test',
    schema: 'public',
  },

  // Redis konfiguration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // Claude API konfiguration
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: 'claude-3-opus-20240229',
    maxTokens: 1000,
  },

  // Sikkerheds konfiguration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'test-secret',
    encryptionKey: process.env.ENCRYPTION_KEY || 'test-key',
  },

  // Logging konfiguration
  logging: {
    level: 'debug',
    file: 'logs/test.log',
  },

  // Performance thresholds
  performance: {
    maxResponseTime: 200,
    maxLoadTime: 2000,
    maxQueryTime: 100,
  },
});

export const testConfig = {
  auth: {
    email: 'test@synapticai.app',
    password: 'test123',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/synapticai_test',
  }
}; 