# Mind Mate Analytics Tracking Schema

## Event Naming Convention
All events follow the pattern: `mindmate.{category}.{action}`

## Core Events

### Page Views
- `mindmate.page.viewed`
  - `page_name`: string (onboarding, mood, journal, chat, landing)
  - `referrer`: string (optional)
  - `device_type`: string (mobile, desktop, tablet)

### Feature Usage
- `mindmate.feature.used`
  - `feature_name`: string (feedback, ai_chat, mood_entry, journal_entry)
  - `interaction_type`: string (click, submit, view)
  - `feature_section`: string (where in the app)

### User Engagement
- `mindmate.engagement.scroll`
  - `page_name`: string
  - `scroll_depth`: number (percentage)
  - `time_on_page`: number (seconds)

- `mindmate.engagement.time`
  - `page_name`: string
  - `duration`: number (seconds)
  - `exit_type`: string (natural, timeout, error)

### AI Interactions
- `mindmate.ai.interaction`
  - `interaction_type`: string (chat, mood_analysis, journal_insight)
  - `response_time`: number (ms)
  - `success`: boolean

## Privacy Considerations
- No PII (Personally Identifiable Information) is collected
- All user IDs are anonymized
- IP addresses are not stored
- No session tracking
- Data retention: 30 days

## Data Export Format
```json
{
  "event": "mindmate.page.viewed",
  "properties": {
    "page_name": "mood",
    "device_type": "mobile",
    "timestamp": "2024-03-20T10:00:00Z"
  }
}
``` 