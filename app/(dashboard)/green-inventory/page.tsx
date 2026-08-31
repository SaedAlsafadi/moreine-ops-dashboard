import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GreenInventoryClient from './GreenInventoryClient'

const LOW_STOCK_GREEN_KG = parseFloat(process.env.NEXT_PUBLIC_LOW_STOCK_GREEN_KG ?? '60')

export default async function GreenInventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lots } = await supabase
    .from('green_inventory')
    .select('*')
    .order('arrival_date', { ascending: false })

  return <GreenInventoryClient lots={lots ?? []} lowStockThreshold={LOW_STOCK_GREEN_KG} />
}
