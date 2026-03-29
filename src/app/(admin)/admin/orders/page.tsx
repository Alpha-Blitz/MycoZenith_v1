import { getOrders } from '@/lib/admin/orders'
import OrdersTable from './OrdersTable'

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
