import * as React from 'react';
import { BaseInput, type BaseInputProps } from './BaseInput';
import { Calendar } from 'lucide-react';

export interface DatePickerProps extends Omit<BaseInputProps, 'type'> {
  minDate?: string;
  maxDate?: string;
  showIcon?: boolean;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ minDate, maxDate, showIcon = true, className, ...props }, ref) => {
    return (
      <div className="relative">
        <BaseInput
          type="date"
          min={minDate}
          max={maxDate}
          className={cn(showIcon && 'pr-10', className)}
          ref={ref}
          {...props}
        />
        {showIcon && (
          <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker }; 