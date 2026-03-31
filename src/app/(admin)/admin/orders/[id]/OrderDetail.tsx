'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/admin/StatusBadge'
import Image from 'next/image'

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

function fmtPayment(method?: string) {
  if (!method) return null
  if (method.toLowerCase() === 'cod') return 'CoD'
  return method.charAt(0).toUpperCase() + method.slice(1)
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const INPUT = "w-full bg-[#111] border border-white/[0.12] focus:border-[#8B5CF6]/60 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors duration-150 placeholder-white/25"
const SELECT = INPUT + " cursor-pointer admin-select"

function fmt(n: number) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

type OrderItem = {
  id: string
  product_name: string
  product_image: string
  product_slug: string
  unit_price: number
  quantity: number
  line_total: number
}

type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pincode: string
  country: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  payment_method?: string
  payment_id?: string
  status: string
  tracking_id?: string
  tracking_url?: string
  notes?: string
  created_at: string
  order_items: OrderItem[]
}

export default function OrderDetail({ order }: { order: Order }) {
  const router = useRouter()
  const [status, setStatus]   = useState(order.status)
  const [trackingId, setTracking] = useState(order.tracking_id ?? '')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, tracking_id: trackingId }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Save failed') }
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between bg-[#0F0F0F] border border-white/[0.07] rounded-2xl px-6 py-4">
        <div>
          <p className="text-white font-semibold font-mono">{order.order_number}</p>
          <p className="text-white/40 text-xs mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-4 pb-3 border-b border-white/[0.07]">Items</h3>
        <div className="flex flex-col gap-3">
          {order.order_items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
                {item.product_image && <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.product_name}</p>
                <p className="text-white/40 text-xs">{fmt(item.unit_price)} × {item.quantity}</p>
              </div>
              <p className="text-white font-medium text-sm shrink-0">{fmt(item.line_total)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-white/50"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount</span><span>−{fmt(order.discount)}</span></div>}
          <div className="flex justify-between text-white/50"><span>Shipping</span><span>{order.shipping > 0 ? fmt(order.shipping) : 'Free'}</span></div>
          <div className="flex justify-between text-white font-semibold pt-1 border-t border-white/[0.06]"><span>Total</span><span>{fmt(order.total)}</span></div>
        </div>
      </div>

      {/* Customer */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-4 pb-3 border-b border-white/[0.07]">Customer</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><p className="text-white/40 text-xs mb-0.5">Name</p><p className="text-white/80">{order.customer_name}</p></div>
          <div><p className="text-white/40 text-xs mb-0.5">Email</p><p className="text-white/80">{order.customer_email}</p></div>
          {order.customer_phone && <div><p className="text-white/40 text-xs mb-0.5">Phone</p><p className="text-white/80">{order.customer_phone}</p></div>}
          {order.payment_method && <div><p className="text-white/40 text-xs mb-0.5">Payment</p><p className="text-white/80">{fmtPayment(order.payment_method)}</p></div>}
        </div>
        <div className="mt-3 pt-3 border-t border-white/[0.06] text-sm">
          <p className="text-white/40 text-xs mb-1">Shipping Address</p>
          <p className="text-white/80">{order.address_line1}{order.address_line2 ? `, ${order.address_line2}` : ''}</p>
          <p className="text-white/80">{order.city}, {order.state} {order.pincode}</p>
          <p className="text-white/60">{order.country}</p>
        </div>
        {order.notes && (
          <div className="mt-3 pt-3 border-t border-white/[0.06]">
            <p className="text-white/40 text-xs mb-1">Notes</p>
            <p className="text-white/70 text-sm">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Status update */}
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-4 pb-3 border-b border-white/[0.07]">Update Status</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs font-semibold tracking-[0.12em] uppercase">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className={SELECT} style={{ colorScheme: 'dark' }}>
              {ORDER_STATUSES.map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{capitalize(s)}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs font-semibold tracking-[0.12em] uppercase">Tracking ID</label>
            <input type="text" value={trackingId} onChange={e => setTracking(e.target.value)}
              placeholder="AWB / Tracking Number" className={INPUT} />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving}
              className="bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
