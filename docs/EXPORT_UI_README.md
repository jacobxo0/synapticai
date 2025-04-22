# Export Report UI Documentation

## Overview
The `ExportReportPanel` component provides a user-friendly interface for generating and previewing insight reports. It allows users to customize their report by selecting time ranges, sections, and output format.

## Features
- Time range selection with date picker
- Section toggles (mood, goals, reflections)
- Format selection (PDF/HTML)
- File size estimation
- Preview and export functionality
- Mobile-responsive design
- Loading states and error handling
- Privacy-focused messaging

## Usage

```tsx
import { ExportReportPanel } from '@/components/export/ExportReportPanel';

const MyComponent = () => {
  const handleExport = async (options) => {
    // Handle export logic
    const { format, sections, startDate, endDate } = options;
    // ... export implementation
  };

  const handlePreview = async (options) => {
    // Handle preview logic
    const { format, sections, startDate, endDate } = options;
    // ... preview implementation
  };

  return (
    <ExportReportPanel
      onExport={handleExport}
      onPreview={handlePreview}
      className="max-w-2xl mx-auto"
    />
  );
};
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `onExport` | `(options: ExportOptions) => Promise<void>` | Callback for export action |
| `onPreview` | `(options: ExportOptions) => Promise<void>` | Callback for preview action |
| `className` | `string` | Additional CSS classes |

### ExportOptions
```typescript
interface ExportOptions {
  format: 'pdf' | 'html';
  sections: ('mood' | 'goals' | 'reflections')[];
  startDate: Date;
  endDate: Date;
}
```

## Mobile Considerations

### Layout
- Stacked buttons on mobile
- Full-width date picker
- Touch-friendly checkboxes and radio buttons
- Adequate spacing for touch targets

### Performance
- Lazy loading of date picker
- Optimized animations
- Minimal re-renders

### Accessibility
- Clear focus states
- Proper ARIA labels
- High contrast text
- Readable font sizes

## Best Practices

1. **Error Handling**
   - Show clear error messages
   - Provide retry options
   - Maintain state on error

2. **Loading States**
   - Show loading indicators
   - Disable interactive elements
   - Provide progress feedback

3. **Privacy**
   - Clear data handling information
   - Link to privacy policy
   - Secure data transmission

4. **User Experience**
   - Default to common selections
   - Provide size estimates
   - Clear success/error feedback

## Example Implementations

### Basic Usage
```tsx
<ExportReportPanel
  onExport={async (options) => {
    // Handle export
  }}
  onPreview={async (options) => {
    // Handle preview
  }}
/>
```

### With Custom Styling
```tsx
<ExportReportPanel
  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg"
  onExport={handleExport}
  onPreview={handlePreview}
/>
```

### With Error Handling
```tsx
const handleExport = async (options) => {
  try {
    await exportReport(options);
    showSuccess('Report exported successfully');
  } catch (error) {
    showError('Failed to export report. Please try again.');
  }
};
```

## Security Considerations

1. **Data Protection**
   - Validate date ranges
   - Sanitize user inputs
   - Secure API endpoints

2. **Privacy**
   - Clear data usage policies
   - Secure data transmission
   - User consent for data processing

3. **Access Control**
   - Authentication checks
   - Rate limiting
   - Session validation

## Future Enhancements

1. **Features**
   - Custom report templates
   - Scheduled exports
   - Export history
   - Batch exports

2. **UI Improvements**
   - Drag-and-drop section ordering
   - Custom section naming
   - Advanced formatting options
   - Export presets

3. **Performance**
   - Progressive loading
   - Caching
   - Background processing 