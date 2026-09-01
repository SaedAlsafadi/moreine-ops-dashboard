import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MovementsClient from './MovementsClient'

export default async function MovementsPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) redirect('/auth/sign-in')

  const { data: movements } = await supabase
    .from('stock_movements')
    .select('*')
    .order('date', { ascending: false })
    .limit(500)

  return <MovementsClient movements={movements ?? []} />
}
