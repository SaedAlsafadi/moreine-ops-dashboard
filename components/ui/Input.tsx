import React from 'react'

// ─── Shared styles ────────────────────────────────────────────────────────────

const baseFieldClasses = [
  'w-full rounded-md border border-[#9db090]/50 bg-[#ece7d4] px-3 py-2',
  'text-sm text-[#3d4a2e] placeholder:text-[#3d4a2e]/50',
  'transition-colors duration-150',
  'focus:outline-none focus:border-[#3d4a2e] focus:ring-2 focus:ring-[#3d4a2e]/20',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ')

const errorFieldClasses = 'border-red-500 focus:border-red-500 focus:ring-red-200'

// ─── Label helper ─────────────────────────────────────────────────────────────

interface LabelProps {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
}

function FieldLabel({ htmlFor, required, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-sm font-medium text-[#3d4a2e]"
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  )
}

// ─── Error message helper ──────────────────────────────────────────────────────

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1 text-xs text-red-600" role="alert">
      {message}
    </p>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  required?: boolean
  wrapperClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      required,
      id,
      className = '',
      wrapperClassName = '',
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={['flex flex-col', wrapperClassName].join(' ')}>
        {label && (
          <FieldLabel htmlFor={inputId} required={required}>
            {label}
          </FieldLabel>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={[
            baseFieldClasses,
            error ? errorFieldClasses : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <FieldError message={error} />}
      </div>
    )
  },
)

Input.displayName = 'Input'

// ─── Textarea ─────────────────────────────────────────────────────────────────

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  required?: boolean
  wrapperClassName?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      required,
      id,
      className = '',
      wrapperClassName = '',
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={['flex flex-col', wrapperClassName].join(' ')}>
        {label && (
          <FieldLabel htmlFor={textareaId} required={required}>
            {label}
          </FieldLabel>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={[
            baseFieldClasses,
            'resize-y min-h-[80px]',
            error ? errorFieldClasses : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error && <FieldError message={error} />}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'

export default Input
