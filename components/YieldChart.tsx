'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'

export interface YieldDataPoint {
  roast_date: string
  yield_pct: number
  lot_name?: string
}

export interface YieldChartProps {
  data: YieldDataPoint[]
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null

  const point = payload[0]
  const yieldVal = point?.value as number | undefined

  return (
    <div className="rounded-lg border border-[#9db090]/40 bg-[#ece7d4] px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-semibold text-[#3d4a2e]">{label}</p>
      {yieldVal !== undefined && (
        <p className="text-sm text-[#3d4a2e]">
          Yield:{' '}
          <span className="font-bold text-[#9db090]">{yieldVal.toFixed(1)}%</span>
        </p>
      )}
      {point?.payload?.lot_name && (
        <p className="mt-0.5 text-xs text-[#3d4a2e]/60">
          Lot: {point.payload.lot_name}
        </p>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function YieldChart({ data }: YieldChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl bg-[#ece7d4] text-sm text-[#3d4a2e]/50">
        No data available
      </div>
    )
  }

  // Take last 10 batches
  const chartData = data.slice(-10).map((d) => ({
    ...d,
    // Format the date label for display
    date: new Date(d.roast_date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    }),
  }))

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          {/* Light olive grid lines */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#9db090"
            strokeOpacity={0.25}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#3d4a2e', opacity: 0.65 }}
            tickLine={false}
            axisLine={{ stroke: '#9db090', strokeOpacity: 0.3 }}
          />

          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: '#3d4a2e', opacity: 0.65 }}
            tickLine={false}
            axisLine={false}
            width={42}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="yield_pct"
            stroke="#9db090"
            strokeWidth={2.5}
            dot={{
              r: 4,
              fill: '#ece7d4',
              stroke: '#9db090',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: '#9db090',
              stroke: '#ece7d4',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default YieldChart
