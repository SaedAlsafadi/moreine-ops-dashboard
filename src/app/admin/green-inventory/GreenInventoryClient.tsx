'use client'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, TableRow, TableCell } from '@/components/ui/Table'

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
  process?: string | null
  region?: string | null
  variety?: string | null
  altitude?: string | null
  cup_score?: number | null
  tasting_notes?: string | null
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
  arrival_date: new Date().toISOString().split('T')[0],
  initial_kg: 0,
  remaining_kg: 0,
  cost_per_kg: null,
  process: null,
  region: null,
  variety: null,
  altitude: null,
  cup_score: null,
  tasting_notes: null,
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

  const headers = [
    t('greenInventory.lotName'),
    t('greenInventory.origin'),
    t('greenInventory.supplier'),
    t('greenInventory.arrivalDate'),
    t('greenInventory.initialKg'),
    t('greenInventory.remainingKg'),
    t('greenInventory.costPerKg'),
    t('greenInventory.actions'),
  ]

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
      process: lot.process ?? null,
      region: lot.region ?? null,
      variety: lot.variety ?? null,
      altitude: lot.altitude ?? null,
      cup_score: lot.cup_score ?? null,
      tasting_notes: lot.tasting_notes ?? null,
      notes: lot.notes,
    })
    setError(null)
    setModalOpen(true)
  }

  function handleFormChange(field: keyof GreenLotInput, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    setError(null)
    if (!form.lot_name || !form.origin || !form.supplier || !form.arrival_date || !form.initial_kg) {
      setError(t('common.fillRequired'))
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
      setImportResult(t('common.importSuccess') + ' ' + count)
      router.refresh()
    } catch (e) {
      setImportResult(e instanceof Error ? e.message : 'Import failed')
    }
  }, [locale, router])

  const exportData = lots.map(({ id: _id, ...rest }) => rest)

  return (
    <div className="space-y-5">
      <PageHeader title={t('greenInventory.title')}>
        <CsvImport
          onImport={handleImport}
          label={t('greenInventory.importCsv')}
          expectedColumns={['lot_name', 'origin', 'supplier', 'arrival_date', 'initial_kg', 'remaining_kg', 'cost_per_kg', 'notes']}
        />
        <CsvExport data={exportData} filename="green-inventory.csv" label={t('greenInventory.exportCsv')} />
        <Button onClick={openAdd} variant="primary" size="md">
          + {t('greenInventory.addLot')}
        </Button>
      </PageHeader>

      {importResult && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${importResult.includes('import') || importResult.includes('استيراد') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {importResult}
          <button className="ms-2 text-xs underline" onClick={() => setImportResult(null)}>✕</button>
        </div>
      )}

      <Table headers={headers}>
        {lots.length === 0 ? (
          <tr>
            <TableCell className="py-10 text-center text-text-primary/50">{t('common.noData')}</TableCell>
          </tr>
        ) : (
          lots.map(lot => (
            <TableRow key={lot.id}>
              <TableCell className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary text-base">{lot.lot_name}</span>
                  {lot.cup_score && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      ★ {lot.cup_score}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1 text-xs text-text-secondary">
                  {lot.region && <span className="bg-surface px-1.5 py-0.5 rounded border border-border">{lot.region}</span>}
                  {lot.variety && <span className="bg-surface px-1.5 py-0.5 rounded border border-border">{lot.variety}</span>}
                  {lot.process && <span className="bg-surface px-1.5 py-0.5 rounded border border-border">{lot.process}</span>}
                  {lot.altitude && <span className="bg-surface px-1.5 py-0.5 rounded border border-border">{lot.altitude}</span>}
                </div>
                {lot.tasting_notes && (
                  <p className="mt-1 text-xs text-text-secondary/80 italic line-clamp-1">
                    ☕ {lot.tasting_notes}
                  </p>
                )}
              </TableCell>
              <TableCell>{lot.origin}</TableCell>
              <TableCell>{lot.supplier}</TableCell>
              <TableCell>{lot.arrival_date}</TableCell>
              <TableCell className="py-4 px-4 text-sm font-semibold text-text-secondary">{lot.initial_kg} kg</TableCell>
              <TableCell className="whitespace-nowrap">
                <span className={lot.remaining_kg < lowStockThreshold ? 'text-amber-600 font-semibold' : 'text-text-primary'}>
                  {lot.remaining_kg} kg
                </span>
                {lot.remaining_kg < lowStockThreshold && (
                  <Badge label={t('greenInventory.low')} variant="yellow" />
                )}
              </TableCell>
              <TableCell>
                {lot.cost_per_kg != null ? `${lot.cost_per_kg} SAR/kg` : '—'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={() => openEdit(lot)} variant="secondary" size="sm">
                    {t('common.edit')}
                  </Button>
                  <Button onClick={() => setDeleteId(lot.id)} variant="danger" size="sm">
                    {t('common.delete')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </Table>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingLot ? t('greenInventory.editLot') : t('greenInventory.addLot')} size="lg">
        <div className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('greenInventory.lotName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.lot_name}
                placeholder="e.g. بن اثيوبي شيلشلي اخضر"
                onChange={e => handleFormChange('lot_name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('greenInventory.origin')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.origin}
                placeholder="e.g. اثيوبيا / Ethiopia"
                onChange={e => handleFormChange('origin', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('greenInventory.supplier')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.supplier}
                onChange={e => handleFormChange('supplier', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('greenInventory.arrivalDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.arrival_date}
                onChange={e => handleFormChange('arrival_date', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('greenInventory.initialKg')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.initial_kg || ''}
                onChange={e => handleFormChange('initial_kg', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('greenInventory.remainingKg')} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.remaining_kg !== undefined ? form.remaining_kg : ''}
                onChange={e => handleFormChange('remaining_kg', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('greenInventory.costPerKg')} (SAR)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.cost_per_kg ?? ''}
                onChange={e => handleFormChange('cost_per_kg', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
          </div>

          {/* Specialty Coffee Profile Section (Matches Bag Sticker) */}
          <div className="p-3.5 rounded-xl border border-border bg-background/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              📋 مواصفات البن المختص / Specialty Coffee Profile
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  {t('greenInventory.process')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. مجفف / Natural"
                  value={form.process ?? ''}
                  onChange={e => handleFormChange('process', e.target.value || null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  {t('greenInventory.region')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. سيرادو / Cerrado"
                  value={form.region ?? ''}
                  onChange={e => handleFormChange('region', e.target.value || null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  {t('greenInventory.variety')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. بوربون / Bourbon"
                  value={form.variety ?? ''}
                  onChange={e => handleFormChange('variety', e.target.value || null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  {t('greenInventory.altitude')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1200-1800m"
                  value={form.altitude ?? ''}
                  onChange={e => handleFormChange('altitude', e.target.value || null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  {t('greenInventory.cupScore')} (التقييم)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="50"
                  max="100"
                  placeholder="e.g. 84"
                  value={form.cup_score ?? ''}
                  onChange={e => handleFormChange('cup_score', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  {t('greenInventory.tastingNotes')} (الإيحاءات)
                </label>
                <input
                  type="text"
                  placeholder="e.g. سكر بني، جوز، كاكاو، ليمون"
                  value={form.tasting_notes ?? ''}
                  onChange={e => handleFormChange('tasting_notes', e.target.value || null)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">{t('greenInventory.notes')}</label>
            <textarea
              value={form.notes ?? ''}
              onChange={e => handleFormChange('notes', e.target.value || null)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none"
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

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('greenInventory.deleteLot')} size="sm">
        <p className="text-sm text-text-secondary mb-4">{t('greenInventory.confirmDelete')}</p>
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