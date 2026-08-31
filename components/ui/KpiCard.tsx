import React from 'react'

export interface KpiCardProps {
  title: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  alert?: boolean
  subtitle?: string
  className?: string
}

export function KpiCard({
  title,
  value,
  unit,
  icon,
  alert = false,
  subtitle,
  className = '',
}: KpiCardProps) {
  return (
    <div
      className={[
        // Base card styles
        'relative flex flex-col gap-2 rounded-xl bg-[#ece7d4] px-5 py-4 shadow-sm',
        // Left border accent
        'border-l-4',
        // Alert state switches border colour
        alert ? 'border-l-orange-400' : 'border-l-[#9db090]',
        // Optional orange ring when alert
        alert ? 'ring-1 ring-orange-300' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header row: title + icon */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#3d4a2e]/60">
          {title}
        </p>
        {icon && (
          <span className="flex-shrink-0 text-[#9db090]" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Value row */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold leading-none text-[#3d4a2e]">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[#3d4a2e]/60">{unit}</span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs text-[#3d4a2e]/50">{subtitle}</p>
      )}

      {/* Alert indicator dot */}
      {alert && (
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-orange-400" />
      )}
    </div>
  )
}

export default KpiCard
