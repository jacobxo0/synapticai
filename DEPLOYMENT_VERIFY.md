# Deployment Verifikation Checklist

## Miljø Information
- Miljø: Staging
- URL: https://staging.mindmate.app
- API URL: https://api.staging.mindmate.app
- Timestamp: ${new Date().toISOString()}

## Backend Verifikation

### 1. Helbreds Tjek
```bash
# Tjek helbreds endpoint
curl -v https://api.staging.mindmate.app/health

# Forventet response:
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "${new Date().toISOString()}",
  "services": {
    "database": "connected",
    "redis": "connected",
    "claude": "connected"
  }
}
```

### 2. Claude Integration
```bash
# Test Claude API forbindelse
curl -X POST https://api.staging.mindmate.app/api/reflect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "prompt": "Test reflection",
    "context": {
      "mood": "neutral",
      "previousEntries": []
    }
  }'

# Forventet response:
{
  "content": "string",
  "timestamp": "string",
  "mood": "neutral",
  "tokens": 100
}
```

### 3. Context Management
```bash
# Tjek context endpoint
curl -v https://api.staging.mindmate.app/api/context \
  -H "Authorization: Bearer $JWT_TOKEN"

# Forventet response:
{
  "status": "ok",
  "context": {
    "mood": "string",
    "energy": "string",
    "goals": ["string"],
    "preferences": {
      "tone": "string",
      "language": "string"
    }
  }
}
```

## Frontend Verifikation

### 1. Journal Side
```bash
# Tjek journal side load tid
curl -w "\nTotal time: %{time_total}s\n" \
  -o /dev/null \
  -s https://staging.mindmate.app/journal

# Forventet metrics:
- Load tid < 2s
- Status kode: 200
- Content-Type: text/html
```

### 2. Timeline Side
```bash
# Tjek timeline side load tid
curl -w "\nTotal time: %{time_total}s\n" \
  -o /dev/null \
  -s https://staging.mindmate.app/timeline

# Forventet metrics:
- Load tid < 2s
- Status kode: 200
- Content-Type: text/html
```

## UI Test Cases

### 1. Journal Side
- [ ] Side loader korrekt
- [ ] Rich text editor vises
- [ ] Mood selector fungerer
- [ ] Save knap responderer
- [ ] Claude svar vises
- [ ] Error handling virker

### 2. Timeline Side
- [ ] Graf loader korrekt
- [ ] Data points vises
- [ ] Zoom funktion virker
- [ ] Tooltips vises
- [ ] Export knap virker
- [ ] Filter funktioner virker

## Performance Metrics

### Backend
- API response tid < 200ms
- Claude response tid < 2s
- Database query tid < 100ms
- Redis response tid < 10ms

### Frontend
- Første load < 2s
- TTI (Time to Interactive) < 3s
- FCP (First Contentful Paint) < 1s
- LCP (Largest Contentful Paint) < 2.5s

## Error Handling

### 1. API Fejl
```bash
# Test 404 håndtering
curl -v https://api.staging.mindmate.app/invalid-endpoint

# Forventet response:
{
  "error": "Not Found",
  "statusCode": 404,
  "message": "Endpoint not found"
}
```

### 2. Frontend Fejl
- [ ] 404 side vises korrekt
- [ ] 500 side vises korrekt
- [ ] Network error håndteres
- [ ] Loading states vises
- [ ] Error messages er informative

## Sikkerheds Tjek

### 1. CORS
```bash
# Test CORS konfiguration
curl -v -X OPTIONS https://api.staging.mindmate.app/health \
  -H "Origin: https://staging.mindmate.app"

# Forventet headers:
Access-Control-Allow-Origin: https://staging.mindmate.app
Access-Control-Allow-Methods: GET,POST,PUT,DELETE
Access-Control-Allow-Headers: Content-Type,Authorization
```

### 2. GDPR
- [ ] Consent banner vises
- [ ] Cookie indstillinger gemmes
- [ ] Privacy policy link virker
- [ ] Data export fungerer
- [ ] Account deletion virker

## Monitoring

### 1. Logging
```bash
# Tjek logging endpoint
curl -v https://api.staging.mindmate.app/logs \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Forventet response:
{
  "logs": [
    {
      "timestamp": "string",
      "level": "string",
      "message": "string",
      "context": {}
    }
  ]
}
```

### 2. Metrics
- [ ] Error rate < 1%
- [ ] Uptime > 99.9%
- [ ] Response time < 200ms
- [ ] Memory usage < 80%
- [ ] CPU usage < 70%

## Næste Skridt
1. [ ] Kør alle verifikationer
2. [ ] Dokumenter resultater
3. [ ] Adresser eventuelle fejl
4. [ ] Verificer fixes
5. [ ] Godkend deployment 