'use client'

import { useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import CsvExport from '@/components/CsvExport'
import CsvImport from '@/components/CsvImport'
import {
  addRoastedStock,
  updateRoastedStock,
  deleteRoastedStock,
  importRoastedStock,
  type RoastedStockInput,
} from '@/app/actions/roasted-inventory'

type StateType = 'bulk' | 'packed'
type ChannelType = 'unallocated' | 'bar' | 'b2c' | 'b2b'
type StatusType = 'in_stock' | 'shipped' | 'sold' | 'consumed'

interface RoastBatchOption {
  id: string
  roast_date: string
  green_inventory: { lot_name: string } | null
}

interface RoastedStockRow {
  id: string
  roast_batch_id: string
  state: StateType
  package_size_g: number | null
  unit_count: number | null
  quantity_kg: number
  channel: ChannelType
  status: StatusType
  produced_date: string
  notes: string | null
  roast_batches: { roast_date: string; green_inventory: { lot_name: string } | null } | null
}

interface RoastedInventoryClientProps {
  stock: RoastedStockRow[]
  batches: RoastBatchOption[]
}

const statusVariant: Record<StatusType, 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'sage'> = {
  in_stock: 'green',
  shipped: 'blue',
  sold: 'red',
  consumed: 'gray',
}

const channelVariant: Record<ChannelType, 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'sage'> = {
  unallocated: 'gray',
  bar: 'sage',
  b2c: 'blue',
  b2b: 'yellow',
}

const EMPTY_FORM: RoastedStockInput = {
  roast_batch_id: '',
  state: 'bulk',
  package_size_g: null,
  unit_count: null,
  quantity_kg: 0,
  channel: 'unallocated',
  status: 'in_stock',
  produced_date: new Date().toISOString().split('T')[0],
  notes: null,
}

export default function RoastedInventoryClient({ stock, batches }: RoastedInventoryClientProps) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<RoastedStockInput>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<string | null>(null)

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError(null)
    setModalOpen(true)
  }

  function openEdit(row: RoastedStockRow) {
    setEditingId(row.id)
    setForm({
      roast_batch_id: row.roast_batch_id,
      state: row.state,
      package_size_g: row.package_size_g,
      unit_count: row.unit_count,
      quantity_kg: row.quantity_kg,
      channel: row.channel,
      status: row.status,
      produced_date: row.produced_date,
      notes: row.notes,
    })
    setError(null)
    setModalOpen(true)
  }

  function handleSave() {
    setError(null)
    if (!form.roast_batch_id || !form.produced_date || form.quantity_kg <= 0) {
      setError(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill all required fields.')
      return
    }
    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        if (editingId) {
          await updateRoastedStock(editingId, form)
        } else {
          await addRoastedStock(form)
        }
        setModalOpen(false)
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  function handleDelete(id: string) {
    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        await deleteRoastedStock(id)
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
      const count = await importRoastedStock(rows, batches[0]?.id ?? '')
      setImportResult(locale === 'ar' ? `تم استيراد ${count} صفوف.` : `Imported ${count} rows.`)
      router.refresh()
    } catch (e) {
      setImportResult(e instanceof Error ? e.message : 'Import failed')
    }
  }, [locale, router, batches])

  const exportData = stock.map(s => ({
    produced_date: s.produced_date,
    lot_name: s.roast_batches?.green_inventory?.lot_name ?? '',
    state: s.state,
    channel: s.channel,
    status: s.status,
    quantity_kg: s.quantity_kg,
    package_size_g: s.package_size_g ?? '',
    unit_count: s.unit_count ?? '',
    notes: s.notes ?? '',
  }))

  const headers = [
    t('roastedInventory.producedDate'),
    locale === 'ar' ? 'دفعة الحمص' : 'Batch',
    t('roastedInventory.state'),
    t('roastedInventory.channel'),
    t('roastedInventory.status'),
    t('roastedInventory.quantity'),
    t('greenInventory.actions'),
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-olive">{t('roastedInventory.title')}</h1>
        <div className="flex flex-wrap gap-2">
          <CsvImport onImport={handleImport} label={t('roastedInventory.importCsv')}
            expectedColumns={['roast_batch_id', 'state', 'channel', 'quantity_kg', 'status', 'produced_date']} />
          <CsvExport data={exportData} filename="roasted-inventory.csv" label={t('roastedInventory.exportCsv')} />
          <button onClick={openAdd}
            className="px-4 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg text-sm font-medium transition shadow-sm">
            + {t('roastedInventory.addStock')}
          </button>
        </div>
      </div>

      {importResult && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${importResult.includes('Import') || importResult.includes('استيراد') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
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
            {stock.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-olive/50">{t('common.noData')}</td>
              </tr>
            ) : (
              stock.map(row => (
                <tr key={row.id} className="border-b border-light/50 transition-colors hover:bg-light/30">
                  <td className="py-4 px-4 text-sm font-semibold text-charcoal">{row.produced_date}</td>
                  <td className="py-4 px-4 text-sm text-charcoal">
                    {row.roast_batches?.green_inventory?.lot_name ?? '—'}
                    <div className="text-xs text-olive/50">{row.roast_batches?.roast_date}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal capitalize">{t(`roastedInventory.${row.state}`)}</td>
                  <td className="px-4 py-3"><Badge label={row.channel} variant={channelVariant[row.channel]} /></td>
                  <td className="px-4 py-3"><Badge label={t(`roastedInventory.${row.status === 'in_stock' ? 'inStock' : row.status}`)} variant={statusVariant[row.status]} /></td>
                  <td className="px-4 py-3 text-sm font-medium text-charcoal">{row.quantity_kg} kg</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(row)}
                        className="text-xs px-3 py-1.5 rounded-md bg-cream hover:bg-cream-dark text-olive font-medium transition">
                        {t('common.edit')}
                      </button>
                      <button onClick={() => setDeleteId(row.id)}
                        className="text-xs px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 font-medium transition">
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingId ? t('roastedInventory.editStock') : t('roastedInventory.addStock')} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-olive mb-1">
              {locale === 'ar' ? 'دفعة الحمص' : 'Roast Batch'} <span className="text-red-500">*</span>
            </label>
            <select value={form.roast_batch_id}
              onChange={e => setForm(p => ({ ...p, roast_batch_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm">
              <option value="">{locale === 'ar' ? 'اختر دفعة...' : 'Select batch...'}</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.roast_date} — {b.green_inventory?.lot_name ?? 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-olive mb-1">{t('roastedInventory.state')}</label>
              <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value as StateType }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm">
                <option value="bulk">{t('roastedInventory.bulk')}</option>
                <option value="packed">{t('roastedInventory.packed')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-olive mb-1">{t('roastedInventory.channel')}</label>
              <select value={form.channel} onChange={e => setForm(p => ({ ...p, channel: e.target.value as ChannelType }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm">
                {(['unallocated', 'bar', 'b2c', 'b2b'] as const).map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-olive mb-1">
                {t('roastedInventory.quantity')} (kg) <span className="text-red-500">*</span>
              </label>
              <input type="number" step="0.01" min="0" value={form.quantity_kg || ''}
                onChange={e => setForm(p => ({ ...p, quantity_kg: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive mb-1">{t('roastedInventory.status')}</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as StatusType }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm">
                <option value="in_stock">{t('roastedInventory.inStock')}</option>
                <option value="shipped">{t('roastedInventory.shipped')}</option>
                <option value="sold">{t('roastedInventory.sold')}</option>
                <option value="consumed">{t('roastedInventory.consumed')}</option>
              </select>
            </div>
          </div>

          {form.state === 'packed' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-olive mb-1">{t('roastedInventory.packageSize')} (g)</label>
                <input type="number" min="0" value={form.package_size_g ?? ''}
                  onChange={e => setForm(p => ({ ...p, package_size_g: parseInt(e.target.value) || null }))}
                  className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-olive mb-1">{t('roastedInventory.unitCount')}</label>
                <input type="number" min="0" value={form.unit_count ?? ''}
                  onChange={e => setForm(p => ({ ...p, unit_count: parseInt(e.target.value) || null }))}
                  className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-olive mb-1">
              {t('roastedInventory.producedDate')} <span className="text-red-500">*</span>
            </label>
            <input type="date" value={form.produced_date}
              onChange={e => setForm(p => ({ ...p, produced_date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-olive mb-1">{t('roastedInventory.notes')}</label>
            <textarea value={form.notes ?? ''} rows={2}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value || null }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm resize-none" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={isPending}
              className="flex-1 py-2 bg-sage hover:bg-sage-dark text-white rounded-lg font-medium text-sm transition disabled:opacity-60">
              {isPending ? t('common.loading') : t('common.save')}
            </button>
            <button onClick={() => setModalOpen(false)}
              className="flex-1 py-2 bg-cream hover:bg-cream-dark text-olive rounded-lg font-medium text-sm transition">
              {t('common.cancel')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('common.delete')} size="sm">
        <p className="text-sm text-charcoal mb-4">{locale === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure you want to delete this record?'}</p>
        <div className="flex gap-3">
          <button onClick={() => deleteId && handleDelete(deleteId)} disabled={isPending}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition disabled:opacity-60">
            {t('common.delete')}
          </button>
          <button onClick={() => setDeleteId(null)}
            className="flex-1 py-2 bg-cream hover:bg-cream-dark text-olive rounded-lg font-medium text-sm transition">
            {t('common.cancel')}
          </button>
        </div>
      </Modal>
    </div>
  )
}
