import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import KpiCard from '@/components/ui/KpiCard'
import YieldChart from '@/components/YieldChart'
import Badge from '@/components/ui/Badge'
import type { Locale } from '@/lib/i18n/translations'
import { translations } from '@/lib/i18n/translations'

const LOW_STOCK_GREEN_KG = parseFloat(process.env.NEXT_PUBLIC_LOW_STOCK_GREEN_KG ?? '60')
const LOW_STOCK_ROASTED_KG = parseFloat(process.env.NEXT_PUBLIC_LOW_STOCK_ROASTED_KG ?? '5')

function formatKg(n: number) {
  return n.toFixed(1)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const cookieStore = await cookies()
  const locale = (cookieStore.get('moreine-lang')?.value ?? 'en') as Locale
  const tr = translations[locale]

  // Parallel data fetching
  const [
    { data: greenLots },
    { data: roastedStock },
    { data: recentBatchesRaw },
    { data: recentMovements },
  ] = await Promise.all([
    supabase.from('green_inventory').select('id, lot_name, remaining_kg, origin').order('arrival_date', { ascending: false }),
    supabase.from('roasted_stock').select('id, state, channel, quantity_kg, status').eq('status', 'in_stock'),
    supabase.from('roast_batches').select('id, roast_date, yield_pct, green_inventory(lot_name)').order('roast_date', { ascending: false }).limit(10),
    supabase.from('stock_movements').select('*').order('date', { ascending: false }).limit(10),
  ])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentBatches = recentBatchesRaw as any[] | null


  // KPIs
  const totalGreenKg = (greenLots ?? []).reduce((s, l) => s + (l.remaining_kg ?? 0), 0)

  const inStock = (roastedStock ?? [])
  const bulkKg = inStock.filter(s => s.state === 'bulk').reduce((s, r) => s + (r.quantity_kg ?? 0), 0)
  const packedKg = inStock.filter(s => s.state === 'packed').reduce((s, r) => s + (r.quantity_kg ?? 0), 0)
  const totalRoastedKg = bulkKg + packedKg

  // Low-stock alerts
  const lowGreenLots = (greenLots ?? []).filter(l => l.remaining_kg < LOW_STOCK_GREEN_KG)
  const channelTotals = ['bar', 'b2c', 'b2b'].map(ch => ({
    channel: ch,
    kg: inStock.filter(s => s.channel === ch).reduce((s, r) => s + (r.quantity_kg ?? 0), 0),
  })).filter(c => c.kg < LOW_STOCK_ROASTED_KG)
  const hasAlerts = lowGreenLots.length > 0 || channelTotals.length > 0

  // Yield trend
  const avgYield = recentBatches && recentBatches.length > 0
    ? recentBatches.reduce((s, b) => s + (b.yield_pct ?? 0), 0) / recentBatches.length
    : 0
  const yieldData = (recentBatches ?? [])
    .slice()
    .reverse()
    .map((b: Record<string, unknown>) => ({
      roast_date: b.roast_date as string,
      yield_pct: (b.yield_pct as number) ?? 0,
      lot_name: (b.green_inventory as { lot_name?: string } | null)?.lot_name ?? '',
    }))


  // Channel breakdown
  const byChannel = ['unallocated', 'bar', 'b2c', 'b2b'].map(ch => ({
    ch,
    kg: inStock.filter(s => s.channel === ch).reduce((s, r) => s + (r.quantity_kg ?? 0), 0),
  }))

  const actionBadgeVariant: Record<string, 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'sage'> = {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-olive">{tr.dashboard.title}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title={tr.dashboard.totalGreenStock}
          value={formatKg(totalGreenKg)}
          unit="kg"
          icon={<span className="text-2xl">🌿</span>}
          alert={totalGreenKg < LOW_STOCK_GREEN_KG}
        />
        <KpiCard
          title={tr.dashboard.roastedStock}
          value={formatKg(totalRoastedKg)}
          unit="kg"
          icon={<span className="text-2xl">☕</span>}
          subtitle={`${tr.dashboard.bulk}: ${formatKg(bulkKg)} kg · ${tr.dashboard.packed}: ${formatKg(packedKg)} kg`}
        />
        <KpiCard
          title={tr.dashboard.avgYield}
          value={avgYield.toFixed(1)}
          unit="%"
          icon={<span className="text-2xl">📊</span>}
          subtitle={locale === 'ar' ? `آخر ${recentBatches?.length ?? 0} دفعة` : `Last ${recentBatches?.length ?? 0} batches`}
        />
        <KpiCard
          title={tr.dashboard.lowStockAlerts}
          value={lowGreenLots.length + channelTotals.length}
          icon={<span className="text-2xl">{hasAlerts ? '⚠️' : '✅'}</span>}
          alert={hasAlerts}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yield Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-horizon-sm p-6">
          <h2 className="text-lg font-bold text-olive mb-4">
            {locale === 'ar' ? 'اتجاه نسبة الحمص (آخر ١٠ دفعات)' : 'Roast Yield Trend (Last 10 Batches)'}
          </h2>
          <YieldChart data={yieldData} />
        </div>

        {/* Channel Breakdown */}
        <div className="bg-white rounded-xl shadow-horizon-sm p-6">
          <h2 className="text-lg font-bold text-olive mb-4">
            {locale === 'ar' ? 'المخزون حسب القناة' : 'Stock by Channel'}
          </h2>
          <div className="space-y-3">
            {byChannel.map(({ ch, kg }) => (
              <div key={ch} className="flex items-center justify-between">
                <span className="text-sm text-charcoal capitalize">{ch}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-cream rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-sage rounded-full"
                      style={{ width: totalRoastedKg > 0 ? `${Math.min(100, (kg / totalRoastedKg) * 100)}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs text-olive/70 w-16 text-right">{formatKg(kg)} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low-Stock Alerts */}
      {hasAlerts && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-amber-800 mb-3">
            {locale === 'ar' ? '⚠️ تنبيهات المخزون المنخفض' : '⚠️ Low Stock Alerts'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {lowGreenLots.map(l => (
              <span key={l.id} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
                {locale === 'ar' ? `🌿 ${l.lot_name}: ${formatKg(l.remaining_kg)} كجم` : `🌿 ${l.lot_name}: ${formatKg(l.remaining_kg)} kg`}
              </span>
            ))}
            {channelTotals.map(c => (
              <span key={c.channel} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
                {locale === 'ar' ? `☕ قناة ${c.channel}: ${formatKg(c.kg)} كجم` : `☕ ${c.channel} channel: ${formatKg(c.kg)} kg`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-horizon-sm overflow-hidden p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-olive">{tr.dashboard.recentActivity}</h2>
        </div>
        <div className="space-y-4">
          {(recentMovements ?? []).length === 0 ? (
            <div className="py-8 text-center text-olive/50 text-sm">{tr.common.noData}</div>
          ) : (
            (recentMovements ?? []).map(m => (
              <div key={m.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg hover:bg-light/50 transition">
                <div className="flex items-center gap-3 w-full">
                  <Badge label={m.action} variant={actionBadgeVariant[m.action] ?? 'gray'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate">
                      {m.category === 'green' ? '🌿' : '☕'} {m.note || m.action}
                    </p>
                    <p className="text-xs text-olive/50 mt-1">
                      {new Date(m.date).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-charcoal shrink-0">
                  {m.quantity_kg != null ? `${m.quantity_kg} kg` : '—'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
