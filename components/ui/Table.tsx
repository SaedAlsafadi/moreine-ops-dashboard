import React from 'react'

export interface TableColumn<T extends Record<string, unknown> = Record<string, unknown>> {
  key: string
  label: string
  render?: (value: unknown, row: T, index: number) => React.ReactNode
  stickyHeader?: boolean
}

export interface TableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  /** Makes the thead sticky within the scroll container */
  stickyHeader?: boolean
}

function SkeletonRow({ colCount }: { colCount: number }) {
  return (
    <tr>
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded bg-[#9db090]/20" />
        </td>
      ))}
    </tr>
  )
}

export function Table<T extends Record<string, unknown> = Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available.',
  className = '',
  stickyHeader = false,
}: TableProps<T>) {
  return (
    <div className={['w-full overflow-x-auto rounded-xl shadow-sm', className].join(' ')}>
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        {/* ── Head ─────────────────────────────────────── */}
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  'border-b border-[#9db090]/30 bg-[#9db090]/15 px-4 py-3 text-left',
                  'text-xs font-semibold uppercase tracking-wider text-[#3d4a2e]',
                  // Rounded corners on first / last th
                  idx === 0 ? 'rounded-tl-xl' : '',
                  idx === columns.length - 1 ? 'rounded-tr-xl' : '',
                  stickyHeader ? 'sticky top-0 z-10' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ─────────────────────────────────────── */}
        <tbody className="bg-[#ece7d4]">
          {loading ? (
            // Show 5 skeleton rows while loading
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} colCount={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-[#3d4a2e]/50"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="group transition-colors duration-100 hover:bg-[#9db090]/10"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={[
                      'border-b border-[#9db090]/20 px-4 py-3 text-[#3d4a2e]',
                      // Bottom-left / bottom-right rounding on last row
                      rowIdx === data.length - 1 && colIdx === 0
                        ? 'rounded-bl-xl'
                        : '',
                      rowIdx === data.length - 1 && colIdx === columns.length - 1
                        ? 'rounded-br-xl'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {col.render
                      ? col.render(row[col.key], row, rowIdx)
                      : (row[col.key] as React.ReactNode) ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
