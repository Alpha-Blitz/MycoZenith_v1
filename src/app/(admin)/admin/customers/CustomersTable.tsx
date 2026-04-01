'use client'

import { useState } from 'react'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

type Customer = {
  id: string
  email: string | undefined
  name: string
  created_at: string
  orderCount: number
}

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState('')

  const filtered = customers.filter(c => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      {/* Search */}
      <div className="flex items-center justify-between mb-5 gap-4">
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full bg-[#0F0F0F] border border-white/[0.08] focus:border-[#8B5CF6]/50 text-white text-sm pl-9 pr-3 py-2 rounded-xl outline-none transition-colors duration-150 placeholder-white/20"
          />
        </div>
        <p className="text-white/40 text-sm shrink-0">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-16 flex items-center justify-center">
          <p className="text-white/30 text-sm">{query ? `No users matching "${query}"` : 'No users yet.'}</p>
        </div>
      ) : (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl overflow-hidden">
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
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150">
                  <td className="px-5 py-4">
                    <p className="text-white/80 font-medium">{c.name}</p>
                    <p className="text-white/35 text-xs font-mono mt-0.5">{c.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell text-white/60">{c.email}</td>
                  <td className="px-4 py-4 hidden md:table-cell text-white/40 text-xs">{c.created_at ? fmt(c.created_at) : '—'}</td>
                  <td className="px-4 py-4">
                    <span className={c.orderCount ? 'text-white font-medium' : 'text-white/30'}>
                      {c.orderCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
