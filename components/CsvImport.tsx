'use client'

import React, { useRef, useState } from 'react'
import Papa from 'papaparse'
import { Button } from './ui/Button'

export interface CsvImportProps {
  onImport: (rows: Record<string, string>[]) => void
  label?: string
  expectedColumns?: string[]
  className?: string
}

export function CsvImport({
  onImport,
  label = 'Import CSV',
  expectedColumns,
  className = '',
}: CsvImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function resetInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    setSuccess(null)

    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete(results) {
        if (results.errors && results.errors.length > 0) {
          const firstErr = results.errors[0]
          setError(`Parse error: ${firstErr.message} (row ${firstErr.row ?? '?'})`)
          resetInput()
          return
        }

        // Filter out completely blank rows (all values are empty strings)
        const cleaned = (results.data as Record<string, string>[])
          .filter((row) =>
            Object.values(row).some((v) => v !== null && v !== undefined && String(v).trim() !== ''),
          )
          .map((row) => {
            // Trim whitespace from all values
            const trimmed: Record<string, string> = {}
            for (const [key, val] of Object.entries(row)) {
              trimmed[key.trim()] = val != null ? String(val).trim() : ''
            }
            return trimmed
          })

        if (cleaned.length === 0) {
          setError('The CSV file appears to be empty or contains only blank rows.')
          resetInput()
          return
        }

        setSuccess(`Imported ${cleaned.length} row${cleaned.length !== 1 ? 's' : ''} successfully.`)
        onImport(cleaned)
        resetInput()
      },
      error(err) {
        setError(`Failed to read file: ${err.message}`)
        resetInput()
      },
    })
  }

  function handleButtonClick() {
    setError(null)
    setSuccess(null)
    fileInputRef.current?.click()
  }

  return (
    <div className={['inline-flex flex-col gap-1', className].join(' ')}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
        aria-label="CSV file input"
      />

      {/* Trigger button */}
      <Button variant="secondary" size="sm" onClick={handleButtonClick} type="button">
        {/* Upload icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {label}
      </Button>

      {/* Expected columns hint */}
      {expectedColumns && expectedColumns.length > 0 && (
        <p className="text-xs text-[#3d4a2e]/50">
          Expected columns:{' '}
          <span className="font-mono">{expectedColumns.join(', ')}</span>
        </p>
      )}

      {/* Error toast */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Success toast */}
      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </div>
      )}
    </div>
  )
}

export default CsvImport
