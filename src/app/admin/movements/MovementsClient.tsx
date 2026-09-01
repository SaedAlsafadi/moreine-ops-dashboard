'use client'
import { Button } from '@/components/ui/Button'

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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-olive">{t('movements.title')}</h1>
        <span className="text-sm text-olive/60 bg-cream px-3 py-1.5 rounded-full">
          {filtered.length} {t('movements.records')}
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-cream-dark p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-olive mb-1">{t('movements.filterCategory')}</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as 'all' | 'green' | 'roasted')}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sage">
              <option value="all">{t('movements.all')}</option>
              <option value="green">{t('movements.green')}</option>
              <option value="roasted">{t('movements.roasted')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-olive mb-1">{t('movements.filterAction')}</label>
            <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sage">
              <option value="all">{t('movements.all')}</option>
              {allActions.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-olive mb-1">{t('movements.filterDateFrom')}</label>
            <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sage" />
          </div>
          <div>
            <label className="block text-xs font-medium text-olive mb-1">{t('movements.filterDateTo')}</label>
            <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sage" />
          </div>
        </div>
        {(filterCategory !== 'all' || filterAction !== 'all' || filterFrom || filterTo) && (
          <Button onClick={clearFilters} variant="ghost" size="sm" className="mt-2">
            {t('common.clear')} {t('movements.filters')}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-horizon-sm p-4">
        <table className="w-full min-w-max text-start">
          <thead>
            <tr className="border-b border-light">
              {[
                t('movements.date'),
                t('movements.category'),
                t('movements.action'),
                t('movements.quantity'),
                t('movements.fromChannel'),
                t('movements.toChannel'),
                t('movements.note'),
              ].map(h => (
                <th key={h} className="pb-3 pt-4 px-4 text-start text-xs font-bold text-olive/60 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-olive/50">{t('common.noData')}</td>
              </tr>
            ) : (
              filtered.map(m => (
                <tr key={m.id} className="border-b border-light/50 transition-colors hover:bg-light/30">
                  <td className="py-4 px-4 text-xs font-semibold text-charcoal whitespace-nowrap">
                    {new Date(m.date).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      label={m.category === 'green' ? 'ðŸŒ¿ ' + (t('movements.green')) : 'â˜• ' + (t('movements.roasted'))}
                      variant={m.category === 'green' ? 'green' : 'sage'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={m.action} variant={actionVariant[m.action] ?? 'gray'} />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-charcoal">
                    {m.quantity_kg != null ? `${m.quantity_kg} kg` : 'â€”'}
                  </td>
                  <td className="px-4 py-3 text-sm text-olive/70">{m.from_channel ?? 'â€”'}</td>
                  <td className="px-4 py-3 text-sm text-olive/70">{m.to_channel ?? 'â€”'}</td>
                  <td className="px-4 py-3 text-sm text-charcoal max-w-xs truncate">{m.note ?? 'â€”'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

