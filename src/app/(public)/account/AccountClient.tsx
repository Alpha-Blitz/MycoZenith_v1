'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

/* ─── Types ───────────────────────────────────────────────────────── */
interface OrderItem {
  id: string
  product_name: string
  product_slug: string
  product_image: string
  unit_price: number
  quantity: number
  line_total: number
}

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  currency: string
  tracking_id: string | null
  tracking_url: string | null
  created_at: string
  order_items: OrderItem[]
}

interface Props {
  user: {
    id: string
    email: string
    name: string
    createdAt: string
  }
  orders: Order[]
}

/* ─── Icons ───────────────────────────────────────────────────────── */
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function PackageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

function ArrowRight({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

/* ─── Status badge ────────────────────────────────────────────────── */
const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  shipped:    'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
  delivered:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
  refunded:   'bg-red-500/10 text-red-400 border-red-500/20',
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status.toLowerCase()] ?? 'bg-white/[0.05] text-white/50 border-white/[0.1]'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${style}`}>
      {status}
    </span>
  )
}

/* ─── Helpers ─────────────────────────────────────────────────────── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

/* ─── Order Row ───────────────────────────────────────────────────── */
function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-white/[0.02] transition-colors duration-150"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0">
            <p className="text-white text-sm font-semibold">#{order.order_number}</p>
            <p className="text-white/40 text-xs mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <div className="hidden sm:block">
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="sm:hidden">
            <StatusBadge status={order.status} />
          </div>
          <span className="text-white font-semibold tabular-nums">
            {formatCurrency(order.total, order.currency)}
          </span>
          <span className={['text-white/40 transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}>
            <ChevronDown />
          </span>
        </div>
      </button>

      {/* Expanded items */}
      {open && (
        <div className="border-t border-white/[0.07] px-5 pb-5 pt-4 flex flex-col gap-3">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 text-white/30">
                  <PackageIcon />
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{item.product_name}</p>
                  <p className="text-white/35 text-xs mt-0.5">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="text-white/70 text-sm font-medium tabular-nums shrink-0">
                {formatCurrency(item.line_total, order.currency)}
              </span>
            </div>
          ))}

          {/* Tracking */}
          {order.tracking_id && (
            <div className="mt-1 pt-3 border-t border-white/[0.07] flex items-center justify-between gap-2">
              <div>
                <p className="text-white/40 text-xs">Tracking ID</p>
                <p className="text-white/70 text-sm font-mono mt-0.5">{order.tracking_id}</p>
              </div>
              {order.tracking_url && (
                <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#8B5CF6] text-xs font-semibold hover:text-[#a78bfa] transition-colors duration-150">
                  Track <ArrowRight size={11} />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Tabs ────────────────────────────────────────────────────────── */
type Tab = 'profile' | 'orders' | 'settings'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',  label: 'Profile',  icon: <UserIcon />    },
  { id: 'orders',   label: 'Orders',   icon: <PackageIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
]

/* ─── Main Component ──────────────────────────────────────────────── */
export default function AccountClient({ user, orders }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const router = useRouter()

  /* Profile state */
  const [name,       setName]       = useState(user.name)
  const [editingName, setEditingName] = useState(false)
  const [nameInput,  setNameInput]  = useState(user.name)
  const [nameSaving, setNameSaving] = useState(false)
  const [nameMsg,    setNameMsg]    = useState<{ ok: boolean; text: string } | null>(null)

  /* Password state */
  const [resetSending, setResetSending] = useState(false)
  const [resetMsg,     setResetMsg]     = useState<{ ok: boolean; text: string } | null>(null)

  const initial = (name || user.email).charAt(0).toUpperCase()

  async function saveName() {
    setNameSaving(true)
    setNameMsg(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ data: { full_name: nameInput.trim() } })
    if (error) {
      setNameMsg({ ok: false, text: 'Failed to update name.' })
    } else {
      setName(nameInput.trim())
      setEditingName(false)
      setNameMsg({ ok: true, text: 'Name updated.' })
    }
    setNameSaving(false)
    setTimeout(() => setNameMsg(null), 3000)
  }

  async function sendResetLink() {
    setResetSending(true)
    setResetMsg(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    if (error) {
      setResetMsg({ ok: false, text: 'Could not send reset email.' })
    } else {
      setResetMsg({ ok: true, text: 'Reset link sent — check your inbox.' })
    }
    setResetSending(false)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] pt-24 sm:pt-28 pb-20 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* ── Page header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[#8B5CF6] text-[11px] font-semibold tracking-[0.22em] uppercase">Account</span>
            <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight mt-1">My Account</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 px-4 py-2 rounded-xl transition-all duration-150 cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-1 mb-6 w-fit">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={[
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer',
                activeTab === id
                  ? 'bg-[#8B5CF6]/15 text-white border border-[#8B5CF6]/25'
                  : 'text-white/45 hover:text-white/70',
              ].join(' ')}
            >
              <span className={activeTab === id ? 'text-[#8B5CF6]' : ''}>{icon}</span>
              {label}
              {id === 'orders' && orders.length > 0 && (
                <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ─────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-4">

            {/* Avatar + identity */}
            <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6]/30 to-[#7c3aed]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] text-2xl font-bold shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-white text-lg font-semibold truncate">{name || 'No name set'}</p>
                <p className="text-white/45 text-sm truncate mt-0.5">{user.email}</p>
                <p className="text-white/30 text-xs mt-1">Member since {formatDate(user.createdAt)}</p>
              </div>
            </div>

            {/* Display name */}
            <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-sm font-semibold">Display Name</h3>
                {!editingName && (
                  <button
                    onClick={() => { setEditingName(true); setNameInput(name) }}
                    className="text-xs text-[#8B5CF6] hover:text-[#a78bfa] transition-colors duration-150 cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingName ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    autoFocus
                    className="w-full bg-white/[0.05] border border-white/[0.1] focus:border-[#8B5CF6]/60 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors duration-150"
                    placeholder="Your name"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={saveName}
                      disabled={nameSaving || !nameInput.trim()}
                      className="text-sm font-semibold bg-[#8B5CF6] hover:bg-[#7c3aed] text-white px-5 py-2 rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-50"
                    >
                      {nameSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="text-sm text-white/50 hover:text-white/80 transition-colors duration-150 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-white/65 text-sm">{name || <span className="text-white/30 italic">Not set</span>}</p>
              )}
              {nameMsg && (
                <p className={`text-xs mt-2 ${nameMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{nameMsg.text}</p>
              )}
            </div>

            {/* Email */}
            <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-white text-sm font-semibold mb-4">Email Address</h3>
              <p className="text-white/65 text-sm">{user.email}</p>
              <p className="text-white/30 text-xs mt-1">Email cannot be changed here.</p>
            </div>

            {/* Password */}
            <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-white text-sm font-semibold mb-1">Password</h3>
              <p className="text-white/40 text-xs mb-4">We&apos;ll send a reset link to your email.</p>
              <button
                onClick={sendResetLink}
                disabled={resetSending}
                className="inline-flex items-center gap-2 text-sm font-medium border border-white/[0.12] text-white/65 hover:text-white hover:border-white/25 px-5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                {resetSending ? 'Sending…' : 'Send reset link'}
              </button>
              {resetMsg && (
                <p className={`text-xs mt-3 ${resetMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{resetMsg.text}</p>
              )}
            </div>

          </div>
        )}

        {/* ── Orders Tab ──────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-3">
            {orders.length === 0 ? (
              <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-12 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]/60">
                  <PackageIcon />
                </div>
                <div>
                  <p className="text-white text-base font-semibold">No orders yet</p>
                  <p className="text-white/40 text-sm mt-1">Your order history will appear here.</p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150"
                >
                  Shop Now <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              orders.map(order => <OrderRow key={order.id} order={order} />)
            )}
          </div>
        )}

        {/* ── Settings Tab ────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-10 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]/50">
              <SettingsIcon />
            </div>
            <p className="text-white text-base font-semibold">Coming soon</p>
            <p className="text-white/40 text-sm">Notification preferences and more will be here shortly.</p>
          </div>
        )}

      </div>
    </div>
  )
}
