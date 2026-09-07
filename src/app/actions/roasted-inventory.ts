'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { computeQuantityKg, type PackageType, type ChannelType, type StatusType } from '@/lib/inventory-utils'





export interface RoastedStockInput {
  roast_batch_id: string
  state: 'bulk' | 'packed'
  package_type: PackageType
  package_size_g?: number | null
  unit_count?: number | null
  box_sachets_count?: number | null
  quantity_kg: number
  channel: ChannelType
  status: StatusType
  produced_date: string
  notes?: string | null
}



export async function addRoastedStock(input: RoastedStockInput) {
  const supabase = await createClient()

  // Prevent duplicate active rows: check if matching active row already exists
  const { data: existing } = await supabase
    .from('roasted_stock')
    .select('*')
    .eq('roast_batch_id', input.roast_batch_id)
    .eq('channel', input.channel)
    .eq('package_type', input.package_type)
    .eq('status', 'in_stock')
    .limit(1)

  if (existing && existing.length > 0) {
    const cur = existing[0]
    const nextUnits = (cur.unit_count || 0) + (input.unit_count || 0)
    const nextKg = computeQuantityKg(
      input.package_type,
      nextUnits,
      (Number(cur.quantity_kg) || 0) + (Number(input.quantity_kg) || 0),
      input.package_size_g
    )
    const { error } = await supabase
      .from('roasted_stock')
      .update({
        unit_count: nextUnits,
        quantity_kg: nextKg,
      })
      .eq('id', cur.id)
    if (error) throw new Error(error.message)
  } else {
    const payload = {
      ...input,
      quantity_kg: computeQuantityKg(input.package_type, input.unit_count ?? null, input.quantity_kg, input.package_size_g),
      state: input.package_type === 'bulk' ? 'bulk' : 'packed',
      package_size_g: input.package_type === 'bag_1kg' ? 1000 : input.package_type === 'bag_250g' ? 250 : input.package_type === 'drip_box' ? 75 : input.package_size_g ?? null,
    }
    const { error } = await supabase.from('roasted_stock').insert([payload])
    if (error) throw new Error(error.message)
  }

  revalidatePath('/admin/roasted-inventory')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/movements')
}

// -------------------------------------------------------------
// Idempotent Direct Count Action (Set exact count or stepper delta)
// -------------------------------------------------------------
export async function setStockCount(params: {
  roastBatchId: string
  packageType: PackageType
  channel: ChannelType
  unitCount: number
  notes?: string
}) {
  const supabase = await createClient()
  const targetUnits = Math.max(0, Math.round(Number(params.unitCount) || 0))
  const packageSizeG = params.packageType === 'bag_1kg' ? 1000 : params.packageType === 'bag_250g' ? 250 : params.packageType === 'drip_box' ? 75 : 250
  const targetKg = computeQuantityKg(params.packageType, targetUnits, 0, packageSizeG)

  // 1. Check if active row(s) exist
  const { data: existingRows, error: fetchErr } = await supabase
    .from('roasted_stock')
    .select('*')
    .eq('roast_batch_id', params.roastBatchId)
    .eq('package_type', params.packageType)
    .eq('channel', params.channel)
    .eq('status', 'in_stock')

  if (fetchErr) throw new Error(fetchErr.message)

  if (existingRows && existingRows.length > 0) {
    const primary = existingRows[0]
    const deltaKg = Math.round((targetKg - Number(primary.quantity_kg)) * 1000) / 1000

    const { error: updateErr } = await supabase
      .from('roasted_stock')
      .update({
        unit_count: targetUnits,
        quantity_kg: targetKg,
        notes: params.notes !== undefined ? params.notes : primary.notes,
      })
      .eq('id', primary.id)

    if (updateErr) throw new Error(updateErr.message)

    // Automatically purge any duplicate rows if they existed
    if (existingRows.length > 1) {
      const extraIds = existingRows.slice(1).map(r => r.id)
      await supabase.from('roasted_stock').delete().in('id', extraIds)
    }

    // Log stock movement if there was a change
    if (deltaKg !== 0) {
      try {
        await supabase.from('stock_movements').insert([{
          category: 'roasted',
          action: 'adjusted',
          quantity_kg: deltaKg,
          ref_id: primary.id,
          to_channel: params.channel,
          note: params.notes || `Stock count set to ${targetUnits} units (${deltaKg > 0 ? '+' : ''}${deltaKg} kg)`
        }])
      } catch (smErr) {
        console.warn('Could not log stock movement:', smErr)
      }
    }
  } else {
    // If no row exists and targetUnits > 0, insert single row
    if (targetUnits > 0) {
      const { data: newRow, error: insertErr } = await supabase
        .from('roasted_stock')
        .insert([{
          roast_batch_id: params.roastBatchId,
          state: params.packageType === 'bulk' ? 'bulk' : 'packed',
          package_type: params.packageType,
          package_size_g: packageSizeG,
          unit_count: targetUnits,
          box_sachets_count: params.packageType === 'drip_box' ? 5 : null,
          quantity_kg: targetKg,
          channel: params.channel,
          status: 'in_stock',
          produced_date: new Date().toISOString().split('T')[0],
          notes: params.notes || 'Daily inventory count',
        }])
        .select()
        .single()

      if (insertErr) throw new Error(insertErr.message)

      if (newRow) {
        try {
          await supabase.from('stock_movements').insert([{
            category: 'roasted',
            action: 'adjusted',
            quantity_kg: targetKg,
            ref_id: newRow.id,
            to_channel: params.channel,
            note: params.notes || `Initial stock count: ${targetUnits} units (${targetKg} kg)`
          }])
        } catch (smErr) {
          console.warn('Could not log stock movement:', smErr)
        }
      }
    }
  }

  revalidatePath('/admin/roasted-inventory')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/movements')
}

