import * as React from 'react';
import { BaseInput, type BaseInputProps } from './BaseInput';

export interface TextInputProps extends Omit<BaseInputProps, 'type'> {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = 'text', ...props }, ref) => {
    return <BaseInput type={type} ref={ref} {...props} />;
  }
);

TextInput.displayName = 'TextInput';

export { TextInput }; 