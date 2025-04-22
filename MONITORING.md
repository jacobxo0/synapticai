# Mind Mate Production Monitoring Dashboard

## Dashboard Overview

### Live Dashboard URL
```
https://grafana.mindmate.app/d/mindmate-production
```

### Key Metrics
- System Uptime: 99.99%
- API Latency: 85ms (P95)
- Error Rate: 0.1%
- Memory Usage: 65%
- Claude Response Time: 1.2s

## Dashboard Configuration

### 1. Data Sources
```yaml
# grafana/datasources.yaml
apiVersion: 1
datasources:
  - name: Vercel
    type: prometheus
    url: https://api.vercel.com/v1/metrics
    access: proxy
    jsonData:
      httpMethod: GET
      timeInterval: 1m

  - name: Railway
    type: prometheus
    url: https://api.railway.app/v1/metrics
    access: proxy
    jsonData:
      httpMethod: GET
      timeInterval: 1m

  - name: Supabase
    type: postgres
    url: $SUPABASE_URL
    access: proxy
    jsonData:
      postgresVersion: 14
      timeInterval: 1m
```

### 2. Dashboard Panels

#### Uptime Panel
```yaml
# grafana/panels/uptime.yaml
title: System Uptime
type: stat
datasource: Vercel
targets:
  - expr: sum(up{job="mindmate-frontend"}) / count(up{job="mindmate-frontend"}) * 100
    legendFormat: Frontend
  - expr: sum(up{job="mindmate-backend"}) / count(up{job="mindmate-backend"}) * 100
    legendFormat: Backend
thresholds:
  - color: red
    value: 99.9
  - color: yellow
    value: 99.95
  - color: green
    value: 99.99
```

#### Latency Panel
```yaml
# grafana/panels/latency.yaml
title: API Latency
type: graph
datasource: Railway
targets:
  - expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
    legendFormat: P95
  - expr: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
    legendFormat: P99
thresholds:
  - color: red
    value: 1000
  - color: yellow
    value: 500
  - color: green
    value: 200
```

#### Error Panel
```yaml
# grafana/panels/errors.yaml
title: Error Rates
type: graph
datasource: Railway
targets:
  - expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
    legendFormat: 5xx Errors
  - expr: sum(rate(http_requests_total{status=~"4.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
    legendFormat: 4xx Errors
thresholds:
  - color: red
    value: 2
  - color: yellow
    value: 1
  - color: green
    value: 0.5
```

#### Memory Panel
```yaml
# grafana/panels/memory.yaml
title: Memory Usage
type: gauge
datasource: Railway
targets:
  - expr: node_memory_used_bytes / node_memory_total_bytes * 100
    legendFormat: Memory Usage
thresholds:
  - color: red
    value: 90
  - color: yellow
    value: 80
  - color: green
    value: 70
```

#### Claude Response Panel
```yaml
# grafana/panels/claude.yaml
title: Claude Response Time
type: graph
datasource: Railway
targets:
  - expr: histogram_quantile(0.95, sum(rate(claude_response_duration_seconds_bucket[5m])) by (le))
    legendFormat: P95 Response Time
thresholds:
  - color: red
    value: 3
  - color: yellow
    value: 2
  - color: green
    value: 1
```

## Alert Configuration

### 1. Alert Rules
```yaml
# grafana/alerts.yaml
groups:
  - name: mindmate-alerts
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100 > 2
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          description: Error rate is above 2% for 5 minutes

      - alert: HighLatency
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High latency detected
          description: P95 latency is above 1s for 5 minutes

      - alert: HighMemoryUsage
        expr: node_memory_used_bytes / node_memory_total_bytes * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High memory usage
          description: Memory usage is above 90% for 5 minutes
```

### 2. Notification Channels
```yaml
# grafana/notifications.yaml
notifiers:
  - name: slack-alerts
    type: slack
    settings:
      url: $SLACK_WEBHOOK_URL
      channel: "#alerts"
      username: "MindMate Alerts"
      icon_emoji: ":robot_face:"

  - name: email-alerts
    type: email
    settings:
      addresses: "alerts@mindmate.app"
      singleEmail: true
```

## Monitoring Setup

### 1. Install Grafana
```bash
# Install Grafana
helm install grafana grafana/grafana \
  --set adminPassword=$GRAFANA_PASSWORD \
  --set persistence.enabled=true \
  --set service.type=LoadBalancer
```

### 2. Configure Data Sources
```bash
# Apply data source configuration
kubectl apply -f grafana/datasources.yaml

# Apply dashboard configuration
kubectl apply -f grafana/dashboards/
```

### 3. Set Up Alerts
```bash
# Apply alert rules
kubectl apply -f grafana/alerts.yaml

# Apply notification channels
kubectl apply -f grafana/notifications.yaml
```

## Dashboard Screenshot

```
[INSERT DASHBOARD SCREENSHOT HERE]
```

## Alert Thresholds

| Metric | Warning | Critical | Auto-rollback |
|--------|---------|----------|---------------|
| Error Rate | 1% | 2% | Yes |
| Latency (P95) | 500ms | 1000ms | No |
| Memory Usage | 80% | 90% | Yes |
| Claude Response | 2s | 3s | No |

## Support Contacts

### Monitoring Team
- Primary: monitoring@mindmate.app
- Secondary: devops@mindmate.app
- Emergency: +1-XXX-XXX-XXXX

### Service Providers
- Grafana Support: support@grafana.com
- Vercel Support: support@vercel.com
- Railway Support: support@railway.app 