export async function updateRoastedStock(id: string, input: Partial<RoastedStockInput>) {
  const supabase = await createClient()
  const payload: Record<string, any> = { ...input }
  if (input.package_type) {
    payload.state = input.package_type === 'bulk' ? 'bulk' : 'packed'
    if (input.package_type === 'bag_1kg') payload.package_size_g = 1000
    if (input.package_type === 'bag_250g') payload.package_size_g = 250
    if (input.package_type === 'drip_box') payload.package_size_g = 75
    payload.quantity_kg = computeQuantityKg(
      input.package_type,
      input.unit_count ?? null,
      input.quantity_kg ?? 0,
      input.package_size_g
    )
  }
  const { error } = await supabase
    .from('roasted_stock')
    .update(payload)
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/roasted-inventory')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/movements')
}

export async function deleteRoastedStock(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('roasted_stock').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/roasted-inventory')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/movements')
}

// -------------------------------------------------------------
// Quick Daily Adjustment Action (+ / - / direct count)
// -------------------------------------------------------------
export async function quickAdjustStock(params: {
  stockId: string
  newUnitCount?: number | null
  newQuantityKg?: number | null
  reason?: string
}) {
  const supabase = await createClient()
  const { data: stock, error: fetchErr } = await supabase
    .from('roasted_stock')
    .select('*')
    .eq('id', params.stockId)
    .single()
  if (fetchErr || !stock) throw new Error(fetchErr?.message || 'Stock item not found')

  const pkgType: PackageType = stock.package_type || (stock.state === 'bulk' ? 'bulk' : 'bag_250g')
  let updatedUnits = stock.unit_count
  let updatedKg = stock.quantity_kg

  if (pkgType === 'bulk') {
    updatedKg = params.newQuantityKg !== undefined && params.newQuantityKg !== null
      ? Math.max(0, Number(params.newQuantityKg))
      : stock.quantity_kg
  } else {
    updatedUnits = params.newUnitCount !== undefined && params.newUnitCount !== null
      ? Math.max(0, Number(params.newUnitCount))
      : stock.unit_count
    updatedKg = computeQuantityKg(pkgType, updatedUnits, 0, stock.package_size_g)
  }

  const { error: updateErr } = await supabase
    .from('roasted_stock')
    .update({
      unit_count: updatedUnits,
      quantity_kg: updatedKg,
    })
    .eq('id', params.stockId)
  if (updateErr) throw new Error(updateErr.message)

  // Log to stock_movements
  const deltaKg = Math.round((updatedKg - stock.quantity_kg) * 1000) / 1000
  if (deltaKg !== 0) {
    try {
      await supabase.from('stock_movements').insert([{
        category: 'roasted',
        action: 'adjusted',
        quantity_kg: deltaKg,
        ref_id: params.stockId,
        to_channel: stock.channel,
        note: params.reason || `Quick stock adjustment (${deltaKg > 0 ? '+' : ''}${deltaKg} kg / ${updatedUnits ?? 0} units)`
      }])
    } catch (smErr) {
      console.warn('Could not log stock movement:', smErr)
    }
  }

  revalidatePath('/admin/roasted-inventory')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/movements')
}

