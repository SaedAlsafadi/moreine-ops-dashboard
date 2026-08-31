import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MovementsClient from './MovementsClient'

export default async function MovementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: movements } = await supabase
    .from('stock_movements')
    .select('*')
    .order('date', { ascending: false })
    .limit(500)

  return <MovementsClient movements={movements ?? []} />
}
