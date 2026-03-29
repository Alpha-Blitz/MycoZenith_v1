import Link from 'next/link'
import { getAnalyticsOverview, getRevenueByDay } from '@/lib/admin/analytics'
import StatCard from '@/components/admin/StatCard'
import RevenueChart from '@/components/admin/RevenueChart'
import StatusBadge from '@/components/admin/StatusBadge'

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export default async function DashboardPage() {
  const [overview, revenueData] = await Promise.all([
    getAnalyticsOverview(),
    getRevenueByDay(30),
  ])

  return (
    <div className="flex flex-col gap-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue Today"
          value={fmt(overview.revenueToday)}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
        />
        <StatCard
          label="Revenue This Week"
          value={fmt(overview.revenueThisWeek)}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          }
        />
        <StatCard
          label="Orders This Month"
          value={overview.ordersThisMonth}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          }
        />
        <StatCard
          label="Active Products"
          value={overview.totalProducts}
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          }
        />
      </div>

      {/* Revenue chart + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-white/45 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Revenue — Last 30 Days</p>
          <RevenueChart data={revenueData} />
        </div>

        <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-white/45 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Low Stock Alerts</p>
          {overview.lowStockProducts.length === 0 ? (
            <p className="text-white/30 text-sm">All products well stocked.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {overview.lowStockProducts.map((p: { id: string; name: string; stock: number }) => (
                <div key={p.id} className="flex items-center justify-between">
                  <Link href={`/admin/products/${p.id}`} className="text-white/70 text-sm hover:text-white transition-colors duration-150 truncate max-w-[160px]">
                    {p.name}
                  </Link>
                  <span className="text-red-400 text-xs font-semibold shrink-0">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-[#111111] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-white/45 text-xs font-semibold tracking-[0.15em] uppercase">Recent Orders</p>
          <Link href="/admin/orders" className="text-[#8B5CF6] text-xs hover:text-[#a78bfa] transition-colors duration-150">View all →</Link>
        </div>
        {overview.recentOrders.length === 0 ? (
          <p className="text-white/30 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Order', 'Customer', 'Amount', 'Status', ''].map(h => (
                    <th key={h} className="text-left text-white/35 text-xs font-semibold pb-3 pr-4 last:pr-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {overview.recentOrders.map((o: { id: string; order_number: string; customer_name: string; total: number; status: string }) => (
                  <tr key={o.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="py-3 pr-4 text-white/70 font-mono text-xs">{o.order_number}</td>
                    <td className="py-3 pr-4 text-white/70">{o.customer_name}</td>
                    <td className="py-3 pr-4 text-white font-medium">{fmt(Number(o.total))}</td>
                    <td className="py-3 pr-4"><StatusBadge status={o.status} /></td>
                    <td className="py-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-[#8B5CF6]/70 hover:text-[#8B5CF6] text-xs transition-colors duration-150">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
