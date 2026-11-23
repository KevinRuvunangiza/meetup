/**
 * INPUT COMPONENT
 * Text, email, tel, url inputs.
 * Always includes a visible label (never label-less for accessibility).
 * Error message is linked via aria-describedby.
 */
import { type InputHTMLAttributes, type ReactNode, useId } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  hideLabel?: boolean
  suffix?: ReactNode  // e.g. a flag emoji for phone
}

export function Input({
  label,
  error,
  hint,
  hideLabel = false,
  suffix,
  className = '',
  id: externalId,
  ...props
}: InputProps) {
  const generatedId = useId()
  const id = externalId ?? generatedId
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedBy = [error ? errorId : '', hint ? hintId : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={hideLabel ? 'sr-only' : 'text-sm font-medium text-ink'}
      >
        {label}
        {props.required && (
          <span className="ml-1 text-muted" aria-hidden="true">*</span>
        )}
      </label>

      <div className="relative">
        <input
          id={id}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? 'true' : undefined}
          className={[
            'w-full rounded-lg border bg-white px-4 py-3 text-base text-ink',
            'placeholder:text-muted',
            'transition-colors duration-150',
            'min-h-[44px]',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-border focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10',
            suffix ? 'pr-12' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
            {suffix}
          </span>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
