'use client'

import Link from 'next/link'
import { useState } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'

const STATUS_TABS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const

type OrderRow = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total: number
  status: string
  created_at: string
}

function fmt(n: number) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export default function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [tab, setTab] = useState<string>('all')
  const [query, setQuery] = useState('')

  const filtered = orders
    .filter(o => tab === 'all' || o.status === tab)
    .filter(o => {
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q)
      )
    })

  return (
    <div>
      {/* Search + Status tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search orders, customers…"
            className="w-full bg-[#0F0F0F] border border-white/[0.08] focus:border-[#8B5CF6]/50 text-white text-sm pl-9 pr-3 py-2 rounded-xl outline-none transition-colors duration-150 placeholder-white/20"
          />
        </div>
        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setTab(s)}
            className={['px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer capitalize shrink-0',
              tab === s
                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#8B5CF6]'
                : 'bg-transparent border-white/[0.08] text-white/40 hover:text-white/70',
            ].join(' ')}>{s}</button>
        ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-16 flex items-center justify-center">
          <p className="text-white/30 text-sm">No orders{tab !== 'all' ? ` with status "${tab}"` : ''} yet.</p>
        </div>
      ) : (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left text-white/35 text-xs font-semibold px-5 py-3.5">Order</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5 hidden sm:table-cell">Customer</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5">Amount</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5">Status</th>
                <th className="text-left text-white/35 text-xs font-semibold px-4 py-3.5 hidden md:table-cell">Date</th>
                <th className="text-right text-white/35 text-xs font-semibold px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150">
                  <td className="px-5 py-4 font-mono text-xs text-white/70">{o.order_number}</td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="text-white/80 text-sm">{o.customer_name}</p>
                    <p className="text-white/35 text-xs">{o.customer_email}</p>
                  </td>
                  <td className="px-4 py-4 text-white font-medium">{fmt(o.total)}</td>
                  <td className="px-4 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-4 hidden md:table-cell text-white/40 text-xs">
                    {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/orders/${o.id}`}
                      className="text-[#8B5CF6]/70 hover:text-[#8B5CF6] text-xs transition-colors duration-150">
                      View
                    </Link>
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
