'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface SaleInput {
  date: string
  channel: 'b2c' | 'b2b'
  product_description: string
  quantity: number
  unit: 'kg' | 'units'
  revenue?: number | null
  source: 'manual' | 'salla' | 'rewaa'
  external_order_id?: string | null
}

export async function addSale(input: SaleInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales_log').insert([input])
  if (error) throw new Error(error.message)
  revalidatePath('/sales')
  revalidatePath('/dashboard')
  revalidatePath('/movements')
}

export async function updateSale(id: string, input: Partial<SaleInput>) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales_log').update(input).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/sales')
  revalidatePath('/dashboard')
}

export async function deleteSale(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales_log').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/sales')
  revalidatePath('/dashboard')
}

export async function importSales(rows: Record<string, string>[]) {
  const supabase = await createClient()
  const validChannels = ['b2c', 'b2b']
  const validUnits = ['kg', 'units']
  const validSources = ['manual', 'salla', 'rewaa']

  const inserts = rows
    .filter(row => row.product_description && row.quantity)
    .map(row => ({
      date: row.date?.trim() || new Date().toISOString().split('T')[0],
      channel: validChannels.includes(row.channel?.trim()) ? row.channel.trim() : 'b2c',
      product_description: row.product_description?.trim(),
      quantity: parseFloat(row.quantity) || 0,
      unit: validUnits.includes(row.unit?.trim()) ? row.unit.trim() : 'units',
      revenue: row.revenue ? parseFloat(row.revenue) : null,
      source: validSources.includes(row.source?.trim()) ? row.source.trim() : 'manual',
      external_order_id: row.external_order_id?.trim() || null,
    }))

  if (inserts.length === 0) throw new Error('No valid rows to import.')
  const { error } = await supabase.from('sales_log').insert(inserts)
  if (error) throw new Error(error.message)
  revalidatePath('/sales')
  revalidatePath('/dashboard')
  return inserts.length
}
