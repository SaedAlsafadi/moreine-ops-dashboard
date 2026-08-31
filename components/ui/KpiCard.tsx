import React from 'react'

export interface KpiCardProps {
  title: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  subtitle?: string
  alert?: boolean
}

export function KpiCard({
  title,
  value,
  unit,
  icon,
  subtitle,
  alert = false,
}: KpiCardProps) {
  return (
    <div className={`relative flex flex-row items-center rounded-xl bg-white p-4 shadow-horizon-sm transition-shadow hover:shadow-horizon ${alert ? 'border-2 border-red-400' : ''}`}>
      {/* Optional Alert Dot */}
      {alert && (
        <span className="absolute right-3 top-3 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
        </span>
      )}

      {/* Icon Circle */}
      {icon && (
        <div className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-full bg-light text-sage me-4">
          {icon}
        </div>
      )}

      {/* Text Content */}
      <div className="flex flex-col">
        <p className="text-sm font-medium text-olive/60">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-olive">{value}</h3>
          {unit && <span className="text-sm font-semibold text-olive/70">{unit}</span>}
        </div>
        {subtitle && <p className="mt-1 text-xs text-olive/50">{subtitle}</p>}
      </div>
    </div>
  )
}

export default KpiCard
