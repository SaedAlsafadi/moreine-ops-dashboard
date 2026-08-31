'use client'

import React from 'react'
import { Button } from './ui/Button'

export interface CsvExportProps {
  data: Record<string, unknown>[]
  filename: string
  label?: string
  className?: string
}

function convertToCsv(data: Record<string, unknown>[]): string {
  const keys = Object.keys(data[0])
  const csvRows = [
    keys.join(','),
    ...data.map((row) =>
      keys
        .map((k) => {
          const val = row[k] ?? ''
          const str = String(val).replace(/"/g, '""')
          return `"${str}"`
        })
        .join(','),
    ),
  ]
  return csvRows.join('\n')
}

export function CsvExport({
  data,
  filename,
  label = 'Export CSV',
  className = '',
}: CsvExportProps) {
  const isEmpty = !data || data.length === 0

  function handleExport() {
    if (isEmpty) return

    const csv = convertToCsv(data)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleExport}
      disabled={isEmpty}
      title={isEmpty ? 'No data to export' : `Export ${data.length} rows to CSV`}
      className={className}
    >
      {/* Download icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      {label}
    </Button>
  )
}

export default CsvExport
