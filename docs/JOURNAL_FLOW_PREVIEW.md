# Journal Flow Preview Documentation

## Overview
The journal flow now integrates tone selection and response preview capabilities, providing users with a transparent view of how Claude might respond to their entries based on their mood and selected tone.

## Flow Structure

### 1. Tone Selection
- `ToneSelectorPreview` component displayed at the top
- Allows users to choose between supportive, direct, or curious tones
- Persists selection via Zustand store
- Mobile-responsive grid layout

### 2. Journal Entry
- Mood slider (1-10 scale)
- Text area for journal entry
- Submit button with loading state
- Form validation and error handling

### 3. Response Preview
- Appears after entry submission
- Shows how Claude might begin responding
- Includes refresh option for new previews
- Smooth fade-in animation
- Clear labeling as a preview

## Component Integration

### State Management
```typescript
// Journal entry state
interface JournalEntry {
  content: string;
  mood: number;
  timestamp: string;
}

// Tone state (from Zustand)
const { currentTone } = useToneStore();
```

### Analytics Events
1. `journal.entry.submitted`
   - Properties: `{ mood: number, tone: string }`
   - Triggered on form submission

2. `reflection.preview.rendered`
   - Triggered when preview is refreshed
   - No additional properties

## Mobile Considerations
- Single-column layout on small screens
- Adequate spacing for touch targets
- Responsive text sizes
- Collapsible sections where appropriate

## Accessibility Features
- Proper form labels
- ARIA attributes for interactive elements
- Keyboard navigation support
- Screen reader friendly structure
- Focus management

## Animation Details
- Page load: Fade in and slide up
- Form submission: Smooth transition
- Preview appearance: Fade in with slight delay
- Component updates: Subtle transitions

## Error Handling
- Form validation
- Network error states
- Loading states
- Fallback content for preview

## Integration Notes
- Works with or without Claude integration
- Maintains consistent styling
- Easy to extend with new features
- Follows existing design system 