// -------------------------------------------------------------
// Pack from Bulk Action (Atomically deducts bulk & creates/updates packed stock)
// -------------------------------------------------------------
export async function packFromBulkAction(params: {
  roastBatchId: string
  bulkStockId?: string | null
  packageType: 'bag_1kg' | 'bag_250g' | 'drip_box' | 'custom'
  unitCount: number
  targetChannel: ChannelType
  boxSachetsCount?: number
  customSizeG?: number
  note?: string
}) {
  const supabase = await createClient()
  const { roastBatchId, bulkStockId, packageType, unitCount, targetChannel, boxSachetsCount, customSizeG, note } = params

  if (unitCount <= 0) throw new Error('Unit count must be greater than 0')

  const neededKg = computeQuantityKg(packageType, unitCount, 0, customSizeG)

  // 1. Locate bulk stock for this batch
  let bulkStock: any = null
  if (bulkStockId) {
    const { data } = await supabase.from('roasted_stock').select('*').eq('id', bulkStockId).single()
    bulkStock = data
  } else {
    const { data } = await supabase
      .from('roasted_stock')
      .select('*')
      .eq('roast_batch_id', roastBatchId)
      .eq('state', 'bulk')
      .eq('status', 'in_stock')
      .order('quantity_kg', { ascending: false })
      .limit(1)
    bulkStock = data?.[0] ?? null
  }

  if (!bulkStock || Number(bulkStock.quantity_kg) < neededKg) {
    throw new Error(
      `Insufficient bulk stock. Available: ${bulkStock?.quantity_kg ?? 0} kg, Needed: ${neededKg} kg`
    )
  }

  // 2. Deduct from bulk stock
  const newBulkKg = Math.max(0, Math.round((Number(bulkStock.quantity_kg) - neededKg) * 1000) / 1000)
  const { error: deductErr } = await supabase
    .from('roasted_stock')
    .update({ quantity_kg: newBulkKg })
    .eq('id', bulkStock.id)
  if (deductErr) throw new Error(deductErr.message)

  // 3. Find if matching packed row already exists in target channel
  const { data: existingPacked } = await supabase
    .from('roasted_stock')
    .select('*')
    .eq('roast_batch_id', roastBatchId)
    .eq('channel', targetChannel)
    .eq('package_type', packageType)
    .eq('status', 'in_stock')
    .limit(1)

  if (existingPacked && existingPacked.length > 0) {
    const existing = existingPacked[0]
    const updatedUnits = (existing.unit_count || 0) + unitCount
    const updatedKg = computeQuantityKg(packageType, updatedUnits, 0, customSizeG)
    const { error: incErr } = await supabase
      .from('roasted_stock')
      .update({
        unit_count: updatedUnits,
        quantity_kg: updatedKg,
      })
      .eq('id', existing.id)
    if (incErr) throw new Error(incErr.message)
  } else {
    const { error: createErr } = await supabase
      .from('roasted_stock')
      .insert([{
        roast_batch_id: roastBatchId,
        state: 'packed',
        package_type: packageType,
        package_size_g: packageType === 'bag_1kg' ? 1000 : packageType === 'bag_250g' ? 250 : packageType === 'drip_box' ? 75 : (customSizeG ?? 250),
        unit_count: unitCount,
        box_sachets_count: packageType === 'drip_box' ? (boxSachetsCount || 5) : null,
        quantity_kg: neededKg,
        channel: targetChannel,
        status: 'in_stock',
        produced_date: new Date().toISOString().split('T')[0],
        notes: note || `Packed ${unitCount} units from bulk`,
      }])
    if (createErr) throw new Error(createErr.message)
  }

  // 4. Record stock movement
  try {
    await supabase.from('stock_movements').insert([{
      category: 'roasted',
      action: 'packed',
      quantity_kg: neededKg,
      ref_id: bulkStock.id,
      from_channel: bulkStock.channel,
      to_channel: targetChannel,
      note: note || `Packed ${unitCount} ${packageType} (${neededKg} kg) to ${targetChannel}`,
    }])
  } catch (smErr) {
    console.warn('Could not log stock movement:', smErr)
  }

  revalidatePath('/admin/roasted-inventory')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/movements')
}

