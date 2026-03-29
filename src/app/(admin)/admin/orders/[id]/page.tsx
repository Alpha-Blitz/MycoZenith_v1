import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrderById } from '@/lib/admin/orders'
import OrderDetail from './OrderDetail'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-white/40 hover:text-white/70 text-sm transition-colors duration-150">
          ← Orders
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60 text-sm font-mono">{order.order_number}</span>
      </div>
      <OrderDetail order={order} />
    </div>
  )
}
