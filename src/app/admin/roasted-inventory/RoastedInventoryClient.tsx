'use client'

import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ChannelSplitChart } from './RoastedCharts'
import { Table, TableRow, TableCell } from '@/components/ui/Table'
import Card from '@/components/card'

import { useState, useTransition, useCallback, useMemo } from 'react'
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
  quickAdjustStock,
  packFromBulkAction,
  transferStockAction,
  type RoastedStockInput,
} from '@/app/actions/roasted-inventory'
import {
  computeQuantityKg,
  type PackageType,
  type ChannelType,
  type StatusType,
} from '@/lib/inventory-utils'

interface GreenLotProfile {
  id?: string
  lot_name: string
  origin?: string
  process?: string | null
  variety?: string | null
  region?: string | null
  cup_score?: number | null
}

interface RoastBatchOption {
  id: string
  roast_date: string
  green_inventory: GreenLotProfile | null
}

interface RoastedStockRow {
  id: string
  roast_batch_id: string
  state: 'bulk' | 'packed'
  package_type: PackageType
  package_size_g: number | null
  unit_count: number | null
  box_sachets_count?: number | null
  quantity_kg: number
  channel: ChannelType
  status: StatusType
  produced_date: string
  notes: string | null
  roast_batches: {
    id?: string
    roast_date: string
    green_inventory: GreenLotProfile | null
  } | null
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

const CHANNELS: ChannelType[] = ['unallocated', 'bar', 'b2c', 'b2b']
const PACK_TYPES: PackageType[] = ['bag_1kg', 'bag_250g', 'drip_box']

export default function RoastedInventoryClient({ stock, batches }: RoastedInventoryClientProps) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // View state: 'matrix' (default, grouped by lot with steppers) or 'table' (flat ledger)
  const [viewMode, setViewMode] = useState<'matrix' | 'table'>('matrix')

  // Modals state
  const [manualModalOpen, setManualModalOpen] = useState(false)
  const [packModalOpen, setPackModalOpen] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<string | null>(null)

  // Standard Form for manual add/edit
  const [manualForm, setManualForm] = useState<RoastedStockInput>({
    roast_batch_id: batches[0]?.id ?? '',
    state: 'packed',
    package_type: 'bag_250g',
    package_size_g: 250,
    unit_count: 1,
    quantity_kg: 0.25,
    channel: 'b2c',
    status: 'in_stock',
    produced_date: new Date().toISOString().split('T')[0],
    notes: null,
  })

  // Pack from Bulk form
  const [packForm, setPackForm] = useState<{
    batchId: string
    packageType: 'bag_1kg' | 'bag_250g' | 'drip_box'
    unitCount: number
    targetChannel: ChannelType
    notes: string
  }>({
    batchId: batches[0]?.id ?? '',
    packageType: 'bag_250g',
    unitCount: 20,
    targetChannel: 'b2c',
    notes: '',
  })

  // Transfer form
  const [transferForm, setTransferForm] = useState<{
    stockId: string
    toChannel: ChannelType
    units: number
    kg: number
    notes: string
  }>({
    stockId: '',
    toChannel: 'bar',
    units: 1,
    kg: 1,
    notes: '',
  })

  // Optimistic local stock store for instant steppers (+ / -)
  const [localStock, setLocalStock] = useState<RoastedStockRow[]>(stock)
  useMemo(() => {
    setLocalStock(stock)
  }, [stock])

  // Calculated KPI aggregates
  const totalRoastedKg = useMemo(() => {
    return Math.round(localStock.reduce((sum, s) => sum + (Number(s.quantity_kg) || 0), 0) * 100) / 100
  }, [localStock])

  const total1kgBags = useMemo(() => {
    return localStock
      .filter(s => s.package_type === 'bag_1kg')
      .reduce((sum, s) => sum + (Number(s.unit_count) || 0), 0)
  }, [localStock])

  const total250gBags = useMemo(() => {
    return localStock
      .filter(s => s.package_type === 'bag_250g')
      .reduce((sum, s) => sum + (Number(s.unit_count) || 0), 0)
  }, [localStock])

