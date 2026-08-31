import React from 'react'

export interface TableColumn<T> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export function Table<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex flex-col rounded-xl bg-white p-6 shadow-horizon-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-full rounded bg-light"></div>
          <div className="h-4 w-full rounded bg-light"></div>
          <div className="h-4 w-3/4 rounded bg-light"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-horizon-sm p-4">
      <table className="w-full min-w-max text-start">
        <thead>
          <tr className="border-b border-light">
            {columns.map((col) => (
              <th
                key={col.key}
                className="pb-3 pt-4 px-4 text-start text-xs font-bold text-olive/60 uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-sm text-olive/50"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-light/50 transition-colors hover:bg-light/30 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="py-4 px-4 text-sm font-semibold text-charcoal"
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
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
