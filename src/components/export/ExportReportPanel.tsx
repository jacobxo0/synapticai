import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { SpinnerIcon } from '@/components/icons/SpinnerIcon';
import { DownloadIcon } from '@/components/icons/DownloadIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/format';

export type ReportFormat = 'pdf' | 'html';
export type ReportSection = 'mood' | 'goals' | 'reflections';

interface ExportReportPanelProps {
  onExport: (options: {
    format: ReportFormat;
    sections: ReportSection[];
    startDate: Date;
    endDate: Date;
  }) => Promise<void>;
  onPreview: (options: {
    format: ReportFormat;
    sections: ReportSection[];
    startDate: Date;
    endDate: Date;
  }) => Promise<void>;
  className?: string;
}

export const ExportReportPanel = ({
  onExport,
  onPreview,
  className,
}: ExportReportPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState<ReportFormat>('pdf');
  const [sections, setSections] = useState<ReportSection[]>(['mood', 'goals', 'reflections']);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });

  const handleSectionToggle = (section: ReportSection) => {
    setSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      await onExport({
        format,
        sections,
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    setIsLoading(true);
    try {
      await onPreview({
        format,
        sections,
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Estimate file size based on selected options
  const estimatedSize = formatBytes(
    sections.length * 100 * 1024 + // Base size per section
    (dateRange.end.getTime() - dateRange.start.getTime()) / (24 * 60 * 60 * 1000) * 50 * 1024 // Additional size per day
  );

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Export Insight Report</h2>
        <p className="text-muted-foreground">
          Create a personalized report of your journey. Your data is always private and secure.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Time Range</h3>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-full"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Include Sections</h3>
          <div className="space-y-2">
            {(['mood', 'goals', 'reflections'] as const).map((section) => (
              <div key={section} className="flex items-center space-x-2">
                <Checkbox
                  id={section}
                  checked={sections.includes(section)}
                  onCheckedChange={() => handleSectionToggle(section)}
                />
                <label
                  htmlFor={section}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Format</h3>
          <RadioGroup
            value={format}
            onValueChange={(value) => setFormat(value as ReportFormat)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <label htmlFor="pdf" className="text-sm font-medium">
                PDF
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="html" id="html" />
              <label htmlFor="html" className="text-sm font-medium">
                HTML
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <ShieldIcon className="h-4 w-4" />
          <span>Estimated size: {estimatedSize}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleExport}
          disabled={isLoading || sections.length === 0}
          className="flex-1"
        >
          {isLoading ? (
            <SpinnerIcon className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <DownloadIcon className="h-4 w-4 mr-2" />
          )}
          Export Report
        </Button>
        <Button
          variant="outline"
          onClick={handlePreview}
          disabled={isLoading || sections.length === 0}
          className="flex-1"
        >
          {isLoading ? (
            <SpinnerIcon className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <EyeIcon className="h-4 w-4 mr-2" />
          )}
          Preview
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          Your data is processed securely and never shared. Read our{' '}
          <a
            href="/privacy"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy guide
          </a>{' '}
          to learn more.
        </p>
      </div>
    </Card>
  );
}; 