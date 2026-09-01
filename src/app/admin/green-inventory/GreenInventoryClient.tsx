'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import Modal from '@/components/ui/Modal'
import CsvExport from '@/components/CsvExport'
import CsvImport from '@/components/CsvImport'
import Badge from '@/components/ui/Badge'
import {
  addGreenLot,
  updateGreenLot,
  deleteGreenLot,
  importGreenLots,
  type GreenLotInput,
} from '@/app/actions/green-inventory'

interface GreenLot {
  id: string
  lot_name: string
  origin: string
  supplier: string
  arrival_date: string
  initial_kg: number
  remaining_kg: number
  cost_per_kg: number | null
  notes: string | null
}

interface GreenInventoryClientProps {
  lots: GreenLot[]
  lowStockThreshold: number
}

const EMPTY_FORM: GreenLotInput = {
  lot_name: '',
  origin: '',
  supplier: '',
  arrival_date: '',
  initial_kg: 0,
  remaining_kg: 0,
  cost_per_kg: null,
  notes: null,
}

export default function GreenInventoryClient({ lots, lowStockThreshold }: GreenInventoryClientProps) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingLot, setEditingLot] = useState<GreenLot | null>(null)
  const [form, setForm] = useState<GreenLotInput>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<string | null>(null)

  function openAdd() {
    setEditingLot(null)
    setForm(EMPTY_FORM)
    setError(null)
    setModalOpen(true)
  }

  function openEdit(lot: GreenLot) {
    setEditingLot(lot)
    setForm({
      lot_name: lot.lot_name,
      origin: lot.origin,
      supplier: lot.supplier,
      arrival_date: lot.arrival_date,
      initial_kg: lot.initial_kg,
      remaining_kg: lot.remaining_kg,
      cost_per_kg: lot.cost_per_kg,
      notes: lot.notes,
    })
    setError(null)
    setModalOpen(true)
  }

  function handleFormChange(field: keyof GreenLotInput, value: string | number | null) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    setError(null)
    if (!form.lot_name || !form.origin || !form.supplier || !form.arrival_date || !form.initial_kg) {
      setError(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill all required fields.')
      return
    }
    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        if (editingLot) {
          await updateGreenLot(editingLot.id, form)
        } else {
          await addGreenLot(form)
        }
        setModalOpen(false)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  function handleDelete(id: string) {
    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        await deleteGreenLot(id)
        setDeleteId(null)
        router.refresh()
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Delete failed')
        setDeleteId(null)
      }
    })
  }

  const handleImport = useCallback(async (rows: Record<string, string>[]) => {
    try {
      const count = await importGreenLots(rows)
      setImportResult(locale === 'ar' ? `تم استيراد ${count} صفوف بنجاح.` : `Successfully imported ${count} rows.`)
      router.refresh()
    } catch (e) {
      setImportResult(e instanceof Error ? e.message : 'Import failed')
    }
  }, [locale, router])

  const exportData = lots.map(({ id: _id, ...rest }) => rest)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-olive">{t('greenInventory.title')}</h1>
        <div className="flex flex-wrap gap-2">
          <CsvImport
            onImport={handleImport}
            label={t('greenInventory.importCsv')}
            expectedColumns={['lot_name', 'origin', 'supplier', 'arrival_date', 'initial_kg', 'remaining_kg', 'cost_per_kg', 'notes']}
          />
          <CsvExport data={exportData} filename="green-inventory.csv" label={t('greenInventory.exportCsv')} />
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            + {t('greenInventory.addLot')}
          </button>
        </div>
      </div>

      {importResult && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${importResult.includes('import') || importResult.includes('استيراد') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {importResult}
          <button className="ms-2 text-xs underline" onClick={() => setImportResult(null)}>✕</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow-horizon-sm p-4">
        <table className="w-full min-w-max text-start">
          <thead>
            <tr className="border-b border-light">
              {headers.map(h => (
                <th key={h} className="pb-3 pt-4 px-4 text-start text-xs font-bold text-olive/60 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lots.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-sm text-olive/50">{t('common.noData')}</td>
              </tr>
            ) : (
              lots.map(lot => (
                <tr key={lot.id} className="border-b border-light/50 transition-colors hover:bg-light/30">
                  <td className="py-4 px-4 text-sm font-semibold text-charcoal">{lot.lot_name}</td>
                  <td className="py-4 px-4 text-sm text-charcoal">{lot.origin}</td>
                  <td className="py-4 px-4 text-sm text-charcoal">{lot.supplier}</td>
                  <td className="py-4 px-4 text-sm text-charcoal">{lot.arrival_date}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-charcoal">{lot.initial_kg} kg</td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <span className={lot.remaining_kg < lowStockThreshold ? 'text-amber-600 font-semibold' : 'text-charcoal'}>
                      {lot.remaining_kg} kg
                    </span>
                    {lot.remaining_kg < lowStockThreshold && (
                      <Badge label={locale === 'ar' ? 'منخفض' : 'Low'} variant="yellow" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal">
                    {lot.cost_per_kg != null ? `$${lot.cost_per_kg}/kg` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(lot)}
                        className="text-xs px-3 py-1.5 rounded-md bg-cream hover:bg-cream-dark text-olive font-medium transition"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => setDeleteId(lot.id)}
                        className="text-xs px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 font-medium transition"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingLot ? t('greenInventory.editLot') : t('greenInventory.addLot')} size="md">
        <div className="space-y-4">
          {[
            { label: t('greenInventory.lotName'), field: 'lot_name' as const, type: 'text', required: true },
            { label: t('greenInventory.origin'), field: 'origin' as const, type: 'text', required: true },
            { label: t('greenInventory.supplier'), field: 'supplier' as const, type: 'text', required: true },
            { label: t('greenInventory.arrivalDate'), field: 'arrival_date' as const, type: 'date', required: true },
            { label: t('greenInventory.initialKg'), field: 'initial_kg' as const, type: 'number', required: true },
            { label: t('greenInventory.remainingKg'), field: 'remaining_kg' as const, type: 'number', required: true },
            { label: t('greenInventory.costPerKg'), field: 'cost_per_kg' as const, type: 'number', required: false },
          ].map(({ label, field, type, required }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-olive mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={type}
                value={(form[field] as string | number) ?? ''}
                onChange={e => handleFormChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm"
                step={type === 'number' ? '0.01' : undefined}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-olive mb-1">{t('greenInventory.notes')}</label>
            <textarea
              value={form.notes ?? ''}
              onChange={e => handleFormChange('notes', e.target.value || null)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm resize-none"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg font-medium text-sm transition disabled:opacity-60"
            >
              {isPending ? t('common.loading') : t('common.save')}
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2 bg-cream hover:bg-cream-dark text-olive rounded-lg font-medium text-sm transition"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('greenInventory.deleteLot')} size="sm">
        <p className="text-sm text-charcoal mb-4">{t('greenInventory.confirmDelete')}</p>
        <div className="flex gap-3">
          <button
            onClick={() => deleteId && handleDelete(deleteId)}
            disabled={isPending}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition disabled:opacity-60"
          >
            {t('common.delete')}
          </button>
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 py-2 bg-cream hover:bg-cream-dark text-olive rounded-lg font-medium text-sm transition"
          >
            {t('common.cancel')}
          </button>
        </div>
      </Modal>
    </div>
  )
}