// -------------------------------------------------------------
// Transfer Stock Action (Move units or kg between channels)
// -------------------------------------------------------------
export async function transferStockAction(params: {
  stockId: string
  toChannel: ChannelType
  transferUnits?: number | null
  transferKg?: number | null
  note?: string
}) {
  const supabase = await createClient()
  const { stockId, toChannel, transferUnits, transferKg, note } = params

  const { data: source, error: fetchErr } = await supabase
    .from('roasted_stock')
    .select('*')
    .eq('id', stockId)
    .single()
  if (fetchErr || !source) throw new Error(fetchErr?.message || 'Stock not found')

  if (source.channel === toChannel) {
    throw new Error('Source and destination channels must be different')
  }

  const pkgType: PackageType = source.package_type || (source.state === 'bulk' ? 'bulk' : 'bag_250g')

  let moveUnits = 0
  let moveKg = 0

  if (pkgType === 'bulk') {
    moveKg = Number(transferKg) || 0
    if (moveKg <= 0 || moveKg > Number(source.quantity_kg)) {
      throw new Error('Invalid transfer quantity for bulk stock')
    }
  } else {
    moveUnits = Number(transferUnits) || 0
    if (moveUnits <= 0 || moveUnits > Number(source.unit_count)) {
      throw new Error('Invalid transfer unit count')
    }
    moveKg = computeQuantityKg(pkgType, moveUnits, 0, source.package_size_g)
  }

  // Deduct from source
  const remainingUnits = pkgType === 'bulk' ? null : Math.max(0, (source.unit_count || 0) - moveUnits)
  const remainingKg = Math.max(0, Math.round((Number(source.quantity_kg) - moveKg) * 1000) / 1000)

  if (remainingKg === 0 && (remainingUnits === null || remainingUnits === 0)) {
    // If entire lot is transferred, we can just reassign channel
    const { error } = await supabase.from('roasted_stock').update({ channel: toChannel }).eq('id', source.id)
    if (error) throw new Error(error.message)
  } else {
    // Deduct source
    await supabase.from('roasted_stock').update({
      unit_count: remainingUnits,
      quantity_kg: remainingKg,
    }).eq('id', source.id)

    // Check if destination matching row exists
    const { data: existingDest } = await supabase
      .from('roasted_stock')
      .select('*')
      .eq('roast_batch_id', source.roast_batch_id)
      .eq('channel', toChannel)
      .eq('package_type', pkgType)
      .eq('status', 'in_stock')
      .limit(1)

    if (existingDest && existingDest.length > 0) {
      const dest = existingDest[0]
      const newDestUnits = pkgType === 'bulk' ? null : (dest.unit_count || 0) + moveUnits
      const newDestKg = Math.round((Number(dest.quantity_kg) + moveKg) * 1000) / 1000
      await supabase.from('roasted_stock').update({
        unit_count: newDestUnits,
        quantity_kg: newDestKg,
      }).eq('id', dest.id)
    } else {
      await supabase.from('roasted_stock').insert([{
        roast_batch_id: source.roast_batch_id,
        state: source.state,
        package_type: pkgType,
        package_size_g: source.package_size_g,
        unit_count: moveUnits || null,
        box_sachets_count: source.box_sachets_count,
        quantity_kg: moveKg,
        channel: toChannel,
        status: 'in_stock',
        produced_date: source.produced_date,
        notes: note || `Transferred from ${source.channel}`,
      }])
    }
  }

  // Record transfer movement
  try {
    await supabase.from('stock_movements').insert([{
      category: 'roasted',
      action: 'transferred',
      quantity_kg: moveKg,
      ref_id: source.id,
      from_channel: source.channel,
      to_channel: toChannel,
      note: note || `Transferred ${moveUnits > 0 ? `${moveUnits} units` : `${moveKg} kg`} from ${source.channel} to ${toChannel}`,
    }])
  } catch (smErr) {
    console.warn('Could not log stock movement:', smErr)
  }

  revalidatePath('/admin/roasted-inventory')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/movements')
}

export async function importRoastedStock(rows: Record<string, string>[], batchId: string) {
  const supabase = await createClient()
  const validStates = ['bulk', 'packed']
  const validChannels: ChannelType[] = ['unallocated', 'bar', 'b2c', 'b2b']
  const validStatuses: StatusType[] = ['in_stock', 'shipped', 'sold', 'consumed']

  const inserts = rows
    .filter(row => row.quantity_kg || row.unit_count)
    .map(row => {
      const pType: PackageType = (row.package_type as PackageType) || (row.state === 'packed' ? 'bag_250g' : 'bulk')
      const units = row.unit_count ? parseInt(row.unit_count) : null
      const rawKg = parseFloat(row.quantity_kg) || 0
      return {
        roast_batch_id: row.roast_batch_id?.trim() || batchId,
        state: pType === 'bulk' ? 'bulk' : 'packed',
        package_type: pType,
        package_size_g: pType === 'bag_1kg' ? 1000 : pType === 'bag_250g' ? 250 : pType === 'drip_box' ? 75 : (row.package_size_g ? parseInt(row.package_size_g) : null),
        unit_count: units,
        quantity_kg: computeQuantityKg(pType, units, rawKg),
        channel: validChannels.includes(row.channel?.trim() as any) ? (row.channel.trim() as ChannelType) : 'unallocated',
        status: validStatuses.includes(row.status?.trim() as any) ? (row.status.trim() as StatusType) : 'in_stock',
        produced_date: row.produced_date?.trim() || new Date().toISOString().split('T')[0],
        notes: row.notes?.trim() || null,
      }
    })

  if (inserts.length === 0) throw new Error('No valid rows to import.')
  const { error } = await supabase.from('roasted_stock').insert(inserts)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/roasted-inventory')
  revalidatePath('/admin/dashboard')
  return inserts.length
}