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

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab)

  return (
    <div>
      {/* Status tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setTab(s)}
            className={['px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer capitalize shrink-0',
              tab === s
                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#8B5CF6]'
                : 'bg-transparent border-white/[0.08] text-white/40 hover:text-white/70',
            ].join(' ')}>{s}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-16 flex items-center justify-center">
          <p className="text-white/30 text-sm">No orders{tab !== 'all' ? ` with status "${tab}"` : ''} yet.</p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-white/[0.07] rounded-2xl overflow-hidden">
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
