'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface RoastedStockInput {
  roast_batch_id: string
  state: 'bulk' | 'packed'
  package_size_g?: number | null
  unit_count?: number | null
  quantity_kg: number
  channel: 'unallocated' | 'bar' | 'b2c' | 'b2b'
  status: 'in_stock' | 'shipped' | 'sold' | 'consumed'
  produced_date: string
  notes?: string | null
}

export async function addRoastedStock(input: RoastedStockInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('roasted_stock').insert([input])
  if (error) throw new Error(error.message)
  revalidatePath('/roasted-inventory')
  revalidatePath('/dashboard')
  revalidatePath('/movements')
}

export async function updateRoastedStock(id: string, input: Partial<RoastedStockInput>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('roasted_stock')
    .update(input)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/roasted-inventory')
  revalidatePath('/dashboard')
  revalidatePath('/movements')
}

export async function deleteRoastedStock(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('roasted_stock').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/roasted-inventory')
  revalidatePath('/dashboard')
}

export async function importRoastedStock(rows: Record<string, string>[], batchId: string) {
  const supabase = await createClient()
  const validStates = ['bulk', 'packed']
  const validChannels = ['unallocated', 'bar', 'b2c', 'b2b']
  const validStatuses = ['in_stock', 'shipped', 'sold', 'consumed']

  const inserts = rows
    .filter(row => row.quantity_kg)
    .map(row => ({
      roast_batch_id: row.roast_batch_id?.trim() || batchId,
      state: validStates.includes(row.state?.trim()) ? row.state.trim() : 'bulk',
      package_size_g: row.package_size_g ? parseInt(row.package_size_g) : null,
      unit_count: row.unit_count ? parseInt(row.unit_count) : null,
      quantity_kg: parseFloat(row.quantity_kg) || 0,
      channel: validChannels.includes(row.channel?.trim()) ? row.channel.trim() : 'unallocated',
      status: validStatuses.includes(row.status?.trim()) ? row.status.trim() : 'in_stock',
      produced_date: row.produced_date?.trim() || new Date().toISOString().split('T')[0],
      notes: row.notes?.trim() || null,
    }))

  if (inserts.length === 0) throw new Error('No valid rows to import.')
  const { error } = await supabase.from('roasted_stock').insert(inserts)
  if (error) throw new Error(error.message)
  revalidatePath('/roasted-inventory')
  revalidatePath('/dashboard')
  return inserts.length
}