  const totalDripBoxes = useMemo(() => {
    return localStock
      .filter(s => s.package_type === 'drip_box')
      .reduce((sum, s) => sum + (Number(s.unit_count) || 0), 0)
  }, [localStock])

  const totalBulkKg = useMemo(() => {
    return Math.round(
      localStock
        .filter(s => s.package_type === 'bulk' || s.state === 'bulk')
        .reduce((sum, s) => sum + (Number(s.quantity_kg) || 0), 0) * 100
    ) / 100
  }, [localStock])

  // Group stock items by Roast Batch / Coffee Lot
  const groupedByBatch = useMemo(() => {
    const map = new Map<string, {
      batch: RoastBatchOption | null
      items: RoastedStockRow[]
      bulkItem: RoastedStockRow | null
      totalKg: number
    }>()

    for (const b of batches) {
      map.set(b.id, {
        batch: b,
        items: [],
        bulkItem: null,
        totalKg: 0,
      })
    }

    for (const item of localStock) {
      const entry = map.get(item.roast_batch_id) || {
        batch: item.roast_batches ? {
          id: item.roast_batch_id,
          roast_date: item.roast_batches.roast_date,
          green_inventory: item.roast_batches.green_inventory,
        } : null,
        items: [],
        bulkItem: null,
        totalKg: 0,
      }

      entry.items.push(item)
      entry.totalKg = Math.round((entry.totalKg + (Number(item.quantity_kg) || 0)) * 100) / 100
      if (item.package_type === 'bulk' || item.state === 'bulk') {
        entry.bulkItem = item
      }
      map.set(item.roast_batch_id, entry)
    }

    return Array.from(map.entries())
      .filter(([_, data]) => data.items.length > 0 || batches.some(b => b.id === _))
      .map(([batchId, data]) => ({ batchId, ...data }))
  }, [batches, localStock])

  // Instant inline stepper adjustment (+1 / -1)
  async function handleQuickStep(
    batchId: string,
    pkgType: PackageType,
    channel: ChannelType,
    delta: number
  ) {
    setError(null)
    const existing = localStock.find(
      s => s.roast_batch_id === batchId && s.package_type === pkgType && s.channel === channel
    )

    if (existing) {
      const currentUnits = existing.unit_count ?? 0
      const nextUnits = Math.max(0, currentUnits + delta)
      const nextKg = computeQuantityKg(pkgType, nextUnits, 0, existing.package_size_g)

      // Optimistic update
      setLocalStock(prev =>
        prev.map(item =>
          item.id === existing.id
            ? { ...item, unit_count: nextUnits, quantity_kg: nextKg }
            : item
        )
      )

      try {
        await quickAdjustStock({
          stockId: existing.id,
          newUnitCount: nextUnits,
          reason: `Quick adjustment (${delta > 0 ? '+' : ''}${delta} ${t('roastedInventory.' + pkgType) || pkgType})`,
        })
      } catch (err: any) {
        setError(err.message || 'Update failed')
        router.refresh()
      }
    } else {
      // Create new row if clicking + from 0
      if (delta <= 0) return
      const initialUnits = delta
      const initialKg = computeQuantityKg(pkgType, initialUnits, 0)
      try {
        await addRoastedStock({
          roast_batch_id: batchId,
          state: pkgType === 'bulk' ? 'bulk' : 'packed',
          package_type: pkgType,
          unit_count: initialUnits,
          quantity_kg: initialKg,
          channel: channel,
          status: 'in_stock',
          produced_date: new Date().toISOString().split('T')[0],
          notes: `Added via quick adjust`,
        })
        router.refresh()
      } catch (err: any) {
        setError(err.message || 'Creation failed')
      }
    }
  }

