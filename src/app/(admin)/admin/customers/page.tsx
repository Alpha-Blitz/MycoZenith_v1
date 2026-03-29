import { createServiceClient } from '@/lib/supabase/service'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminCustomersPage() {
  const supabase = createServiceClient()

  // List auth users
  const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 200 })
  if (error) throw error

  // Get order counts per user
  const { data: orderCounts } = await supabase
    .from('orders')
    .select('user_id')
    .not('user_id', 'is', null)

  const countMap: Record<string, number> = {}
  for (const row of orderCounts ?? []) {
    if (row.user_id) countMap[row.user_id] = (countMap[row.user_id] ?? 0) + 1
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-white/40 text-sm">{users.length} user{users.length !== 1 ? 's' : ''}</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-16 flex items-center justify-center">
          <p className="text-white/30 text-sm">No users yet.</p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left text-white/35 text-xs font-semibold px-5 py-3.5">User</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5 hidden sm:table-cell">Email</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5 hidden md:table-cell">Joined</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5">Orders</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const name = (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || '—'
                return (
                  <tr key={u.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150">
                    <td className="px-5 py-4">
                      <p className="text-white/80 font-medium">{name}</p>
                      <p className="text-white/35 text-xs font-mono mt-0.5">{u.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell text-white/60">{u.email}</td>
                    <td className="px-4 py-4 hidden md:table-cell text-white/40 text-xs">{u.created_at ? fmt(u.created_at) : '—'}</td>
                    <td className="px-4 py-4">
                      <span className={countMap[u.id] ? 'text-white font-medium' : 'text-white/30'}>
                        {countMap[u.id] ?? 0}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
