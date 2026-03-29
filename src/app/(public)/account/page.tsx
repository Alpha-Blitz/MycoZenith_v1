import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountClient from './AccountClient'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <AccountClient
      user={{
        id:        user.id,
        email:     user.email ?? '',
        name:      user.user_metadata?.full_name ?? '',
        createdAt: user.created_at,
      }}
      orders={orders ?? []}
    />
  )
}
