# Reflection Feedback UI Documentation

## Overview
The `ReflectionFeedbackWidget` component provides users with a simple way to rate Claude's responses and optionally provide feedback. This helps improve the quality of reflections over time.

## Component Structure

### Props
```typescript
interface ReflectionFeedbackWidgetProps {
  onSubmit?: (rating: ReflectionRating) => Promise<void> | void;
}

interface ReflectionRating {
  rating: number;      // 1-5 star rating
  comment?: string;    // Optional feedback text
}
```

### Features
- 5-star rating system
- Optional text feedback
- Smooth animations
- Accessible design
- Mobile-responsive layout
- Confirmation state
- Loading state during submission

## Implementation Details

### State Management
```typescript
const [rating, setRating] = useState(0);
const [comment, setComment] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [hoverRating, setHoverRating] = useState(0);
const [focusedStar, setFocusedStar] = useState<number | null>(null);
```

### Animations
- Initial appearance: Fade in and slide up
- Rating hover: Smooth color transitions
- Submission: Loading spinner with "Submitting..." text
- Confirmation: Fade out form, fade in confirmation
- Confirmation: Checkmark animation

### Loading State
- Visual feedback during submission
- Disabled form fields
- Spinner animation
- Clear "Submitting..." text
- Error handling for failed submissions
- Automatic state reset on error

### Accessibility Implementation
- Radio group pattern for star rating
- Keyboard navigation support
- Focus management
- ARIA roles and attributes
- Screen reader announcements
- Visual feedback for all states
- Loading state announcements

### Keyboard Navigation
- Tab to navigate between stars
- Enter/Space to select rating
- Arrow keys for navigation (optional)
- Focus indicators visible
- Disabled state handling

### Screen Reader Support
- Clear labels for each star
- Rating announcements
- State changes announced
- Form instructions provided
- Loading state announcements
- Error state announcements

## Usage Example
```tsx
import { ReflectionFeedbackWidget } from '../components/ReflectionFeedbackWidget';

// In your component
<ReflectionFeedbackWidget
  onSubmit={async (rating) => {
    try {
      await api.submitFeedback(rating);
      // Success handled by component
    } catch (error) {
      // Error handled by component
    }
  }}
/>
```

## Design Guidelines
- Maintain consistent spacing
- Use rounded corners
- Implement smooth transitions
- Ensure sufficient contrast
- Support both light and dark modes
- Loading state should be subtle but clear
- Error states should be noticeable but not alarming

## Mobile Considerations
- Compact layout
- Adequate touch targets
- Responsive text sizes
- Optimized for small screens
- Loading state should be visible on all screen sizes

## Integration Notes
- Works with or without API integration
- Easy to extend with additional features
- Follows existing design system
- Maintains consistent styling
- Handles async operations gracefully

## Error Handling
- Form validation
- Network error states
- Loading states
- Fallback content
- Error recovery
- User feedback on failures

## Analytics Events
- `reflection.feedback.submitted`
  - Properties: `{ rating: number, hasComment: boolean }`
- `reflection.feedback.commented`
  - Properties: `{ rating: number, commentLength: number }`
- `reflection.feedback.error`
  - Properties: `{ error: string }` 