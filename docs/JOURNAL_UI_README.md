# Journal Interface Documentation

## Overview
This document describes the tone-aware journaling interface that adapts to user mood and provides contextual writing prompts.

## Components

### 1. ToneBasedSuggestion

A component that displays rotating journal prompts based on current mood and tone.

#### Props
```typescript
interface ToneBasedSuggestionProps {
  tone: JournalTone;
  className?: string;
}

interface JournalTone {
  tone: 'supportive' | 'reflective' | 'encouraging' | 'analytical';
  mood: number;      // 1-5 scale
  prompts: string[]; // Array of contextual prompts
}
```

#### Features
- Rotating prompts (8s interval)
- Mood-based styling
- Smooth transitions
- Interactive prompt navigation
- Accessibility support
- Dark mode compatible

#### Usage
```tsx
import { ToneBasedSuggestion } from '../components/journal/ToneBasedSuggestion';

const tone: JournalTone = {
  tone: 'supportive',
  mood: 4,
  prompts: [
    'What brought you joy today?',
    'How did you handle challenges?',
    'What are you grateful for?'
  ]
};

<ToneBasedSuggestion tone={tone} />
```

### 2. JournalEntryScreen

The main journal entry interface that combines tone-based suggestions with the writing area.

#### Props
```typescript
interface JournalEntryScreenProps {
  initialContent?: string;
  tone: JournalTone;
  onContentChange?: (content: string) => void;
  onSave?: () => void;
  className?: string;
}
```

#### Features
- Adaptive tone suggestions
- Focus-aware UI
- Keyboard shortcuts
- Responsive design
- Smooth animations
- Accessibility support

#### Usage
```tsx
import { JournalEntryScreen } from '../components/journal/JournalEntryScreen';

<JournalEntryScreen
  tone={tone}
  onContentChange={(content) => console.log(content)}
  onSave={() => console.log('Saved')}
/>
```

## Design Guidelines

### Tone Styles
- Supportive: Blue theme
- Reflective: Purple theme
- Encouraging: Green theme
- Analytical: Gray theme

### Animations
- Subtle fade-in/out
- Smooth transitions
- Non-distracting
- Performance optimized

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode

### Mobile Considerations
- Touch-friendly targets
- Responsive layout
- Readable text sizes
- Optimized performance

## Implementation Notes

### Tone Selection
```typescript
// Example tone selection based on mood
const getToneForMood = (mood: number): JournalTone => {
  if (mood <= 2) return {
    tone: 'supportive',
    mood,
    prompts: [
      'What's on your mind?',
      'How can we work through this?',
      'What would help you feel better?'
    ]
  };
  // ... other mood-based tones
};
```

### Prompt Rotation
- Automatic rotation every 8 seconds
- Manual navigation via dots
- Smooth transitions
- State preservation

### Focus States
- Suggestion opacity reduces on focus
- Textarea highlights on focus
- Save button enables with content
- Keyboard shortcuts active

## Examples

### Basic Usage
```tsx
import { JournalEntryScreen } from '../components/journal/JournalEntryScreen';

const App = () => {
  const tone: JournalTone = {
    tone: 'reflective',
    mood: 4,
    prompts: [
      'What went well today?',
      'What could have gone better?',
      'What did you learn?'
    ]
  };

  return (
    <JournalEntryScreen
      tone={tone}
      onSave={() => console.log('Entry saved')}
    />
  );
};
```

### Custom Styling
```tsx
<JournalEntryScreen
  tone={tone}
  className="max-w-2xl mx-auto p-4"
/>
```

## Best Practices

1. Tone Selection
   - Match tone to mood
   - Consider recent patterns
   - Avoid triggering content
   - Maintain consistency

2. Prompt Design
   - Keep prompts open-ended
   - Use encouraging language
   - Avoid prescriptive wording
   - Consider cultural context

3. Accessibility
   - Provide clear labels
   - Support keyboard nav
   - Ensure color contrast
   - Test with screen readers

4. Mobile
   - Optimize touch targets
   - Handle orientation
   - Consider data entry
   - Test performance

## Troubleshooting

### Common Issues
1. Tone not updating
   - Check mood data
   - Verify tone selection
   - Inspect state updates

2. Performance issues
   - Check animation frames
   - Profile render cycles
   - Optimize transitions

3. Styling problems
   - Verify theme setup
   - Check dark mode
   - Inspect responsive classes

### Support
For issues or questions:
1. Check documentation
2. Review examples
3. Contact frontend team 