  // Handle Pack from Bulk submission
  function handlePackSubmit() {
    setError(null)
    if (!packForm.batchId || packForm.unitCount <= 0) {
      setError(t('common.fillRequired'))
      return
    }

    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        await packFromBulkAction({
          roastBatchId: packForm.batchId,
          packageType: packForm.packageType,
          unitCount: packForm.unitCount,
          targetChannel: packForm.targetChannel,
          note: packForm.notes || undefined,
        })
        setSuccessMsg(t('roastedInventory.packSuccess'))
        setPackModalOpen(false)
        setTimeout(() => setSuccessMsg(null), 3000)
        router.refresh()
      } catch (e: any) {
        setError(e.message || 'Pack action failed')
      }
    })
  }

  // Handle Transfer submission
  function handleTransferSubmit() {
    setError(null)
    if (!transferForm.stockId) {
      setError(t('common.fillRequired'))
      return
    }

    const selectedItem = localStock.find(s => s.id === transferForm.stockId)
    if (!selectedItem) return

    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        await transferStockAction({
          stockId: transferForm.stockId,
          toChannel: transferForm.toChannel,
          transferUnits: selectedItem.package_type === 'bulk' ? null : transferForm.units,
          transferKg: selectedItem.package_type === 'bulk' ? transferForm.kg : null,
          note: transferForm.notes || undefined,
        })
        setSuccessMsg(t('roastedInventory.transferSuccess'))
        setTransferModalOpen(false)
        setTimeout(() => setSuccessMsg(null), 3000)
        router.refresh()
      } catch (e: any) {
        setError(e.message || 'Transfer failed')
      }
    })
  }

  // Manual save for full modal
  function handleManualSave() {
    setError(null)
    if (!manualForm.roast_batch_id || !manualForm.produced_date) {
      setError(t('common.fillRequired'))
      return
    }

    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        if (editingId) {
          await updateRoastedStock(editingId, manualForm)
        } else {
          await addRoastedStock(manualForm)
        }
        setManualModalOpen(false)
        router.refresh()
      } catch (e: any) {
        setError(e.message || 'Save failed')
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
      } catch (e: any) {
        alert(e.message || 'Delete failed')
        setDeleteId(null)
      }
    })
  }

  const handleImport = useCallback(async (rows: Record<string, string>[]) => {
    try {
      const count = await importRoastedStock(rows, batches[0]?.id ?? '')
      setImportResult(t('common.importSuccess') + ' ' + count)
      router.refresh()
    } catch (e: any) {
      setImportResult(e.message || 'Import failed')
    }
  }, [batches, router, t])

  const exportData = localStock.map(s => ({
    produced_date: s.produced_date,
    lot_name: s.roast_batches?.green_inventory?.lot_name ?? '',
    package_type: s.package_type,
    channel: s.channel,
    status: s.status,
    unit_count: s.unit_count ?? '',
    quantity_kg: s.quantity_kg,
    notes: s.notes ?? '',
  }))

  const headers = [
    t('roastedInventory.producedDate'),
    t('roastedInventory.batch'),
    t('roastedInventory.packageType'),
    t('roastedInventory.channel'),
    t('roastedInventory.status'),
    t('roastedInventory.unitCount'),
    t('roastedInventory.quantity'),
    t('greenInventory.actions'),
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('roastedInventory.title')}>
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-xl p-1 bg-surface border border-border">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'matrix' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              📊 {t('roastedInventory.lotMatrix') || 'مصفوفة المخزون'}
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              📑 {t('dashboard.viewAll') || 'جدول تفصيلي'}
            </button>
          </div>

          <Button
            onClick={() => {
              setError(null)
              setPackModalOpen(true)
            }}
            variant="primary"
            size="md"
          >
            📦 {t('roastedInventory.packFromBulk') || 'تعبئة من الحبوب'}
          </Button>

          <Button
            onClick={() => {
              setError(null)
              if (localStock.length > 0) {
                setTransferForm(p => ({ ...p, stockId: localStock[0].id }))
              }
              setTransferModalOpen(true)
            }}
            variant="secondary"
            size="md"
          >
            ⇄ {t('roastedInventory.transferStock') || 'تحويل وتخصيص'}
          </Button>

          <CsvImport
            onImport={handleImport}
            label={t('roastedInventory.importCsv')}
            expectedColumns={['roast_batch_id', 'package_type', 'channel', 'unit_count', 'quantity_kg']}
          />
          <CsvExport data={exportData} filename="roasted-inventory.csv" label={t('roastedInventory.exportCsv')} />
        </div>
      </PageHeader>

      {/* Alerts / Feedback */}
      {successMsg && (
        <div className="text-sm px-4 py-3 rounded-xl border bg-green-50 border-green-200 text-green-700 flex items-center justify-between">
          <span>✓ {successMsg}</span>
        </div>
      )}
      {error && (
        <div className="text-sm px-4 py-3 rounded-xl border bg-red-50 border-red-200 text-red-700 flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-xs underline font-bold">✕</button>
        </div>
      )}

      {/* KPI Quick Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <Card extra="p-4 flex flex-col justify-center">
          <span className="text-xs font-medium text-text-secondary">{t('roastedInventory.totalWeight')}</span>
          <span className="text-2xl font-bold text-text-primary mt-1">{totalRoastedKg.toLocaleString()} kg</span>
        </Card>
        <Card extra="p-4 flex flex-col justify-center border-s-4 border-s-blue-500">
          <span className="text-xs font-medium text-text-secondary">{t('roastedInventory.bag250g')} (250g)</span>
          <span className="text-2xl font-bold text-text-primary mt-1">{total250gBags} {t('roastedInventory.bags')}</span>
        </Card>
        <Card extra="p-4 flex flex-col justify-center border-s-4 border-s-sage">
          <span className="text-xs font-medium text-text-secondary">{t('roastedInventory.bag1kg')} (1kg)</span>
          <span className="text-2xl font-bold text-text-primary mt-1">{total1kgBags} {t('roastedInventory.bags')}</span>
        </Card>
        <Card extra="p-4 flex flex-col justify-center border-s-4 border-s-amber-500">
          <span className="text-xs font-medium text-text-secondary">{t('roastedInventory.dripBox')}</span>
          <span className="text-2xl font-bold text-text-primary mt-1">{totalDripBoxes} {t('roastedInventory.boxes')}</span>
        </Card>
        <Card extra="p-4 flex flex-col justify-center border-s-4 border-s-purple-500">
          <span className="text-xs font-medium text-text-secondary">{t('roastedInventory.bulk')}</span>
          <span className="text-2xl font-bold text-text-primary mt-1">{totalBulkKg.toLocaleString()} kg</span>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ChannelSplitChart
          data={CHANNELS.map(ch => ({
            channel: ch,
            kg: localStock.filter(s => s.channel === ch).reduce((acc, curr) => acc + (Number(curr.quantity_kg) || 0), 0),
          }))}
        />
        <Card extra="p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              ⚡ التحديث اليومي السريع / Daily Quick Workflow
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              استخدم أزرار <strong>[ + ]</strong> و <strong>[ - ]</strong> في مصفوفة المخزون أدناه لتحديث الأكياس والعلب مباشرة عند خروج أو استهلاك أي عبوة، أو استخدم زر <strong>تعبئة من الحبوب</strong> لتحويل حبوب البن المحمصة الخام إلى أكياس معبأة تلقائياً.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border mt-4">
            <button
              onClick={() => {
                setManualForm({
                  roast_batch_id: batches[0]?.id ?? '',
                  state: 'packed',
                  package_type: 'bag_250g',
                  package_size_g: 250,
                  unit_count: 1,
                  quantity_kg: 0.25,
                  channel: 'b2c',
                  status: 'in_stock',
                  produced_date: new Date().toISOString().split('T')[0],
                  notes: null,
                })
                setEditingId(null)
                setManualModalOpen(true)
              }}
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
            >
              + إضافة صنف مخصص يدوياً (Manual Custom Entry)
            </button>
          </div>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* LOT MATRIX VIEW (Grouped by Coffee Lot with Steppers)     */}
      {/* ========================================================= */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          {groupedByBatch.length === 0 ? (
            <Card extra="p-10 text-center text-text-secondary">
              {t('common.noData')}
            </Card>
          ) : (
            groupedByBatch.map(({ batchId, batch, items, bulkItem, totalKg }) => {
              const greenProfile = batch?.green_inventory
              const lotName = greenProfile?.lot_name || 'Lot ' + batchId.slice(0, 8)
              const availableBulkKg = bulkItem ? Number(bulkItem.quantity_kg) : 0

              return (
                <Card key={batchId} extra="p-5 border border-border shadow-sm space-y-4">
                  {/* Lot Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-text-primary">{lotName}</h3>
                        {greenProfile?.cup_score && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            ★ {greenProfile.cup_score}
                          </span>
                        )}
                        {greenProfile?.process && (
                          <span className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">
                            {greenProfile.process}
                          </span>
                        )}
                        {greenProfile?.variety && (
                          <span className="text-xs px-2 py-0.5 rounded bg-surface border border-border text-text-secondary">
                            {greenProfile.variety}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary mt-1 flex gap-3">
                        <span>📅 تاريخ التحميص: {batch?.roast_date || '—'}</span>
                        {greenProfile?.region && <span>📍 {greenProfile.region}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-end">
                        <span className="text-xs text-text-secondary block">إجمالي وزن هذا المحصول</span>
                        <span className="text-lg font-bold text-accent">{totalKg} kg</span>
                      </div>
                      <Button
                        onClick={() => {
                          setPackForm(p => ({ ...p, batchId: batchId }))
                          setPackModalOpen(true)
                        }}
                        variant="primary"
                        size="sm"
                      >
                        📦 تعبئة أكياس
                      </Button>
                    </div>
                  </div>

                  {/* Bulk Stock Banner if available */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🛢️</span>
                      <div>
                        <span className="font-semibold text-text-primary">
                          حبوب خام غير معبأة (Bulk Beans):
                        </span>{' '}
                        <span className="font-bold text-purple-600 text-sm">
                          {availableBulkKg} kg
                        </span>{' '}
                        <span className="text-text-secondary">(في المستودع الرئيسي)</span>
                      </div>
                    </div>
                    {availableBulkKg > 0 && (
                      <span className="text-[11px] text-purple-600 font-medium">
                        جاهز للتعبئة في أكياس 250جم أو 1كجم أو علب أظراف
                      </span>
                    )}
                  </div>

                  {/* Matrix Table: Packaging Types (Rows) x Channels (Columns) */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-start border-collapse">
                      <thead>
                        <tr className="border-b border-border text-text-secondary">
                          <th className="py-2 px-3 text-start font-semibold">نوع التعبئة (Packaging)</th>
                          <th className="py-2 px-3 text-center font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <Badge label="البار (Bar)" variant="sage" />
                            </span>
                          </th>
                          <th className="py-2 px-3 text-center font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <Badge label="المتجر (B2C)" variant="blue" />
                            </span>
                          </th>
                          <th className="py-2 px-3 text-center font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <Badge label="الجملة (B2B)" variant="yellow" />
                            </span>
                          </th>
                          <th className="py-2 px-3 text-center font-semibold">
                            <span className="inline-flex items-center gap-1">
                              <Badge label="المستودع (Unallocated)" variant="gray" />
                            </span>
                          </th>
                          <th className="py-2 px-3 text-end font-semibold">إجمالي الوحدات</th>
                          <th className="py-2 px-3 text-end font-semibold">الوزن (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {PACK_TYPES.map(pkgType => {
                          const pkgItems = items.filter(i => i.package_type === pkgType)
                          const rowTotalUnits = pkgItems.reduce((acc, curr) => acc + (curr.unit_count || 0), 0)
                          const rowTotalKg = Math.round(pkgItems.reduce((acc, curr) => acc + (Number(curr.quantity_kg) || 0), 0) * 100) / 100

                          const pkgLabel =
                            pkgType === 'bag_1kg'
                              ? 'أكياس 1 كجم (1kg Bag)'
                              : pkgType === 'bag_250g'
                              ? 'أكياس 250 جرام (250g Bag)'
                              : 'علب أظراف فلتر (Drip Box)'

                          const unitLabel = pkgType === 'drip_box' ? 'علبة' : 'كيس'

                          return (
                            <tr key={pkgType} className="hover:bg-background/40 transition-colors">
                              {/* Packaging format label */}
                              <td className="py-3 px-3 font-semibold text-text-primary whitespace-nowrap">
                                <span className="text-base me-1.5">
                                  {pkgType === 'bag_1kg' ? '🛍️' : pkgType === 'bag_250g' ? '☕' : '📦'}
                                </span>
                                {pkgLabel}
                              </td>

                              {/* Channels: Bar, B2C, B2B, Unallocated */}
                              {(['bar', 'b2c', 'b2b', 'unallocated'] as const).map(channel => {
                                const cellItem = items.find(
                                  i => i.package_type === pkgType && i.channel === channel
                                )
                                const count = cellItem?.unit_count ?? 0

                                return (
                                  <td key={channel} className="py-2 px-2 text-center">
                                    <div className="inline-flex items-center justify-center gap-1.5 bg-surface border border-border rounded-lg p-1 shadow-xs">
                                      <button
                                        onClick={() => handleQuickStep(batchId, pkgType, channel, -1)}
                                        disabled={count <= 0 || isPending}
                                        className="w-6 h-6 flex items-center justify-center rounded bg-background hover:bg-red-500/10 hover:text-red-600 font-bold text-sm text-text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                        title="انقاص وحدة واحدة (-1)"
                                      >
                                        -
                                      </button>
                                      <span
                                        className={`w-9 text-center font-bold text-xs ${
                                          count > 0 ? 'text-text-primary' : 'text-text-secondary/40'
                                        }`}
                                      >
                                        {count}
                                      </span>
                                      <button
                                        onClick={() => handleQuickStep(batchId, pkgType, channel, +1)}
                                        disabled={isPending}
                                        className="w-6 h-6 flex items-center justify-center rounded bg-background hover:bg-accent/15 hover:text-accent font-bold text-sm text-text-secondary transition-colors"
                                        title="زيادة وحدة واحدة (+1)"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                )
                              })}

                              {/* Row Summary */}
                              <td className="py-3 px-3 text-end font-bold text-text-primary">
                                {rowTotalUnits} {unitLabel}
                              </td>
                              <td className="py-3 px-3 text-end font-semibold text-text-secondary">
                                {rowTotalKg} kg
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DETAILED TABLE VIEW (Full Ledger & Edit Mode)             */}
      {/* ========================================================= */}
      {viewMode === 'table' && (
        <Table headers={headers}>
          {localStock.length === 0 ? (
            <tr>
              <TableCell className="py-10 text-center text-text-primary/50">{t('common.noData')}</TableCell>
            </tr>
          ) : (
            localStock.map(row => (
              <TableRow key={row.id}>
                <TableCell className="py-4 px-4 text-sm font-semibold text-text-secondary">
                  {row.produced_date}
                </TableCell>
                <TableCell>
                  <span className="font-bold text-text-primary block">
                    {row.roast_batches?.green_inventory?.lot_name ?? '—'}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {row.roast_batches?.roast_date}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm">
                  <span className="font-medium text-text-primary">
                    {row.package_type === 'bag_1kg'
                      ? 'كيس 1 كجم'
                      : row.package_type === 'bag_250g'
                      ? 'كيس 250 جرام'
                      : row.package_type === 'drip_box'
                      ? 'علبة أظراف فلتر'
                      : 'حبوب غير معبأة (Bulk)'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge label={row.channel} variant={channelVariant[row.channel]} />
                </TableCell>
                <TableCell>
                  <Badge
                    label={t(`roastedInventory.${row.status === 'in_stock' ? 'inStock' : row.status}`)}
                    variant={statusVariant[row.status]}
                  />
                </TableCell>
                <TableCell className="px-4 py-3 text-sm font-bold text-text-primary">
                  {row.unit_count != null ? `${row.unit_count} وحدات` : '—'}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm font-medium text-text-secondary">
                  {row.quantity_kg} kg
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingId(row.id)
                        setManualForm({
                          roast_batch_id: row.roast_batch_id,
                          state: row.state,
                          package_type: row.package_type,
                          package_size_g: row.package_size_g,
                          unit_count: row.unit_count,
                          quantity_kg: row.quantity_kg,
                          channel: row.channel,
                          status: row.status,
                          produced_date: row.produced_date,
                          notes: row.notes,
                        })
                        setManualModalOpen(true)
                      }}
                      variant="secondary"
                      size="sm"
                    >
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
      )}

      {/* ========================================================= */}
      {/* MODAL 1: Pack from Bulk (تعبئة من الحبوب المحمصة)          */}
      {/* ========================================================= */}
      <Modal isOpen={packModalOpen} onClose={() => setPackModalOpen(false)} title="📦 تعبئة من الحبوب (Pack from Bulk)" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              اختر دفعة البن المحمص <span className="text-red-500">*</span>
            </label>
            <select
              value={packForm.batchId}
              onChange={e => setPackForm(p => ({ ...p, batchId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.green_inventory?.lot_name || 'Batch'} — {b.roast_date}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                نوع التعبئة المراد إنتاجه <span className="text-red-500">*</span>
              </label>
              <select
                value={packForm.packageType}
                onChange={e => setPackForm(p => ({ ...p, packageType: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              >
                <option value="bag_250g">أكياس 250 جرام (250g Bag)</option>
                <option value="bag_1kg">أكياس 1 كجم (1kg Bag)</option>
                <option value="drip_box">علبة أظراف فلتر (Drip Filter Box)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                القناة المخصصة <span className="text-red-500">*</span>
              </label>
              <select
                value={packForm.targetChannel}
                onChange={e => setPackForm(p => ({ ...p, targetChannel: e.target.value as ChannelType }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              >
                <option value="b2c">المتجر / قطاعي (B2C)</option>
                <option value="bar">البار (Bar)</option>
                <option value="b2b">الجملة (B2B)</option>
                <option value="unallocated">المستودع الرئيسي (Unallocated)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              عدد الوحدات المراد تعبئتها <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={packForm.unitCount || ''}
              onChange={e => setPackForm(p => ({ ...p, unitCount: parseInt(e.target.value) || 0 }))}
              placeholder="e.g. 20"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {/* Real-time Calculation Summary */}
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-xs text-text-primary space-y-1">
            <span className="font-bold block">معاينة الحساب التلقائي:</span>
            <span>
              سيتم خصم{' '}
              <strong>
                {computeQuantityKg(packForm.packageType, packForm.unitCount, 0)} kg
              </strong>{' '}
              من البن المحمص الخام (Bulk)، وإضافة{' '}
              <strong>{packForm.unitCount}</strong> وحدة من نوع{' '}
              <strong>{packForm.packageType}</strong> إلى قناة{' '}
              <strong>{packForm.targetChannel}</strong>.
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">ملاحظات</label>
            <input
              type="text"
              value={packForm.notes}
              onChange={e => setPackForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="e.g. تعبئة خاصة لطلب متجر"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={handlePackSubmit} disabled={isPending} variant="primary" className="flex-1">
              {isPending ? t('common.loading') : 'تأكيد التعبئة والخصم'}
            </Button>
            <Button onClick={() => setPackModalOpen(false)} variant="secondary" className="flex-1">
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 2: Transfer / Allocate (تحويل وتوزيع بين القنوات)     */}
      {/* ========================================================= */}
      <Modal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} title="⇄ تحويل وتخصيص المخزون (Transfer Stock)" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              اختر العنصر المراد نقله <span className="text-red-500">*</span>
            </label>
            <select
              value={transferForm.stockId}
              onChange={e => setTransferForm(p => ({ ...p, stockId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              {localStock.map(s => (
                <option key={s.id} value={s.id}>
                  {s.roast_batches?.green_inventory?.lot_name || 'Lot'} — [{s.package_type}] — (قناة: {s.channel}) — متاح: {s.unit_count ? `${s.unit_count} وحدات` : `${s.quantity_kg} kg`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                نقل إلى القناة <span className="text-red-500">*</span>
              </label>
              <select
                value={transferForm.toChannel}
                onChange={e => setTransferForm(p => ({ ...p, toChannel: e.target.value as ChannelType }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              >
                <option value="bar">البار (Bar)</option>
                <option value="b2c">المتجر / تجزئة (B2C)</option>
                <option value="b2b">مبيعات الجملة (B2B)</option>
                <option value="unallocated">المستودع الرئيسي (Unallocated)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                الكمية المراد نقلها (وحدات) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={transferForm.units || ''}
                onChange={e => setTransferForm(p => ({ ...p, units: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">ملاحظة التحويل</label>
            <input
              type="text"
              value={transferForm.notes}
              onChange={e => setTransferForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="e.g. صرف للبار لتشغيل اليوم"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button onClick={handleTransferSubmit} disabled={isPending} variant="primary" className="flex-1">
              {isPending ? t('common.loading') : 'تنفيذ التحويل'}
            </Button>
            <Button onClick={() => setTransferModalOpen(false)} variant="secondary" className="flex-1">
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 3: Full Add/Edit Manual Modal                       */}
      {/* ========================================================= */}
      <Modal
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        title={editingId ? t('roastedInventory.editStock') : t('roastedInventory.addStock')}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {t('roastedInventory.roastBatch')} <span className="text-red-500">*</span>
            </label>
            <select
              value={manualForm.roast_batch_id}
              onChange={e => setManualForm(p => ({ ...p, roast_batch_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              <option value="">{t('roastedInventory.selectBatch')}</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.roast_date} — {b.green_inventory?.lot_name ?? 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('roastedInventory.packageType')}
              </label>
              <select
                value={manualForm.package_type}
                onChange={e => {
                  const pType = e.target.value as PackageType
                  setManualForm(p => ({
                    ...p,
                    package_type: pType,
                    state: pType === 'bulk' ? 'bulk' : 'packed',
                    quantity_kg: computeQuantityKg(pType, p.unit_count ?? 1, p.quantity_kg),
                  }))
                }}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              >
                <option value="bag_250g">كيس 250 جرام (250g Bag)</option>
                <option value="bag_1kg">كيس 1 كجم (1kg Bag)</option>
                <option value="drip_box">علبة أظراف فلتر (Drip Box)</option>
                <option value="bulk">حبوب غير معبأة (Bulk Beans)</option>
                <option value="custom">مخصص (Custom Size)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('roastedInventory.channel')}
              </label>
              <select
                value={manualForm.channel}
                onChange={e => setManualForm(p => ({ ...p, channel: e.target.value as ChannelType }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              >
                <option value="unallocated">غير مخصص (Unallocated)</option>
                <option value="bar">البار (Bar)</option>
                <option value="b2c">المتجر (B2C)</option>
                <option value="b2b">الجملة (B2B)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {manualForm.package_type !== 'bulk' ? (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {t('roastedInventory.unitCount')} (عدد العلب/الأكياس) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={manualForm.unit_count ?? ''}
                  onChange={e => {
                    const u = parseInt(e.target.value) || 0
                    setManualForm(p => ({
                      ...p,
                      unit_count: u,
                      quantity_kg: computeQuantityKg(p.package_type, u, 0, p.package_size_g),
                    }))
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  الوزن الإجمالي (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={manualForm.quantity_kg || ''}
                  onChange={e => setManualForm(p => ({ ...p, quantity_kg: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                {t('roastedInventory.status')}
              </label>
              <select
                value={manualForm.status}
                onChange={e => setManualForm(p => ({ ...p, status: e.target.value as StatusType }))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              >
                <option value="in_stock">{t('roastedInventory.inStock')}</option>
                <option value="shipped">{t('roastedInventory.shipped')}</option>
                <option value="sold">{t('roastedInventory.sold')}</option>
                <option value="consumed">{t('roastedInventory.consumed')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {t('roastedInventory.producedDate')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={manualForm.produced_date}
              onChange={e => setManualForm(p => ({ ...p, produced_date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {t('roastedInventory.notes')}
            </label>
            <textarea
              value={manualForm.notes ?? ''}
              rows={2}
              onChange={e => setManualForm(p => ({ ...p, notes: e.target.value || null }))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleManualSave} disabled={isPending} variant="primary" className="flex-1">
              {isPending ? t('common.loading') : t('common.save')}
            </Button>
            <Button onClick={() => setManualModalOpen(false)} variant="secondary" className="flex-1">
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
