import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountClient from './AccountClient'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const [
    { data: orders },
    { data: addresses },
    { data: savedPosts },
    { data: favorites },
  ] = await Promise.all([
    supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('user_addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }),
    supabase.from('saved_posts').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
    supabase.from('favorite_products').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
  ])

  return (
    <AccountClient
      user={{
        id:         user.id,
        email:      user.email ?? '',
        name:       user.user_metadata?.full_name ?? '',
        avatarUrl:  user.user_metadata?.avatar_url ?? '',
        createdAt:  user.created_at,
      }}
      orders={orders ?? []}
      addresses={addresses ?? []}
      savedPosts={savedPosts ?? []}
      favorites={favorites ?? []}
    />
  )
}
