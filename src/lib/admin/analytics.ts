import { createClient } from '@/lib/supabase/server'

export async function getAnalyticsOverview() {
  const supabase = await createClient()

  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const week  = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString()
  const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [ordersRes, productsRes, lowStockRes] = await Promise.all([
    supabase.from('orders').select('total, status, created_at, customer_name, customer_email, order_number, id').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name, slug, stock, status'),
    supabase.from('products').select('id, name, slug, stock').lt('stock', 10).eq('status', 'active'),
  ])

  const orders   = ordersRes.data   ?? []
  const products = productsRes.data ?? []
  const lowStock = lowStockRes.data ?? []

  const revenueToday = orders
    .filter(o => o.created_at >= today && o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0)

  const revenueThisWeek = orders
    .filter(o => o.created_at >= week && o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0)

  const revenueThisMonth = orders
    .filter(o => o.created_at >= month && o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0)

  const ordersThisMonth = orders.filter(o => o.created_at >= month).length

  return {
    revenueToday,
    revenueThisWeek,
    revenueThisMonth,
    ordersThisMonth,
    totalProducts: products.length,
    lowStockProducts: lowStock,
    recentOrders: orders.slice(0, 5),
  }
}

export async function getRevenueByDay(days = 30) {
  const supabase  = await createClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data } = await supabase
    .from('orders')
    .select('total, created_at')
    .gte('created_at', since)
    .neq('status', 'cancelled')

  const map: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    map[d.toISOString().slice(0, 10)] = 0
  }
  for (const o of data ?? []) {
    const day = o.created_at.slice(0, 10)
    if (map[day] !== undefined) map[day] += Number(o.total)
  }
  return Object.entries(map).map(([date, revenue]) => ({ date, revenue }))
}

export async function getOrdersByDay(days = 14) {
  const supabase = await createClient()
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data } = await supabase
    .from('orders').select('created_at').gte('created_at', since)

  const map: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    map[d.toISOString().slice(0, 10)] = 0
  }
  for (const o of data ?? []) {
    const day = o.created_at.slice(0, 10)
    if (map[day] !== undefined) map[day]++
  }
  return Object.entries(map).map(([date, count]) => ({ date, count }))
}
