import * as React from 'react';
import { BaseInput, type BaseInputProps } from './BaseInput';

export interface NumberInputProps extends Omit<BaseInputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ min, max, step, precision, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Prevent non-numeric input
      if (
        !/[\d.-]/.test(e.key) &&
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (precision !== undefined) {
        const value = e.target.value;
        const decimalIndex = value.indexOf('.');
        if (decimalIndex !== -1 && value.length - decimalIndex - 1 > precision) {
          e.target.value = value.slice(0, decimalIndex + precision + 1);
        }
      }
    };

    return (
      <BaseInput
        type="number"
        min={min}
        max={max}
        step={step}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput }; 