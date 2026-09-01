import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Widget from '@/components/widget/Widget'
import { YieldTrendChart } from './DashboardCharts'
import { MdInventory, MdLocalCafe, MdWarning, MdTrendingUp } from 'react-icons/md'
import Card from '@/components/card'
import React from 'react'
import { t } from '@/lib/i18n/translations'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const LOW_STOCK_GREEN_KG = parseFloat(process.env.NEXT_PUBLIC_LOW_STOCK_GREEN_KG ?? '60')
const LOW_STOCK_ROASTED_KG = parseFloat(process.env.NEXT_PUBLIC_LOW_STOCK_ROASTED_KG ?? '5')

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) redirect('/auth/sign-in')

  const cookieStore = await cookies()
  const locale = (cookieStore.get('moreine-lang')?.value === 'ar' ? 'ar' : 'en')

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

  return (
    <div className="space-y-8">
      <div className="mt-3 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-4">
        <Widget
          icon={<MdInventory className="h-7 w-7" />}
          title={t(locale as any, 'dashboard.greenCoffeeStock')}
          subtitle={`${totalGreenKg.toLocaleString()} kg`}
        />
        <Widget
          icon={<MdLocalCafe className="h-7 w-7" />}
          title={t(locale as any, 'dashboard.roastedStock')}
          subtitle={`${totalRoastedKg.toLocaleString()} kg`}
        />
        <Widget
          icon={<MdTrendingUp className="h-7 w-7" />}
          title={t(locale as any, 'dashboard.averageYield')}
          subtitle={`${avgYield.toFixed(1)}%`}
        />
        <Widget
          icon={<MdWarning className={`h-7 w-7 ${hasAlerts ? 'text-amber-500' : 'text-green-500'}`} />}
          title={t(locale as any, 'dashboard.lowStockAlerts')}
          subtitle={(lowGreenLots.length + channelTotals.length).toString()}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <YieldTrendChart data={recentBatches ?? []} />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card extra="p-5">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">
              {t(locale as any, 'dashboard.alerts')}
            </h2>
          </header>
          <div className="mt-4 flex flex-col gap-3">
            {!hasAlerts ? (
              <p className="text-sm text-text-secondary">{t(locale as any, 'dashboard.noAlertsMsg')}</p>
            ) : (
              <>
                {lowGreenLots.map(l => (
                  <div key={l.id} className="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-700">
                    🌿 {l.lot_name}: {l.remaining_kg} kg left
                  </div>
                ))}
                {channelTotals.map(c => (
                  <div key={c.channel} className="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-700">
                    ☕ {c.channel}: {c.kg} kg left
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>

        <Card extra="p-5">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">
              {t(locale as any, 'dashboard.recentActivity')}
            </h2>
          </header>
          <div className="mt-4 flex flex-col gap-3">
            {(recentMovements ?? []).length === 0 ? (
              <p className="text-sm text-text-secondary">{t(locale as any, 'dashboard.noDataMsg')}</p>
            ) : (
              recentMovements!.map(m => (
                <div key={m.id} className="flex items-center justify-between border-b border-border pb-3 last:border-none">
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-text-primary">
                      {m.category === 'green' ? '🌿' : '☕'} {m.action}
                    </p>
                    <p className="text-xs text-text-secondary">{m.note}</p>
                  </div>
                  <div className="text-sm font-medium text-text-primary">
                    {m.quantity_kg ? `${m.quantity_kg} kg` : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}






