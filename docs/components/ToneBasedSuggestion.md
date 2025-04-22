# ToneBasedSuggestion Component

## Overview
The `ToneBasedSuggestion` component provides context-aware journaling prompts that adapt to the user's current tone and mood. It displays gentle, encouraging suggestions above the journal entry textarea.

## Features
- Dynamically adapts to user's tone (supportive, curious, direct)
- Responds to mood changes (anxious, sad, energized)
- Smooth transitions between suggestions
- Mobile-responsive design
- Accessible and keyboard-navigable

## Usage
```tsx
import { ToneBasedSuggestion } from '@/components/journal/ToneBasedSuggestion';

// In your journal entry component
<ToneBasedSuggestion className="custom-class" />
```

## Props
| Prop | Type | Description |
|------|------|-------------|
| className | string | Optional custom CSS classes |

## Context Dependencies
- `ToneContext`: Provides current tone setting
- `MoodContext`: Provides current mood state

## Mobile Layout
```tsx
// Mobile-first design
<div className="
  p-4 mb-4
  md:p-6 md:mb-6
  lg:p-8 lg:mb-8
">
  {/* Content */}
</div>
```

## UX Guidelines

### 1. Transitions
- Use smooth fade transitions (300ms)
- Avoid jarring changes
- Maintain visual consistency

### 2. Accessibility
- Sufficient color contrast
- Clear text hierarchy
- Screen reader friendly
- Keyboard navigation support

### 3. Responsive Design
- Mobile-first approach
- Fluid typography
- Flexible spacing
- Touch-friendly targets

### 4. Emotional Safety
- Non-prescriptive language
- Gentle encouragement
- Respect user autonomy
- Maintain boundaries

## Implementation Notes

### 1. Context Integration
```tsx
const { currentTone } = useToneContext();
const { currentMood } = useMoodContext();
```

### 2. Suggestion Structure
```tsx
const suggestions = {
  [tone]: {
    [mood]: [
      "Primary suggestion",
      "Secondary suggestion"
    ]
  }
};
```

### 3. Styling
```tsx
<div className={cn(
  "transition-all duration-300",
  "bg-background/50 rounded-lg",
  "border border-border/50",
  className
)}>
```

## Best Practices

### 1. Tone Adaptation
- Match user's emotional state
- Allow for natural transitions
- Maintain consistent presence
- Adapt to conversation flow

### 2. Content Guidelines
- Keep suggestions brief
- Use open-ended questions
- Avoid prescriptive language
- Focus on exploration

### 3. Performance
- Memoize suggestions
- Optimize transitions
- Lazy load when needed
- Monitor render cycles

### 4. Testing
- Test all tone/mood combinations
- Verify transitions
- Check accessibility
- Validate responsive design 