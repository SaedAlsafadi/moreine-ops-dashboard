'use client'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ChannelSplitChart } from './RoastedCharts'
import { Table, TableRow, TableCell } from '@/components/ui/Table'

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
      setError(t('common.fillRequired'))
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
      setImportResult(t('common.importSuccess') + ' ' + count)
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
    t('roastedInventory.batch'),
    t('roastedInventory.state'),
    t('roastedInventory.channel'),
    t('roastedInventory.status'),
    t('roastedInventory.quantity'),
    t('greenInventory.actions'),
  ]

  return (
    <div className="space-y-5">
      <PageHeader title={t('roastedInventory.title')}>
          <CsvImport onImport={handleImport} label={t('roastedInventory.importCsv')}
            expectedColumns={['roast_batch_id', 'state', 'channel', 'quantity_kg', 'status', 'produced_date']} />
          <CsvExport data={exportData} filename="roasted-inventory.csv" label={t('roastedInventory.exportCsv')} />
          <Button onClick={openAdd} variant="primary" size="md">
            + {t('roastedInventory.addStock')}
          </Button>
        </PageHeader>

      {importResult && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${importResult.includes('Import') || importResult.includes('Ø§Ø³ØªÙŠØ±Ø§Ø¯') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {importResult}
          <button className="ms-2 text-xs underline" onClick={() => setImportResult(null)}>âœ•</button>
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 md:grid-cols-2">
        <ChannelSplitChart data={['bar', 'b2c', 'b2b', 'unallocated'].map(ch => ({ channel: ch, kg: stock.filter(s => s.channel === ch).reduce((acc, curr) => acc + (curr.quantity_kg || 0), 0) }))} />
      </div>

      <Table headers={headers}>
            {stock.length === 0 ? (
              <tr>
                <TableCell className="py-10 text-center text-text-primary/50">{t('common.noData')}</TableCell>
              </tr>
            ) : (
              stock.map(row => (
                <TableRow key={row.id}>
                  <TableCell className="py-4 px-4 text-sm font-semibold text-text-secondary">{row.produced_date}</TableCell>
                  <TableCell>
                    {row.roast_batches?.green_inventory?.lot_name ?? 'â€”'}
                    <div className="text-xs text-text-primary/50">{row.roast_batches?.roast_date}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-text-secondary capitalize">{t(`roastedInventory.${row.state}`)}</TableCell>
                  <TableCell><Badge label={row.channel} variant={channelVariant[row.channel]} /></TableCell>
                  <TableCell><Badge label={t(`roastedInventory.${row.status === 'in_stock' ? 'inStock' : row.status}`)} variant={statusVariant[row.status]} /></TableCell>
                  <TableCell className="px-4 py-3 text-sm font-medium text-text-secondary">{row.quantity_kg} kg</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button onClick={() => openEdit(row)} variant="secondary" size="sm">
                        {t('common.edit')}
                      </Button>
                      <Button onClick={() => setDeleteId(row.id)} variant="danger" size="sm">
                        {t('common.delete')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </Table>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editingId ? t('roastedInventory.editStock') : t('roastedInventory.addStock')} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {t('roastedInventory.roastBatch')} <span className="text-red-500">*</span>
            </label>
            <select value={form.roast_batch_id}
              onChange={e => setForm(p => ({ ...p, roast_batch_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm">
              <option value="">{t('roastedInventory.selectBatch')}</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.roast_date} â€” {b.green_inventory?.lot_name ?? 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">{t('roastedInventory.state')}</label>
              <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value as StateType }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm">
                <option value="bulk">{t('roastedInventory.bulk')}</option>
                <option value="packed">{t('roastedInventory.packed')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">{t('roastedInventory.channel')}</label>
              <select value={form.channel} onChange={e => setForm(p => ({ ...p, channel: e.target.value as ChannelType }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm">
                {(['unallocated', 'bar', 'b2c', 'b2b'] as const).map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('roastedInventory.quantity')} (kg) <span className="text-red-500">*</span>
              </label>
              <input type="number" step="0.01" min="0" value={form.quantity_kg || ''}
                onChange={e => setForm(p => ({ ...p, quantity_kg: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">{t('roastedInventory.status')}</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as StatusType }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm">
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
                <label className="block text-sm font-medium text-text-primary mb-1">{t('roastedInventory.packageSize')} (g)</label>
                <input type="number" min="0" value={form.package_size_g ?? ''}
                  onChange={e => setForm(p => ({ ...p, package_size_g: parseInt(e.target.value) || null }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">{t('roastedInventory.unitCount')}</label>
                <input type="number" min="0" value={form.unit_count ?? ''}
                  onChange={e => setForm(p => ({ ...p, unit_count: parseInt(e.target.value) || null }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {t('roastedInventory.producedDate')} <span className="text-red-500">*</span>
            </label>
            <input type="date" value={form.produced_date}
              onChange={e => setForm(p => ({ ...p, produced_date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">{t('roastedInventory.notes')}</label>
            <textarea value={form.notes ?? ''} rows={2}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value || null }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none" />
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
        <p className="text-sm text-text-secondary mb-4">{t('common.confirmDeleteGeneric')}</p>
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


