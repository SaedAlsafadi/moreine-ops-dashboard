import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SalesClient from './SalesClient'

export default async function SalesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sales } = await supabase
    .from('sales_log')
    .select('*')
    .order('date', { ascending: false })

  return <SalesClient sales={sales ?? []} />
}
