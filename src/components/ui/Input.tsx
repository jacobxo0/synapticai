import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  required?: boolean
  hideLabel?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = true,
      id,
      required,
      hideLabel,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error
    const labelText = label || ariaLabel

    if (!labelText) {
      console.warn('Input component should have either a label or aria-label for accessibility')
    }

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {labelText && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-gray-700 dark:text-gray-300',
              hideLabel && 'sr-only'
            )}
          >
            {labelText}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'px-3 py-2 rounded-md border transition-colors',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            'border-gray-300 dark:border-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            hasError && 'border-red-500 focus:ring-red-500',
            fullWidth && 'w-full',
            className
          )}
          {...(hasError ? { 'aria-invalid': 'true' } : { 'aria-invalid': 'false' })}
          {...(required ? { 'aria-required': 'true' } : { 'aria-required': 'false' })}
          data-invalid={hasError}
          data-required={required}
          aria-describedby={
            [
              hasError && `${inputId}-error`,
              helperText && !hasError && `${inputId}-helper`
            ].filter(Boolean).join(' ') || undefined
          }
          required={required}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-500"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input } 