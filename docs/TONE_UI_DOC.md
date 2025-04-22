# Tone Selector UI Documentation

## Component Structure

### ToneSelectorPreview.tsx
A React component that allows users to select and preview different conversation tones.

#### Features
- Three tone options: Supportive, Direct, and Curious
- Visual feedback for selected tone
- Smooth animations using Framer Motion
- Mobile-responsive design
- Accessibility support
- Analytics tracking

#### State Management
- Uses Zustand store (`useToneStore.ts`)
- Persists tone preference in localStorage
- Tracks tone selection events

#### Styling
- Tailwind CSS for styling
- Color-coded tone options
- Responsive grid layout
- Hover and focus states
- Smooth transitions

## Usage

```tsx
import { ToneSelectorPreview } from '../components/ToneSelectorPreview';

// In your component
<ToneSelectorPreview />
```

## Accessibility Features
- `aria-pressed` for selected state
- `aria-label` for screen readers
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure

## Analytics Events
- `tone.selected`: Triggered when a tone is selected
  - Properties: `{ tone: 'supportive' | 'direct' | 'curious' }`

## Design Guidelines
- Maintain consistent spacing
- Use rounded corners (rounded-lg)
- Implement smooth transitions
- Ensure sufficient color contrast
- Support both light and dark modes

## Mobile Considerations
- Single column layout on small screens
- Adequate touch targets
- Readable text at all sizes
- Maintain visual hierarchy 