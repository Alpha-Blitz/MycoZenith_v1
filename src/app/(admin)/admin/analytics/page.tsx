import { getAnalyticsOverview, getRevenueByDay, getOrdersByDay } from '@/lib/admin/analytics'
import RevenueChart from '@/components/admin/RevenueChart'
import OrdersBarChart from '@/components/admin/OrdersBarChart'
import StatCard from '@/components/admin/StatCard'

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export default async function AnalyticsPage() {
  const [overview, revenueData, ordersData] = await Promise.all([
    getAnalyticsOverview(),
    getRevenueByDay(30),
    getOrdersByDay(14),
  ])

  // Top products by revenue — not available from analytics yet; show placeholder
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders  = ordersData.reduce((s, d) => s + d.count, 0)

  return (
    <div className="flex flex-col gap-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue Today"     value={fmt(overview.revenueToday)}    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
        <StatCard label="Revenue This Week" value={fmt(overview.revenueThisWeek)} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <StatCard label="Revenue (30 days)" value={fmt(totalRevenue)}             icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>} />
        <StatCard label="Orders (14 days)"  value={totalOrders}                   icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>} />
      </div>

      {/* Revenue chart */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
        <p className="text-white/45 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Revenue — Last 30 Days</p>
        <RevenueChart data={revenueData} />
      </div>

      {/* Orders bar chart */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
        <p className="text-white/45 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Orders — Last 14 Days</p>
        <OrdersBarChart data={ordersData} />
      </div>

      {/* Low stock */}
      {overview.lowStockProducts.length > 0 && (
        <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-white/45 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Low Stock</p>
          <div className="flex flex-col gap-3">
            {overview.lowStockProducts.map((p: { id: string; name: string; stock: number }) => (
              <div key={p.id} className="flex items-center justify-between">
                <span className="text-white/70 text-sm">{p.name}</span>
                <span className="text-red-400 text-xs font-semibold">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
