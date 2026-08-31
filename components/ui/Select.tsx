import React from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  label?: string
  error?: string
  required?: boolean
  placeholder?: string
  wrapperClassName?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      error,
      required,
      placeholder,
      id,
      className = '',
      wrapperClassName = '',
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={['flex flex-col', wrapperClassName].join(' ')}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1 block text-sm font-medium text-[#3d4a2e]"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={[
              'w-full appearance-none rounded-md border border-[#9db090]/50 bg-[#ece7d4] px-3 py-2 pr-8',
              'text-sm text-[#3d4a2e]',
              'transition-colors duration-150',
              'focus:outline-none focus:border-[#3d4a2e] focus:ring-2 focus:ring-[#3d4a2e]/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'cursor-pointer',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : '',
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

          {/* Custom chevron icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-4 w-4 text-[#3d4a2e]/60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1 text-xs text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'

export default Select
