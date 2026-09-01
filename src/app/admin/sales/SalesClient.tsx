'use client'
import { Button } from '@/components/ui/Button'

import { useState, useTransition, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import CsvExport from '@/components/CsvExport'
import CsvImport from '@/components/CsvImport'
import { addSale, deleteSale, importSales, type SaleInput } from '@/app/actions/sales'
type ChannelType = 'b2c' | 'b2b'
type SourceType = 'manual' | 'salla' | 'rewaa'

interface SaleRow {
  id: string
  date: string
  channel: ChannelType
  product_description: string
  quantity: number
  unit: 'kg' | 'units'
  revenue: number | null
  source: SourceType
  external_order_id: string | null
}

interface SalesClientProps {
  sales: SaleRow[]
}

const EMPTY_FORM: SaleInput = {
  date: new Date().toISOString().split('T')[0],
  channel: 'b2c',
  product_description: '',
  quantity: 0,
  unit: 'units',
  revenue: null,
  source: 'manual',
  external_order_id: null,
}

const channelVariant: Record<ChannelType, 'blue' | 'yellow'> = { b2c: 'blue', b2b: 'yellow' }
const sourceVariant: Record<SourceType, 'green' | 'blue' | 'sage'> = { manual: 'green', salla: 'blue', rewaa: 'sage' }

export default function SalesClient({ sales }: SalesClientProps) {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<SaleInput>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<string | null>(null)
  const [filterChannel, setFilterChannel] = useState<'all' | ChannelType>('all')

  const filteredSales = useMemo(() =>
    filterChannel === 'all' ? sales : sales.filter(s => s.channel === filterChannel),
    [sales, filterChannel]
  )

  function handleSave() {
    setError(null)
    if (!form.product_description || !form.date || form.quantity <= 0) {
      setError(t('common.fillRequired'))
      return
    }
    // @ts-expect-error React 19
    startTransition(async () => {
      try {
        await addSale(form)
        setModalOpen(false)
        setForm(EMPTY_FORM)
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
        await deleteSale(id)
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
      const count = await importSales(rows)
      setImportResult(t('common.importSuccess') + ' ' + count)
      router.refresh()
    } catch (e) {
      setImportResult(e instanceof Error ? e.message : 'Import failed')
    }
  }, [locale, router])

  const exportData = filteredSales.map(({ id: _id, ...rest }) => rest)

  const totalRevenue = filteredSales.reduce((s, r) => s + (r.revenue ?? 0), 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-olive">{t('sales.title')}</h1>
        <div className="flex flex-wrap gap-2">
          <CsvImport onImport={handleImport} label={t('sales.importCsv')}
            expectedColumns={['date', 'channel', 'product_description', 'quantity', 'unit', 'revenue', 'source']} />
          <CsvExport data={exportData} filename="sales.csv" label={t('sales.exportCsv')} />
          <Button onClick={() => { setForm(EMPTY_FORM); setError(null); setModalOpen(true) }} variant="primary" size="md">
            + {t('sales.addSale')}
          </Button>
        </div>
      </div>

      {importResult && (
        <div className={`text-sm px-4 py-3 rounded-lg border ${importResult.includes('port') || importResult.includes('Ø§Ø³ØªÙŠØ±Ø§Ø¯') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {importResult}
          <button className="ms-2 text-xs underline" onClick={() => setImportResult(null)}>âœ•</button>
        </div>
      )}

      {/* Filter + summary row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-olive">{t('sales.filterByChannel')}:</label>
          <select value={filterChannel} onChange={e => setFilterChannel(e.target.value as 'all' | ChannelType)}
            className="px-3 py-1.5 rounded-lg border border-cream-dark bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sage">
            <option value="all">{t('sales.all')}</option>
            <option value="b2c">B2C</option>
            <option value="b2b">B2B</option>
          </select>
        </div>
        <div className="ms-auto flex gap-4 text-sm text-olive">
          <span>{filteredSales.length} {t('sales.entries')}</span>
          {totalRevenue > 0 && (
            <span className="font-medium text-sage">{t('sales.revenuePrefix')} {totalRevenue.toLocaleString()}</span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-horizon-sm p-4">
        <table className="w-full min-w-max text-start">
          <thead>
            <tr className="border-b border-light">
              {[
                t('sales.date'),
                t('sales.channel'),
                t('sales.productDescription'),
                t('sales.quantity'),
                t('sales.revenue'),
                t('sales.source'),
                t('greenInventory.actions'),
              ].map(h => (
                <th key={h} className="pb-3 pt-4 px-4 text-start text-xs font-bold text-olive/60 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-olive/50">{t('common.noData')}</td>
              </tr>
            ) : (
              filteredSales.map(sale => (
                <tr key={sale.id} className="border-b border-light/50 transition-colors hover:bg-light/30">
                  <td className="py-4 px-4 text-sm font-semibold text-charcoal">{sale.date}</td>
                  <td className="py-4 px-4 text-sm text-charcoal"><Badge label={sale.channel.toUpperCase()} variant={channelVariant[sale.channel]} /></td>
                  <td className="px-4 py-3 text-sm text-charcoal max-w-xs">{sale.product_description}</td>
                  <td className="px-4 py-3 text-sm text-charcoal whitespace-nowrap">
                    {sale.quantity} {sale.unit === 'kg' ? 'kg' : (t('sales.units'))}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-charcoal">
                    {sale.revenue != null ? sale.revenue.toLocaleString() : 'â€”'}
                  </td>
                  <td className="px-4 py-3"><Badge label={sale.source} variant={sourceVariant[sale.source]} /></td>
                  <td className="px-4 py-3">
                    <Button onClick={() => setDeleteId(sale.id)} variant="danger" size="sm">
                      {t('common.delete')}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={t('sales.addSale')} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-olive mb-1">{t('sales.date')} <span className="text-red-500">*</span></label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive mb-1">{t('sales.channel')}</label>
              <select value={form.channel} onChange={e => setForm(p => ({ ...p, channel: e.target.value as ChannelType }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm">
                <option value="b2c">B2C</option>
                <option value="b2b">B2B</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-olive mb-1">{t('sales.productDescription')} <span className="text-red-500">*</span></label>
            <input type="text" value={form.product_description} onChange={e => setForm(p => ({ ...p, product_description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-olive mb-1">{t('sales.quantity')} <span className="text-red-500">*</span></label>
              <input type="number" step="0.01" min="0" value={form.quantity || ''}
                onChange={e => setForm(p => ({ ...p, quantity: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive mb-1">{t('sales.unit')}</label>
              <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value as 'kg' | 'units' }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm">
                <option value="units">{t('sales.units')}</option>
                <option value="kg">{t('sales.kg')}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-olive mb-1">{t('sales.revenue')}</label>
              <input type="number" step="0.01" min="0" value={form.revenue ?? ''}
                onChange={e => setForm(p => ({ ...p, revenue: e.target.value ? parseFloat(e.target.value) : null }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-olive mb-1">{t('sales.source')}</label>
              <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value as SourceType }))}
                className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm">
                <option value="manual">{t('sales.manual')}</option>
                <option value="salla">{t('sales.salla')}</option>
                <option value="rewaa">{t('sales.rewaa')}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-olive mb-1">
              {t('sales.externalOrderId')}
            </label>
            <input type="text" value={form.external_order_id ?? ''}
              onChange={e => setForm(p => ({ ...p, external_order_id: e.target.value || null }))}
              className="w-full px-3 py-2 rounded-lg border border-cream-dark bg-cream-light text-charcoal focus:outline-none focus:ring-2 focus:ring-sage text-sm" />
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
        <p className="text-sm text-charcoal mb-4">{t('sales.confirmDeleteSale')}</p>
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

