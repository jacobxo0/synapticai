# Journal AI UI Documentation

## Adaptive Response Preview Component

### Overview
The `AdaptiveResponsePreview` component provides users with a preview of how Claude might respond to their journal entry based on their current mood and selected tone. This increases transparency and helps users understand how their input affects the AI's responses.

### Component Structure

#### Props
```typescript
interface AdaptiveResponsePreviewProps {
  mood: number;        // 1-10 mood scale
  entry: string;       // Journal entry text
  onRefresh?: () => void; // Optional refresh handler
}
```

#### Features
- Dynamic response generation based on:
  - Current tone (supportive/direct/curious)
  - Mood level (high/medium/low)
  - Pre-defined response templates
- Smooth fade-in animation
- Refresh button for new previews
- Info tooltip explaining preview logic
- Mobile-responsive design

### Response Logic

#### Mood Categories
- High (7-10): Positive, uplifting responses
- Medium (4-6): Balanced, exploratory responses
- Low (1-3): Supportive, understanding responses

#### Tone Variations
1. **Supportive**
   - High: Encouraging and celebratory
   - Medium: Empathetic and understanding
   - Low: Comforting and validating

2. **Direct**
   - High: Action-oriented and goal-focused
   - Medium: Structured and analytical
   - Low: Solution-focused and practical

3. **Curious**
   - High: Insight-seeking and reflective
   - Medium: Exploratory and connecting
   - Low: Perspective-shifting and reframing

### Usage Example
```tsx
import { AdaptiveResponsePreview } from '../components/AdaptiveResponsePreview';

// In your component
<AdaptiveResponsePreview
  mood={8}
  entry="Today was a great day! I finally completed my project."
  onRefresh={() => console.log('Refreshing preview')}
/>
```

### Design Guidelines
- Maintain consistent spacing and padding
- Use subtle animations for state changes
- Ensure clear visual hierarchy
- Provide adequate contrast for readability
- Support both light and dark modes

### Accessibility
- Clear labeling of preview nature
- Keyboard navigation support
- Screen reader friendly structure
- Proper ARIA attributes
- Focus management

### Integration Notes
- Uses Zustand for tone state management
- No actual API calls (preview only)
- Easily extensible response templates
- Maintains consistent styling with chat interface 