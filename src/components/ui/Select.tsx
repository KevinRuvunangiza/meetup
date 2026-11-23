/**
 * SELECT COMPONENT
 * Styled native <select>. Using native select (not custom) because:
 *   • Zero JS, works with slow connections
 *   • Native mobile pickers are familiar and fast on Android
 *   • Custom dropdowns add complexity and accessibility risk
 */
import { type SelectHTMLAttributes, useId } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  placeholder?: string
  options: { value: string; label: string }[]
  hideLabel?: boolean
}

export function Select({
  label,
  error,
  placeholder,
  options,
  hideLabel = false,
  id: externalId,
  className = '',
  ...props
}: SelectProps) {
  const generatedId = useId()
  const id = externalId ?? generatedId
  const errorId = `${id}-error`

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
        <select
          id={id}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? 'true' : undefined}
          className={[
            'w-full appearance-none rounded-lg border bg-white px-4 py-3 pr-10 text-base',
            'transition-colors duration-150 min-h-[44px]',
            // Gray text for placeholder (unselected)
            props.value === '' ? 'text-muted' : 'text-ink',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-border focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        >
          ▾
        </span>
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
