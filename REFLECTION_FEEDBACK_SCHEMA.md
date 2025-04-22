# Reflection Feedback Schema

## Core Types

```typescript
// Mood Types
type MoodType = 'positive' | 'neutral' | 'negative' | 'mixed';

// Tone Types
type ToneType = 'professional' | 'friendly' | 'empathetic' | 'casual';

// Depth Levels
type DepthLevel = 'surface' | 'moderate' | 'deep' | 'transformative';

// Rating Scale
type Rating = 1 | 2 | 3 | 4 | 5;
```

## Feedback Schema

```typescript
interface ReflectionRating {
  // Core Feedback
  promptId: string;                  // Unique identifier for the reflection prompt
  rating: Rating;                    // 1-5 star rating
  comment?: string;                  // Optional user feedback text
  tone: ToneType;                    // AI's response tone
  mood: MoodType;                    // User's mood during interaction
  depthScore: number;                // 1-10 scale for reflection depth

  // Contextual Data
  journalEntry: {
    id: string;                      // Journal entry identifier
    length: number;                  // Word count
    timestamp: string;               // ISO timestamp
  };

  // Response Data
  reflection: {
    id: string;                      // Reflection identifier
    length: number;                  // Word count
    responseTime: number;            // Time taken (ms)
    toneConsistency: number;         // 1-10 scale
  };

  // User Context
  userContext: {
    sessionId: string;               // Current session
    deviceType: 'mobile' | 'desktop' | 'tablet';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
}
```

## Frontend Components

```typescript
// Rating Component Props
interface RatingComponentProps {
  promptId: string;
  initialRating?: Rating;
  onRatingChange: (rating: Rating) => void;
  onCommentChange?: (comment: string) => void;
  onToneSelect?: (tone: ToneType) => void;
  onMoodSelect?: (mood: MoodType) => void;
  onDepthScore?: (score: number) => void;
  isSubmitting?: boolean;
}

// Feedback Form State
interface FeedbackFormState {
  rating: Rating;
  comment: string;
  tone: ToneType;
  mood: MoodType;
  depthScore: number;
  isSubmitting: boolean;
  error?: string;
}
```

## API Endpoints

```typescript
// Submit Feedback
interface SubmitFeedbackRequest {
  promptId: string;
  rating: Rating;
  comment?: string;
  tone: ToneType;
  mood: MoodType;
  depthScore: number;
}

interface SubmitFeedbackResponse {
  success: boolean;
  feedbackId: string;
  timestamp: string;
}

// Get Feedback History
interface FeedbackHistoryResponse {
  feedbacks: ReflectionRating[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
```

## UI Components

```typescript
// Rating Stars Component
const RatingStars: React.FC<RatingComponentProps> = ({
  initialRating,
  onRatingChange,
  ...props
}) => {
  // Implementation
};

// Tone Selector Component
const ToneSelector: React.FC<{
  selectedTone: ToneType;
  onToneChange: (tone: ToneType) => void;
}> = ({ selectedTone, onToneChange }) => {
  // Implementation
};

// Mood Selector Component
const MoodSelector: React.FC<{
  selectedMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
}> = ({ selectedMood, onMoodChange }) => {
  // Implementation
};

// Depth Score Slider
const DepthScoreSlider: React.FC<{
  value: number;
  onChange: (score: number) => void;
}> = ({ value, onChange }) => {
  // Implementation
};
```

## Validation Rules

```typescript
const validateFeedback = (feedback: ReflectionRating): ValidationResult => {
  const errors: string[] = [];

  if (!feedback.promptId) {
    errors.push('Prompt ID is required');
  }

  if (!feedback.rating || feedback.rating < 1 || feedback.rating > 5) {
    errors.push('Valid rating is required');
  }

  if (feedback.depthScore < 1 || feedback.depthScore > 10) {
    errors.push('Depth score must be between 1 and 10');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## Success Metrics

### 1. Collection Targets
- Feedback Rate: > 85%
- Completion Rate: > 90%
- Average Time: < 30s

### 2. Quality Targets
- Rating Distribution: Normal curve
- Comment Rate: > 40%
- Depth Score Variance: < 2.0

### 3. Performance Targets
- Load Time: < 1s
- Submit Time: < 2s
- Error Rate: < 1%

## Privacy Considerations
- All feedback is anonymized
- No PII collection
- 30-day retention
- GDPR compliance

## Next Steps
1. Implement frontend components
2. Set up API endpoints
3. Create analytics dashboard
4. Monitor feedback patterns
5. Optimize collection flow 