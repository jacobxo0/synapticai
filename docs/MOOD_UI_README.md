# Mood Visualization Components

## Overview
This document describes the mood visualization components used in MindMate to display mood patterns over time.

## Components

### 1. MoodTimelineChart

A responsive chart component that visualizes mood patterns over time using Recharts.

#### Props
```typescript
interface MoodTimelineChartProps {
  data: MoodPattern[];
  className?: string;
}

interface MoodPattern {
  period: string;
  mood: number;      // 1-5 scale
  volatility: number; // 0-1 scale
  trend: 'up' | 'down' | 'stable';
}
```

#### Features
- Responsive design
- Interactive tooltips
- Mood emoji indicators
- Volatility display
- Empty state handling
- Dark mode support
- Smooth animations
- Mobile-friendly

#### Usage
```tsx
import { MoodTimelineChart } from '../components/MoodTimelineChart';

const moodData: MoodPattern[] = [
  {
    period: '2023-01-01',
    mood: 4,
    volatility: 0.2,
    trend: 'up'
  },
  // ... more data points
];

<MoodTimelineChart data={moodData} />
```

### 2. MoodIcon

A reusable component that displays mood emojis based on mood level.

#### Props
```typescript
interface MoodIconProps {
  mood: number;      // 1-5 scale
  className?: string;
}
```

#### Mood Levels
1. 😢 Very Low
2. 😔 Low
3. 😐 Neutral
4. 🙂 Good
5. 😊 Great

#### Usage
```tsx
import { MoodIcon } from '../components/icons/MoodIcon';

<MoodIcon mood={4} className="w-6 h-6" />
```

## Design Guidelines

### Color Scheme
- Uses neutral, calming colors
- Avoids triggering color associations
- Supports both light and dark modes
- Maintains sufficient contrast

### Animations
- Subtle fade-in on mount
- Smooth hover transitions
- Non-distracting interactions
- Performance optimized

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatible
- Clear visual hierarchy

### Mobile Considerations
- Responsive layout
- Touch-friendly targets
- Readable text sizes
- Optimized performance

## Implementation Notes

### Data Structure
```typescript
interface MoodPattern {
  period: string;    // ISO date string
  mood: number;      // 1-5 scale
  volatility: number; // 0-1 scale
  trend: 'up' | 'down' | 'stable';
}
```

### Styling
- Uses Tailwind CSS for styling
- Custom utility classes for consistency
- Theme-aware color system
- Responsive design patterns

### Performance
- Memoized components
- Optimized re-renders
- Lazy loading support
- Efficient animations

## Examples

### Basic Usage
```tsx
import { MoodTimelineChart } from '../components/MoodTimelineChart';

const App = () => {
  const moodData = [
    {
      period: '2023-01-01',
      mood: 4,
      volatility: 0.2,
      trend: 'up'
    },
    // ... more data points
  ];

  return <MoodTimelineChart data={moodData} />;
};
```

### Custom Styling
```tsx
<MoodTimelineChart
  data={moodData}
  className="h-96 border rounded-lg p-4"
/>
```

### Empty State
```tsx
<MoodTimelineChart data={[]} />
// Shows a centered message with neutral mood icon
```

## Best Practices

1. Data Handling
   - Validate mood values (1-5)
   - Handle missing data gracefully
   - Sort data by period
   - Normalize volatility values

2. Performance
   - Memoize data transformations
   - Use efficient rendering
   - Optimize animations
   - Handle large datasets

3. Accessibility
   - Provide alt text
   - Support keyboard nav
   - Ensure color contrast
   - Test with screen readers

4. Mobile
   - Test touch interactions
   - Optimize for small screens
   - Handle orientation changes
   - Consider data density

## Troubleshooting

### Common Issues
1. Chart not rendering
   - Check data format
   - Verify Recharts import
   - Inspect console errors

2. Performance issues
   - Check data size
   - Profile render cycles
   - Optimize animations

3. Styling problems
   - Verify Tailwind setup
   - Check dark mode
   - Inspect responsive classes

### Support
For issues or questions, please:
1. Check the documentation
2. Review example code
3. Contact the frontend team 