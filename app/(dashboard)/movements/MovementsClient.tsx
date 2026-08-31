'use client'

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
          {locale === 'ar' ? `${filtered.length} سجل` : `${filtered.length} records`}
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
          <button onClick={clearFilters}
            className="mt-3 text-xs text-sage hover:text-sage-dark underline">
            {t('common.clear')} {locale === 'ar' ? 'الفلاتر' : 'filters'}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-cream-dark shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-cream border-b border-cream-dark">
            <tr>
              {[
                t('movements.date'),
                t('movements.category'),
                t('movements.action'),
                t('movements.quantity'),
                t('movements.fromChannel'),
                t('movements.toChannel'),
                t('movements.note'),
              ].map(h => (
                <th key={h} className="px-4 py-3 text-start text-xs font-semibold text-olive uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-olive/50 text-sm">{t('common.noData')}</td>
              </tr>
            ) : (
              filtered.map(m => (
                <tr key={m.id} className="hover:bg-cream-light transition">
                  <td className="px-4 py-3 text-xs text-charcoal whitespace-nowrap">
                    {new Date(m.date).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={m.category === 'green' ? '🌿 ' + (locale === 'ar' ? 'أخضر' : 'Green') : '☕ ' + (locale === 'ar' ? 'محمص' : 'Roasted')}
                      variant={m.category === 'green' ? 'green' : 'sage'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={m.action} variant={actionVariant[m.action] ?? 'gray'} />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-charcoal">
                    {m.quantity_kg != null ? `${m.quantity_kg} kg` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-olive/70">{m.from_channel ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-olive/70">{m.to_channel ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-charcoal max-w-xs truncate">{m.note ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
