'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface RoastBatchInput {
  green_lot_id: string
  roast_date: string
  input_kg: number
  output_kg: number
  notes?: string | null
}

/**
 * Add a roast batch. Business logic (multi-table orchestration) lives here in TS,
 * NOT in DB triggers, per the architecture decision.
 *
 * Steps:
 * 1. Validate input_kg <= green lot remaining_kg
 * 2. Insert roast_batches row
 * 3. Deduct input_kg from green_inventory.remaining_kg
 * 4. Auto-create a roasted_stock row (bulk, unallocated) with output_kg
 * 5. Insert a stock_movements row for the green deduction (roasted_out)
 * (The trigger on roasted_stock insert will add the roasted_in movement automatically)
 */
export async function addRoastBatch(input: RoastBatchInput) {
  const supabase = await createClient()

  // 1. Fetch the green lot
  const { data: lot, error: lotErr } = await supabase
    .from('green_inventory')
    .select('id, remaining_kg, lot_name')
    .eq('id', input.green_lot_id)
    .single()

  if (lotErr || !lot) throw new Error('Green lot not found.')
  if (input.input_kg > lot.remaining_kg) {
    throw new Error(
      `Input (${input.input_kg} kg) exceeds available green stock (${lot.remaining_kg} kg) for lot "${lot.lot_name}".`
    )
  }

  // 2. Insert roast batch
  const { data: batch, error: batchErr } = await supabase
    .from('roast_batches')
    .insert([{
      green_lot_id: input.green_lot_id,
      roast_date: input.roast_date,
      input_kg: input.input_kg,
      output_kg: input.output_kg,
      notes: input.notes ?? null,
    }])
    .select('id')
    .single()

  if (batchErr || !batch) throw new Error(batchErr?.message ?? 'Failed to create roast batch.')

  // 3. Deduct green remaining_kg
  const { error: deductErr } = await supabase
    .from('green_inventory')
    .update({ remaining_kg: lot.remaining_kg - input.input_kg })
    .eq('id', input.green_lot_id)

  if (deductErr) throw new Error(`Batch created but failed to deduct green stock: ${deductErr.message}`)

  // 4. Insert stock_movements for green deduction (roasted_out)
  const { error: movErr } = await supabase.from('stock_movements').insert([{
    category: 'green',
    ref_id: input.green_lot_id,
    action: 'roasted_out',
    quantity_kg: input.input_kg,
    note: `Roasted batch from lot: ${lot.lot_name}`,
  }])

  if (movErr) console.error('Failed to insert roasted_out movement:', movErr.message)

  // 5. Auto-create roasted_stock row (bulk, unallocated) — DB trigger will create roasted_in movement
  const { error: stockErr } = await supabase.from('roasted_stock').insert([{
    roast_batch_id: batch.id,
    state: 'bulk',
    channel: 'unallocated',
    quantity_kg: input.output_kg,
    status: 'in_stock',
    produced_date: input.roast_date,
    notes: `Auto-created from batch. ${input.notes ?? ''}`.trim(),
  }])

  if (stockErr) throw new Error(`Batch created but failed to create roasted stock: ${stockErr.message}`)

  revalidatePath('/roasting')
  revalidatePath('/green-inventory')
  revalidatePath('/roasted-inventory')
  revalidatePath('/dashboard')
  revalidatePath('/movements')
}

export async function deleteRoastBatch(id: string) {
  const supabase = await createClient()
  // Check for linked roasted_stock
  const { count } = await supabase
    .from('roasted_stock')
    .select('id', { count: 'exact', head: true })
    .eq('roast_batch_id', id)
  if (count && count > 0) {
    throw new Error('Cannot delete batch with existing roasted stock entries.')
  }
  const { error } = await supabase.from('roast_batches').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/roasting')
  revalidatePath('/dashboard')
}
