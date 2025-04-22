# Feature Dependencies Documentation

## Installed Packages

### Recharts (v2.15.2)
A composable charting library built on React components.

```typescript
// Example usage in MoodChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { date: '2024-01-01', mood: 5 },
  { date: '2024-01-02', mood: 4 },
  // ... more data
];

<LineChart width={500} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="mood" stroke="#8884d8" />
</LineChart>
```

### Day.js (v1.11.13)
A lightweight date library alternative to Moment.js.

```typescript
// Example usage in StreakTracker.tsx
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Format dates
const formattedDate = dayjs(date).format('MMM D, YYYY');

// Calculate time differences
const daysSinceLastEntry = dayjs().diff(dayjs(lastEntryDate), 'day');
```

### Zustand (v5.0.3)
A small, fast and scalable state-management solution.

```typescript
// Example store for tone settings
import { create } from 'zustand';

interface ToneState {
  currentTone: string;
  setTone: (tone: string) => void;
}

const useToneStore = create<ToneState>((set) => ({
  currentTone: 'friendly',
  setTone: (tone) => set({ currentTone: tone }),
}));

// Usage in components
const { currentTone, setTone } = useToneStore();
```

## Version Information
- Recharts: 2.15.2
- Day.js: 1.11.13
- Zustand: 5.0.3

## Notes
- All packages are compatible with React 18+
- Recharts requires peer dependencies of React and React DOM
- Day.js is tree-shakeable and has a small bundle size
- Zustand is optional but recommended for complex state management 