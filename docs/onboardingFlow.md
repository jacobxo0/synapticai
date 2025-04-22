# Mind Mate Onboarding Flow

## Overview
The onboarding flow is designed to introduce new users to Mind Mate's core features while maintaining a calm, supportive tone. The flow consists of 4 key steps that can be completed in about 2-3 minutes.

## Flow Steps

### 1. Welcome Screen
- **Purpose**: Set the tone and introduce Mind Mate
- **Content**: 
  - Warm welcome message
  - Brief introduction to the app's purpose
  - Simple, clean design with minimal distractions
- **Skip Option**: Available
- **Accessibility**: 
  - High contrast text
  - Screen reader friendly
  - Keyboard navigable

### 2. Mood Tracking
- **Purpose**: Introduce mood tracking feature
- **Content**:
  - 5 emoji options (😢, 😞, 😐, 😊, 😄)
  - Simple selection interface
  - No pressure to share detailed feelings
- **Skip Option**: Available
- **Accessibility**:
  - Emoji descriptions for screen readers
  - Keyboard navigation
  - Clear focus states

### 3. Journal Entry
- **Purpose**: Introduce journaling feature
- **Content**:
  - Simple text input
  - Optional entry
  - Supportive placeholder text
- **Skip Option**: Available
- **Accessibility**:
  - ARIA labels
  - Keyboard support
  - Clear input instructions

### 4. AI Introduction
- **Purpose**: Introduce Claude AI companion
- **Content**:
  - Brief explanation of Claude's role
  - Emphasis on support and listening
  - Clear next steps
- **Skip Option**: Available
- **Accessibility**:
  - Clear language
  - Screen reader optimized
  - Keyboard navigation

## Technical Implementation

### Database Fields
```typescript
interface User {
  isOnboarded: boolean;
  onboardingCompletedAt: Date | null;
  onboardingSteps: {
    steps: Array<{
      step: string;
      completedAt: string;
    }>;
  } | null;
}
```

### API Endpoints
- `POST /api/onboarding/complete`
  - Updates user onboarding status
  - Creates initial conversation with Claude
  - Returns conversation ID for redirection

### Component Structure
- `OnboardingFlow.tsx`: Main container component
- Step components:
  - `WelcomeStep`
  - `MoodStep`
  - `JournalStep`
  - `AIIntroStep`

## Localization
All text content is structured to support future localization:
- Step titles and descriptions
- Button labels
- Placeholder text
- AI messages

## Error Handling
- Graceful fallbacks for API failures
- Persistence of completed steps
- Clear error messages
- Option to retry failed steps

## Future Considerations
1. Progress indicators
2. Customizable steps based on user preferences
3. A/B testing for different flows
4. Analytics tracking
5. Offline support
6. Progressive enhancement 