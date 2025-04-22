import { test, expect } from '@playwright/test';
import { generateTestUser, generateTestJournal } from './utils/test-data';

test.describe('Lokal System Test', () => {
  test.beforeEach(async ({ page }) => {
    // Gå til forsiden
    await page.goto('/');
  });

  test('System helbreds tjek', async ({ page }) => {
    // Tjek helbreds endpoint
    const healthResponse = await page.request.get('/api/health');
    expect(healthResponse.status()).toBe(200);
    
    const healthData = await healthResponse.json();
    expect(healthData.status).toBe('ok');
    expect(healthData.database).toBe('connected');
    expect(healthData.redis).toBe('connected');
  });

  test('Bruger autentificering', async ({ page }) => {
    const testUser = generateTestUser();
    
    // Opret test bruger
    const signupResponse = await page.request.post('/api/auth/signup', {
      data: testUser
    });
    expect(signupResponse.status()).toBe(201);
    
    // Log ind
    const loginResponse = await page.request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password
      }
    });
    expect(loginResponse.status()).toBe(200);
    
    const { token } = await loginResponse.json();
    expect(token).toBeTruthy();
  });

  test('Journal funktionalitet', async ({ page }) => {
    const testJournal = generateTestJournal();
    
    // Log ind først
    await page.request.post('/api/auth/login', {
      data: {
        email: 'test@mindmate.app',
        password: 'test123'
      }
    });
    
    // Opret journal indgang
    const createResponse = await page.request.post('/api/journals', {
      data: testJournal
    });
    expect(createResponse.status()).toBe(201);
    
    // Hent journal indgange
    const getResponse = await page.request.get('/api/journals');
    expect(getResponse.status()).toBe(200);
    
    const journals = await getResponse.json();
    expect(journals.length).toBeGreaterThan(0);
  });

  test('Claude integration', async ({ page }) => {
    // Log ind
    await page.request.post('/api/auth/login', {
      data: {
        email: 'test@mindmate.app',
        password: 'test123'
      }
    });
    
    // Test Claude API
    const claudeResponse = await page.request.post('/api/reflect', {
      data: {
        prompt: 'Test reflection',
        context: {
          mood: 'neutral',
          previousEntries: []
        }
      }
    });
    
    expect(claudeResponse.status()).toBe(200);
    const response = await claudeResponse.json();
    expect(response.content).toBeTruthy();
    expect(response.timestamp).toBeTruthy();
  });

  test('GDPR consent flow', async ({ page }) => {
    // Tjek om consent banner vises
    const consentBanner = await page.locator('[data-testid="consent-banner"]');
    await expect(consentBanner).toBeVisible();
    
    // Accepter consent
    await page.click('[data-testid="accept-consent"]');
    
    // Verificer at consent er gemt
    const consentResponse = await page.request.get('/api/consent');
    expect(consentResponse.status()).toBe(200);
    
    const consentData = await consentResponse.json();
    expect(consentData.status).toBe('accepted');
  });

  test('Export funktionalitet', async ({ page }) => {
    // Log ind
    await page.request.post('/api/auth/login', {
      data: {
        email: 'test@mindmate.app',
        password: 'test123'
      }
    });
    
    // Generer export
    const exportResponse = await page.request.post('/api/export', {
      data: {
        format: 'pdf',
        dateRange: {
          start: '2024-01-01',
          end: '2024-03-20'
        }
      }
    });
    
    expect(exportResponse.status()).toBe(200);
    const exportData = await exportResponse.json();
    expect(exportData.url).toBeTruthy();
    expect(exportData.format).toBe('pdf');
  });

  test('Performance metrics', async ({ page }) => {
    // Mål response tid
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000); // Under 2 sekunder
    
    // Tjek API response tid
    const apiStartTime = Date.now();
    await page.request.get('/api/health');
    const apiResponseTime = Date.now() - apiStartTime;
    
    expect(apiResponseTime).toBeLessThan(200); // Under 200ms
  });
}); 