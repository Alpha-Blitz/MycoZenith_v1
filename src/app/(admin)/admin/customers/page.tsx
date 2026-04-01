import { createServiceClient } from '@/lib/supabase/service'
import CustomersTable from './CustomersTable'

export default async function AdminCustomersPage() {
  const supabase = createServiceClient()

  const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 200 })
  if (error) throw error

  const { data: orderCounts } = await supabase
    .from('orders')
    .select('user_id')
    .not('user_id', 'is', null)

  const countMap: Record<string, number> = {}
  for (const row of orderCounts ?? []) {
    if (row.user_id) countMap[row.user_id] = (countMap[row.user_id] ?? 0) + 1
  }

  const customers = users.map(u => ({
    id: u.id,
    email: u.email,
    name: (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || '—',
    created_at: u.created_at ?? '',
    orderCount: countMap[u.id] ?? 0,
  }))

  return (
    <div>
      <CustomersTable customers={customers} />
    </div>
  )
}
