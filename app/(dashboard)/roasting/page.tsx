import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RoastingClient from './RoastingClient'

export default async function RoastingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: rawBatches }, { data: greenLots }] = await Promise.all([
    supabase
      .from('roast_batches')
      .select('*, green_inventory(lot_name, origin)')
      .order('roast_date', { ascending: false }),
    supabase
      .from('green_inventory')
      .select('id, lot_name, remaining_kg')
      .gt('remaining_kg', 0)
      .order('lot_name'),
  ])

  // Supabase returns FK joins as arrays; normalise to single object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const batches = (rawBatches ?? []).map((b: any) => ({
    id: b.id as string,
    roast_date: b.roast_date as string,
    input_kg: b.input_kg as number,
    output_kg: b.output_kg as number,
    yield_pct: b.yield_pct as number | null,
    notes: b.notes as string | null,
    green_inventory: Array.isArray(b.green_inventory)
      ? (b.green_inventory[0] ?? null)
      : b.green_inventory ?? null,
  }))

  return <RoastingClient batches={batches} greenLots={greenLots ?? []} />
}
