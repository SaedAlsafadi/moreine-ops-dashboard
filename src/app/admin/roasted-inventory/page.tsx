import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RoastedInventoryClient from './RoastedInventoryClient'

export const dynamic = 'force-dynamic'

export default async function RoastedInventoryPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) redirect('/auth/sign-in')

  const [{ data: stock }, { data: rawBatches }] = await Promise.all([
    supabase
      .from('roasted_stock')
      .select('*, roast_batches(id, roast_date, green_inventory(id, lot_name, origin, process, variety, region, cup_score))')
      .order('produced_date', { ascending: false }),
    supabase
      .from('roast_batches')
      .select('id, roast_date, green_inventory(id, lot_name, origin, process, variety, region, cup_score)')
      .order('roast_date', { ascending: false }),
  ])

  // Normalise FK joins
  const batches = (rawBatches ?? []).map((b: any) => ({
    id: b.id as string,
    roast_date: b.roast_date as string,
    green_inventory: Array.isArray(b.green_inventory)
      ? (b.green_inventory[0] ?? null)
      : b.green_inventory ?? null,
  }))

  const normalizedStock = (stock ?? []).map((s: any) => ({
    ...s,
    roast_batches: Array.isArray(s.roast_batches)
      ? (s.roast_batches[0] ?? null)
      : s.roast_batches ?? null,
  }))

  return <RoastedInventoryClient stock={normalizedStock} batches={batches} />
}