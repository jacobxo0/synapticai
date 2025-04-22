# Lokal Test Plan for MindMate

## Test Miljø Opsætning
- [ ] Node.js v18.x installeret
- [ ] PostgreSQL lokalt
- [ ] Redis lokalt
- [ ] Claude API nøgle konfigureret
- [ ] Environment variabler sat op

## Test Cases

### 1. Backend Test
```bash
# Kør backend tests
npm run test:backend

# Tjek database forbindelse
npm run db:test

# Valider API endpoints
npm run test:api
```

### 2. Frontend Test
```bash
# Kør frontend tests
npm run test:frontend

# Tjek bygge processen
npm run build

# Start udviklings server
npm run dev
```

### 3. Integration Test
```bash
# Kør integration tests
npm run test:integration

# Tjek API kommunikation
npm run test:api-communication
```

## Fejlfinding Guide

### Almindelige Fejl

1. **Database Forbindelse**
   ```bash
   # Tjek database status
   psql -U postgres -c "\l"
   
   # Tjek migrations
   npx prisma migrate status
   
   # Kør migrations
   npx prisma migrate dev
   ```

2. **Redis Forbindelse**
   ```bash
   # Tjek Redis status
   redis-cli ping
   
   # Tjek Redis keys
   redis-cli keys "*"
   ```

3. **Claude API**
   ```bash
   # Test Claude API forbindelse
   curl -X POST https://api.anthropic.com/v1/complete \
     -H "Authorization: Bearer $CLAUDE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Test", "max_tokens": 5}'
   ```

### Performance Test
```bash
# Kør load test
npm run test:load

# Tjek hukommelses brug
npm run test:memory

# Tjek response tid
npm run test:latency
```

## Lokal Opsætning Guide

### 1. Database
```bash
# Opret database
createdb mindmate_dev

# Kør migrations
npx prisma migrate dev
```

### 2. Redis
```bash
# Start Redis server
redis-server

# Tjek Redis status
redis-cli ping
```

### 3. Backend
```bash
# Installer afhængigheder
npm install

# Start backend
npm run dev:backend
```

### 4. Frontend
```bash
# Installer afhængigheder
npm install

# Start frontend
npm run dev:frontend
```

## Test Data
```typescript
// Eksempel test data
const testUser = {
  email: "test@mindmate.app",
  password: "test123",
  name: "Test Bruger"
};

const testJournal = {
  content: "Dette er en test journal indgang",
  mood: "neutral",
  tags: ["test", "local"]
};
```

## Fejl Logning
```bash
# Se backend logs
npm run logs:backend

# Se frontend logs
npm run logs:frontend

# Se database logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

## Sikkerheds Test
```bash
# Kør sikkerheds scan
npm run security:scan

# Tjek dependencies
npm audit

# Tjek GDPR compliance
npm run gdpr:check
```

## Performance Metrics
- Backend response tid < 200ms
- Frontend load tid < 2s
- Database query tid < 100ms
- Redis response tid < 10ms

## Næste Skridt
1. [ ] Kør alle tests
2. [ ] Dokumenter fejl
3. [ ] Implementer fixes
4. [ ] Verificer løsninger
5. [ ] Opdater dokumentation 