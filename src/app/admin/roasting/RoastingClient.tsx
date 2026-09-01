'use client'
import { Button } from '@/components/ui/Button'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import Modal from '@/components/ui/Modal'
import CsvExport from '@/components/CsvExport'
import { addRoastBatch, deleteRoastBatch, type RoastBatchInput } from '@/app/actions/roasting'
interface GreenLot {
  id: string
  lot_name: string
  remaining_kg: number
}

interface RoastBatch {
  id: string
  roast_date: string
  input_kg: number
  output_kg: number
  yield_pct: number | null
  notes: string | null
  green_inventory: { lot_name: string; origin: string } | null
}

interface RoastingClientProps {
  batches: RoastBatch[]
  greenLots: GreenLot[]
}

export default function RoastingClient({ batches, greenLots }: RoastingClientProps) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<RoastBatchInput, 'yield_pct'>>({
    green_lot_id: '',
    roast_date: new Date().toISOString().split('T')[0],
    input_kg: 0,
    output_kg: 0,
    notes: null,
  })

  const yieldPct = form.input_kg > 0 ? ((form.output_kg / form.input_kg) * 100).toFixed(1) : 'â€”'

  function handleSave() {
    setError(null)
    if (!form.green_lot_id || !form.roast_date || form.input_kg <= 0 || form.output_kg <= 0) {
      setError(t('common.fillRequired'))
      return
    }
    if (form.output_kg > form.input_kg) {
      setError(t('roasting.outputExceedsInput'))
      return
    }
    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        await addRoastBatch(form)
        setModalOpen(false)
        setForm({ green_lot_id: '', roast_date: new Date().toISOString().split('T')[0], input_kg: 0, output_kg: 0, notes: null })
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to add batch')
      }
    })
  }

  function handleDelete(id: string) {
    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        await deleteRoastBatch(id)
        setDeleteId(null)
        router.refresh()
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Delete failed')
        setDeleteId(null)
      }
    })
  }

  const exportData = batches.map(b => ({
    roast_date: b.roast_date,
    lot_name: b.green_inventory?.lot_name ?? '',
    origin: b.green_inventory?.origin ?? '',
    input_kg: b.input_kg,
    output_kg: b.output_kg,
    yield_pct: b.yield_pct,
    notes: b.notes ?? '',
  }))

  const selectedLot = greenLots.find(l => l.id === form.green_lot_id)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-olive">{t('roasting.title')}</h1>
        <div className="flex flex-wrap gap-2">
          <CsvExport data={exportData} filename="roast-batches.csv" label={t('roasting.exportCsv')} />
          <Button
            onClick={() => { setError(null); setModalOpen(true) }}
            variant="primary" size="md"
          >
            + {t('roasting.newBatch')}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-horizon-sm p-4">
        <table className="w-full min-w-max text-start">
          <thead>
            <tr className="border-b border-light">
              {[
                t('roasting.roastDate'),
                t('roasting.greenLot'),
                t('roasting.inputKg'),
                t('roasting.outputKg'),
                t('roasting.yieldPct'),
                t('roasting.notes'),
                t('greenInventory.actions'),
              ].map(h => (
                <th key={h} className="pb-3 pt-4 px-4 text-start text-xs font-bold text-olive/60 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-olive/50">{t('common.noData')}</td>
              </tr>
            ) : (
              batches.map(batch => (
                <tr key={batch.id} className="border-b border-light/50 transition-colors hover:bg-light/30">
                  <td className="py-4 px-4 text-sm font-semibold text-charcoal whitespace-nowrap">{batch.roast_date}</td>
                  <td className="py-4 px-4 text-sm text-charcoal">
                    <div>{batch.green_inventory?.lot_name ?? 'â€”'}</div>
                    <div className="text-xs text-olive/60">{batch.green_inventory?.origin ?? ''}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal">{batch.input_kg} kg</td>
                  <td className="px-4 py-3 text-sm text-charcoal">{batch.output_kg} kg</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-medium ${(batch.yield_pct ?? 0) >= 85 ? 'text-green-600' : (batch.yield_pct ?? 0) >= 82 ? 'text-olive' : 'text-amber-600'}`}>
                      {batch.yield_pct != null ? `${batch.yield_pct}%` : 'â€”'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal max-w-xs truncate">{batch.notes ?? 'â€”'}</td>
                  <td className="px-4 py-3">
                    <Button onClick={() => setDeleteId(batch.id)} variant="danger" size="sm">
                      {t('common.delete')}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Batch Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t('roasting.newBatch')} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-olive mb-1">
              {t('roasting.greenLot')} <span className="text-red-500">*</span>
            </label>
            <select
              value={form.green_lot_id}
              onChange={e => setForm(p => ({ ...p, green_lot_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm"
            >
              <option value="">{t('roasting.selectGreenLot')}</option>
              {greenLots.map(l => (
                <option key={l.id} value={l.id}>
                  {l.lot_name} ({l.remaining_kg} kg {t('roasting.available')})
                </option>
              ))}
            </select>
            {selectedLot && (
              <p className="text-xs text-olive/60 mt-1">
                {t('roasting.availableShort')} {selectedLot.remaining_kg} {t('dashboard.kg')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-olive mb-1">
              {t('roasting.roastDate')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.roast_date}
              onChange={e => setForm(p => ({ ...p, roast_date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-olive mb-1">
                {t('roasting.inputKg')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.input_kg || ''}
                onChange={e => setForm(p => ({ ...p, input_kg: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive mb-1">
                {t('roasting.outputKg')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.output_kg || ''}
                onChange={e => setForm(p => ({ ...p, output_kg: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm"
              />
            </div>
          </div>

          {/* Yield auto-calculated display */}
          <div className="bg-cream rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-olive">{t('roasting.yieldPct')}</span>
            <span className="text-lg font-bold text-sage">{yieldPct}{yieldPct !== 'â€”' ? '%' : ''}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-olive mb-1">{t('roasting.notes')}</label>
            <textarea
              value={form.notes ?? ''}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value || null }))}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm resize-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={isPending} variant="primary" className="flex-1">
              {isPending ? t('common.loading') : t('common.save')}
            </Button>
            <Button onClick={() => setModalOpen(false)} variant="secondary" className="flex-1">
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('common.delete')} size="sm">
        <p className="text-sm text-charcoal mb-4">
          {t('roasting.confirmDeleteBatch')}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => deleteId && handleDelete(deleteId)} disabled={isPending} variant="danger" className="flex-1">
            {t('common.delete')}
          </Button>
          <Button onClick={() => setDeleteId(null)} variant="secondary" className="flex-1">
            {t('common.cancel')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

