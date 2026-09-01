'use client'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, TableRow, TableCell } from '@/components/ui/Table'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import Badge from '@/components/ui/Badge'
interface Movement {
  id: string
  date: string
  category: 'green' | 'roasted'
  ref_id: string
  action: string
  quantity_kg: number | null
  from_channel: string | null
  to_channel: string | null
  note: string | null
}

interface MovementsClientProps {
  movements: Movement[]
}

const actionVariant: Record<string, 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'sage'> = {
  received: 'green',
  roasted_out: 'yellow',
  roasted_in: 'sage',
  packed: 'blue',
  allocated: 'blue',
  transferred: 'blue',
  sold: 'red',
  consumed: 'red',
  adjusted: 'gray',
}

export default function MovementsClient({ movements }: MovementsClientProps) {
  const { t, locale } = useLanguage()
  const [filterCategory, setFilterCategory] = useState<'all' | 'green' | 'roasted'>('all')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [filterFrom, setFilterFrom] = useState<string>('')
  const [filterTo, setFilterTo] = useState<string>('')

  const allActions = useMemo(() => {
    const set = new Set(movements.map(m => m.action))
    return Array.from(set).sort()
  }, [movements])

  const filtered = useMemo(() => {
    return movements.filter(m => {
      if (filterCategory !== 'all' && m.category !== filterCategory) return false
      if (filterAction !== 'all' && m.action !== filterAction) return false
      if (filterFrom && new Date(m.date) < new Date(filterFrom)) return false
      if (filterTo && new Date(m.date) > new Date(filterTo + 'T23:59:59')) return false
      return true
    })
  }, [movements, filterCategory, filterAction, filterFrom, filterTo])

  function clearFilters() {
    setFilterCategory('all')
    setFilterAction('all')
    setFilterFrom('')
    setFilterTo('')
  }

  const headers = [t('movements.date'), t('movements.category'), t('movements.action'), t('movements.quantity'), t('movements.fromChannel'), t('movements.toChannel'), t('movements.note')]
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-text-primary">{t('movements.title')}</h1>
        <span className="text-sm text-text-primary/60 bg-cream px-3 py-1.5 rounded-full">
          {filtered.length} {t('movements.records')}
        </span>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">{t('movements.filterCategory')}</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as 'all' | 'green' | 'roasted')}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="all">{t('movements.all')}</option>
              <option value="green">{t('movements.green')}</option>
              <option value="roasted">{t('movements.roasted')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">{t('movements.filterAction')}</label>
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="all">{t('movements.all')}</option>
              {allActions.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">{t('movements.filterDateFrom')}</label>
            <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">{t('movements.filterDateTo')}</label>
            <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        {(filterCategory !== 'all' || filterAction !== 'all' || filterFrom || filterTo) && (
          <Button onClick={clearFilters} variant="ghost" size="sm" className="mt-2">
            {t('common.clear')} {t('movements.filters')}
          </Button>
        )}
      </div>

      {/* Table */}
      <Table headers={headers}>
            {filtered.length === 0 ? (
              <tr>
                <TableCell className="py-10 text-center text-text-primary/50">{t('common.noData')}</TableCell>
              </tr>
            ) : (
              filtered.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="py-4 px-4 text-xs font-semibold text-text-secondary whitespace-nowrap">
                    {new Date(m.date).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <Badge
                      label={m.category === 'green' ? 'ðŸŒ¿ ' + (t('movements.green')) : 'â˜• ' + (t('movements.roasted'))}
                      variant={m.category === 'green' ? 'green' : 'sage'}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge label={m.action} variant={actionVariant[m.action] ?? 'gray'} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium text-text-secondary">
                    {m.quantity_kg != null ? `${m.quantity_kg} kg` : 'â€”'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-text-primary/70">{m.from_channel ?? 'â€”'}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-text-primary/70">{m.to_channel ?? 'â€”'}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-text-secondary max-w-xs truncate">{m.note ?? 'â€”'}</TableCell>
                </TableRow>
              ))
            )}
          </Table>
    </div>
  )
}


