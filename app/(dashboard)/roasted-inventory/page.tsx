import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RoastedInventoryClient from './RoastedInventoryClient'

export default async function RoastedInventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: stock }, { data: rawBatches }] = await Promise.all([
    supabase
      .from('roasted_stock')
      .select('*, roast_batches(roast_date, green_inventory(lot_name))')
      .order('produced_date', { ascending: false }),
    supabase
      .from('roast_batches')
      .select('id, roast_date, green_inventory(lot_name)')
      .order('roast_date', { ascending: false }),
  ])

  // Supabase returns FK joins as arrays; normalise to single object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const batches = (rawBatches ?? []).map((b: any) => ({
    id: b.id as string,
    roast_date: b.roast_date as string,
    green_inventory: Array.isArray(b.green_inventory)
      ? (b.green_inventory[0] ?? null)
      : b.green_inventory ?? null,
  }))

  return <RoastedInventoryClient stock={stock ?? []} batches={batches} />
}

