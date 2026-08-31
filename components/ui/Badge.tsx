import React from 'react'

export type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'sage'

export interface BadgeProps {
  label: string
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300',
  yellow: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300',
  red: 'bg-red-100 text-red-700 ring-1 ring-red-300',
  blue: 'bg-sky-100 text-sky-700 ring-1 ring-sky-300',
  gray: 'bg-gray-100 text-gray-600 ring-1 ring-gray-300',
  sage: 'bg-[#9db090]/20 text-[#3d4a2e] ring-1 ring-[#9db090]/50',
}

export function Badge({ label, variant = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  )
}

export default Badge
