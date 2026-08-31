'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface GreenLotInput {
  lot_name: string
  origin: string
  supplier: string
  arrival_date: string
  initial_kg: number
  remaining_kg: number
  cost_per_kg?: number | null
  notes?: string | null
}

export async function addGreenLot(input: GreenLotInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('green_inventory').insert([input])
  if (error) throw new Error(error.message)
  revalidatePath('/green-inventory')
  revalidatePath('/dashboard')
  revalidatePath('/movements')
}

export async function updateGreenLot(id: string, input: Partial<GreenLotInput>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('green_inventory')
    .update(input)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/green-inventory')
  revalidatePath('/dashboard')
}

export async function deleteGreenLot(id: string) {
  const supabase = await createClient()
  // Check if any roast batches reference this lot
  const { count } = await supabase
    .from('roast_batches')
    .select('id', { count: 'exact', head: true })
    .eq('green_lot_id', id)
  if (count && count > 0) {
    throw new Error('Cannot delete lot with existing roast batches.')
  }
  const { error } = await supabase.from('green_inventory').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/green-inventory')
  revalidatePath('/dashboard')
}

export async function importGreenLots(rows: Record<string, string>[]) {
  const supabase = await createClient()
  const inserts = rows
    .filter(row => row.lot_name && row.origin && row.supplier)
    .map(row => ({
      lot_name: row.lot_name?.trim(),
      origin: row.origin?.trim(),
      supplier: row.supplier?.trim(),
      arrival_date: row.arrival_date?.trim(),
      initial_kg: parseFloat(row.initial_kg) || 0,
      remaining_kg: parseFloat(row.remaining_kg ?? row.initial_kg) || 0,
      cost_per_kg: row.cost_per_kg ? parseFloat(row.cost_per_kg) : null,
      notes: row.notes?.trim() || null,
    }))

  if (inserts.length === 0) throw new Error('No valid rows to import.')
  const { error } = await supabase.from('green_inventory').insert(inserts)
  if (error) throw new Error(error.message)
  revalidatePath('/green-inventory')
  revalidatePath('/dashboard')
  return inserts.length
}
