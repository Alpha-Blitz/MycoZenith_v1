'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PRODUCTS } from '@/lib/products'
import { POSTS } from '@/lib/blog'

/* ─── Types ───────────────────────────────────────────────────────── */
interface OrderItem { id: string; product_name: string; product_slug: string; unit_price: number; quantity: number; line_total: number }
interface Order { id: string; order_number: string; status: string; total: number; currency: string; tracking_id: string | null; tracking_url: string | null; created_at: string; order_items: OrderItem[] }
interface Address { id: string; label: string; full_name: string; phone?: string; line1: string; line2?: string; city: string; state: string; pincode: string; country: string; is_default: boolean }
interface SavedPost { post_slug: string; saved_at: string }
interface FavoriteProduct { product_slug: string; saved_at: string }

interface Props {
  user: { id: string; email: string; name: string; avatarUrl: string; createdAt: string }
  orders: Order[]
  addresses: Address[]
  savedPosts: SavedPost[]
  favorites: FavoriteProduct[]
}

/* ─── Icons ───────────────────────────────────────────────────────── */
const icons = {
  user:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  package:  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  mapPin:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  bookmark: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  settings: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  chevron:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  arrow:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  camera:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  trash:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  edit:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  plus:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  signout:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  lock:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
}

/* ─── Helpers ─────────────────────────────────────────────────────── */
const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  shipped: 'bg-[#FF6523]/10 text-[#FF6523] border-[#FF6523]/20',
  delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  refunded: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status.toLowerCase()] ?? 'bg-white/[0.05] text-white/50 border-white/[0.1]'
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${style}`}>{status}</span>
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(n: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
}

const INPUT = "w-full bg-white/[0.05] border border-white/[0.1] focus:border-[#8B5CF6]/60 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-colors duration-150 placeholder-white/25"
const CARD  = "bg-[#0F0F0F] border border-white/[0.08] rounded-2xl"

/* ─── Tab config ──────────────────────────────────────────────────── */
type Tab = 'profile' | 'orders' | 'addresses' | 'saved' | 'settings'
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',   label: 'Profile',   icon: icons.user     },
  { id: 'orders',    label: 'Orders',    icon: icons.package  },
  { id: 'addresses', label: 'Addresses', icon: icons.mapPin   },
  { id: 'saved',     label: 'Saved',     icon: icons.bookmark },
  { id: 'settings',  label: 'Settings',  icon: icons.settings },
]

/* ─── Order row ───────────────────────────────────────────────────── */
function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={CARD + ' overflow-hidden'}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-white/[0.02] transition-colors duration-150">
        <div className="flex items-center gap-4 min-w-0">
          <div className="shrink-0">
            <p className="text-white text-sm font-semibold">#{order.order_number}</p>
            <p className="text-white/40 text-xs mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <div className="hidden sm:block"><StatusBadge status={order.status} /></div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="sm:hidden"><StatusBadge status={order.status} /></div>
          <span className="text-white font-semibold tabular-nums">{formatCurrency(order.total, order.currency)}</span>
          <span className={['text-white/40 transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}>{icons.chevron}</span>
        </div>
      </button>
      {open && (
        <div className="border-t border-white/[0.07] px-5 pb-5 pt-4 flex flex-col gap-3">
          {order.order_items.map(item => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white/80 text-sm font-medium truncate">{item.product_name}</p>
                <p className="text-white/35 text-xs mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="text-white/70 text-sm tabular-nums shrink-0">{formatCurrency(item.line_total, order.currency)}</span>
            </div>
          ))}
          {order.tracking_id && (
            <div className="mt-1 pt-3 border-t border-white/[0.07] flex items-center justify-between gap-2">
              <div>
                <p className="text-white/40 text-xs">Tracking ID</p>
                <p className="text-white/70 text-sm font-mono mt-0.5">{order.tracking_id}</p>
              </div>
              {order.tracking_url && (
                <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#8B5CF6] text-xs font-semibold hover:text-[#a78bfa] transition-colors duration-150">
                  Track {icons.arrow}
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Address form ────────────────────────────────────────────────── */
const EMPTY_ADDR = { label: 'Home', full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India', is_default: false }

function AddressForm({ initial, onSave, onCancel }: {
  initial?: Partial<Address>
  onSave: (data: typeof EMPTY_ADDR) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState({ ...EMPTY_ADDR, ...initial })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs">Label</label>
          <select value={form.label} onChange={e => set('label', e.target.value)}
            className={INPUT + ' admin-select'}>
            {['Home', 'Work', 'Other'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs">Full Name *</label>
          <input className={INPUT} value={form.full_name} onChange={e => set('full_name', e.target.value)} required placeholder="Jane Smith" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs">Phone</label>
        <input className={INPUT} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs">Address Line 1 *</label>
        <input className={INPUT} value={form.line1} onChange={e => set('line1', e.target.value)} required placeholder="House / Flat / Building" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs">Address Line 2</label>
        <input className={INPUT} value={form.line2 ?? ''} onChange={e => set('line2', e.target.value)} placeholder="Street / Area / Landmark" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs">City *</label>
          <input className={INPUT} value={form.city} onChange={e => set('city', e.target.value)} required placeholder="Mumbai" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs">State *</label>
          <input className={INPUT} value={form.state} onChange={e => set('state', e.target.value)} required placeholder="Maharashtra" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs">Pincode *</label>
          <input className={INPUT} value={form.pincode} onChange={e => set('pincode', e.target.value)} required placeholder="400001" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-white/60 text-xs cursor-pointer mt-1">
        <input type="checkbox" checked={form.is_default} onChange={e => set('is_default', e.target.checked)} className="accent-[#8B5CF6]" />
        Set as default address
      </label>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={saving}
          className="text-sm font-semibold bg-[#8B5CF6] hover:bg-[#7c3aed] text-white px-5 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Address'}
        </button>
        <button type="button" onClick={onCancel}
          className="text-sm text-white/50 hover:text-white/80 transition-colors duration-150 cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ─── Main ────────────────────────────────────────────────────────── */
export default function AccountClient({ user, orders, addresses: initAddresses, savedPosts: initSaved, favorites: initFavs }: Props) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get('tab') as Tab) ?? 'profile')
  const router = useRouter()

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab | null
    if (tab && ['profile','orders','addresses','saved','settings'].includes(tab)) setActiveTab(tab)
  }, [searchParams])

  /* ── Profile ── */
  const [name,        setName]        = useState(user.name)
  const [avatarUrl,   setAvatarUrl]   = useState(user.avatarUrl)
  const [editingName, setEditingName] = useState(false)
  const [nameInput,   setNameInput]   = useState(user.name)
  const [nameSaving,  setNameSaving]  = useState(false)
  const [nameMsg,     setNameMsg]     = useState<{ ok: boolean; text: string } | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [resetSending, setResetSending] = useState(false)
  const [resetMsg,     setResetMsg]   = useState<{ ok: boolean; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── Addresses ── */
  const [addresses,   setAddresses]   = useState<Address[]>(initAddresses)
  const [addingAddr,  setAddingAddr]  = useState(false)
  const [editAddrId,  setEditAddrId]  = useState<string | null>(null)

  /* ── Saved ── */
  const [savedPosts,  setSavedPosts]  = useState<SavedPost[]>(initSaved)
  const [favorites,   setFavorites]   = useState<FavoriteProduct[]>(initFavs)
  const [savedSubTab, setSavedSubTab] = useState<'posts' | 'products'>('posts')

  const initial = (name || user.email).charAt(0).toUpperCase()

  /* ── Avatar upload ── */
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    const supabase = createClient()
    const ext  = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { setAvatarUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
    // Append timestamp so the same-path URL forces browser + Next Image to refetch
    setAvatarUrl(`${publicUrl}?t=${Date.now()}`)
    setAvatarUploading(false)
  }

  /* ── Save name ── */
  async function saveName() {
    setNameSaving(true)
    setNameMsg(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ data: { full_name: nameInput.trim() } })
    if (error) setNameMsg({ ok: false, text: 'Failed to update name.' })
    else { setName(nameInput.trim()); setEditingName(false); setNameMsg({ ok: true, text: 'Name updated.' }) }
    setNameSaving(false)
    setTimeout(() => setNameMsg(null), 3000)
  }

  /* ── Reset password ── */
  async function sendResetLink() {
    setResetSending(true)
    setResetMsg(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    setResetMsg(error ? { ok: false, text: 'Could not send reset email.' } : { ok: true, text: 'Reset link sent — check your inbox.' })
    setResetSending(false)
  }

  /* ── Sign out ── */
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  /* ── Address CRUD ── */
  async function saveAddress(data: typeof EMPTY_ADDR, id?: string) {
    const supabase = createClient()
    if (id) {
      const { data: updated } = await supabase.from('user_addresses').update({ ...data }).eq('id', id).select().single()
      if (updated) setAddresses(prev => prev.map(a => a.id === id ? updated as Address : a))
      setEditAddrId(null)
    } else {
      const { data: created } = await supabase.from('user_addresses').insert({ ...data, user_id: user.id }).select().single()
      if (created) setAddresses(prev => [...prev, created as Address])
      setAddingAddr(false)
    }
  }

  async function deleteAddress(id: string) {
    const supabase = createClient()
    await supabase.from('user_addresses').delete().eq('id', id)
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  /* ── Remove saved items ── */
  async function removeSavedPost(slug: string) {
    const supabase = createClient()
    await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_slug', slug)
    setSavedPosts(prev => prev.filter(p => p.post_slug !== slug))
  }

  async function removeFavorite(slug: string) {
    const supabase = createClient()
    await supabase.from('favorite_products').delete().eq('user_id', user.id).eq('product_slug', slug)
    setFavorites(prev => prev.filter(f => f.product_slug !== slug))
  }

  const savedCount = savedPosts.length + favorites.length

  return (
    <div className="min-h-screen bg-[#1E1E1E] pt-24 sm:pt-28 pb-20 sm:pb-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[#8B5CF6] text-[11px] font-semibold tracking-[0.22em] uppercase">Account</span>
            <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight mt-1">My Account</h1>
          </div>
          <button onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 px-4 py-2 rounded-xl transition-all duration-150 cursor-pointer">
            {icons.signout} Sign out
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-[#0F0F0F] border border-white/[0.07] rounded-2xl p-1 mb-6 overflow-x-auto">
          {TABS.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={[
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0',
                activeTab === id ? 'bg-[#8B5CF6]/15 text-white border border-[#8B5CF6]/25' : 'text-white/45 hover:text-white/70',
              ].join(' ')}>
              <span className={activeTab === id ? 'text-[#8B5CF6]' : ''}>{icon}</span>
              {label}
              {id === 'orders' && orders.length > 0 && (
                <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-semibold px-1.5 py-0.5 rounded-full">{orders.length}</span>
              )}
              {id === 'saved' && savedCount > 0 && (
                <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-semibold px-1.5 py-0.5 rounded-full">{savedCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ──────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-4">

            {/* Avatar + identity */}
            <div className={CARD + ' p-6 flex items-center gap-5'}>
              <div className="relative w-16 h-16 shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6]/30 to-[#7c3aed]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] text-2xl font-bold overflow-hidden">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover rounded-full" sizes="64px" />
                  ) : initial}
                </div>
                <button onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#8B5CF6] hover:bg-[#7c3aed] border-2 border-[#1E1E1E] flex items-center justify-center text-white transition-colors duration-150 cursor-pointer disabled:opacity-60">
                  {avatarUploading
                    ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    : icons.camera}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-lg font-semibold truncate">{name || 'No name set'}</p>
                <p className="text-white/45 text-sm truncate mt-0.5">{user.email}</p>
                <p className="text-white/30 text-xs mt-1">Member since {formatDate(user.createdAt)}</p>
              </div>
            </div>

            {/* Display name */}
            <div className={CARD + ' p-6'}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-sm font-semibold">Display Name</h3>
                {!editingName && (
                  <button onClick={() => { setEditingName(true); setNameInput(name) }}
                    className="text-xs text-[#8B5CF6] hover:text-[#a78bfa] transition-colors duration-150 cursor-pointer">
                    Edit
                  </button>
                )}
              </div>
              {editingName ? (
                <div className="flex flex-col gap-3">
                  <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()} autoFocus className={INPUT} placeholder="Your name" />
                  <div className="flex gap-2">
                    <button onClick={saveName} disabled={nameSaving || !nameInput.trim()}
                      className="text-sm font-semibold bg-[#8B5CF6] hover:bg-[#7c3aed] text-white px-5 py-2 rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-50">
                      {nameSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setEditingName(false)}
                      className="text-sm text-white/50 hover:text-white/80 transition-colors duration-150 cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-white/65 text-sm">{name || <span className="text-white/30 italic">Not set</span>}</p>
              )}
              {nameMsg && <p className={`text-xs mt-2 ${nameMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{nameMsg.text}</p>}
            </div>

            {/* Email */}
            <div className={CARD + ' p-6'}>
              <h3 className="text-white text-sm font-semibold mb-4">Email Address</h3>
              <p className="text-white/65 text-sm">{user.email}</p>
              <p className="text-white/30 text-xs mt-1">Email cannot be changed here.</p>
            </div>

            {/* Password */}
            <div className={CARD + ' p-6'}>
              <h3 className="text-white text-sm font-semibold mb-1">Password</h3>
              <p className="text-white/40 text-xs mb-4">We&apos;ll send a reset link to your email.</p>
              <button onClick={sendResetLink} disabled={resetSending}
                className="inline-flex items-center gap-2 text-sm font-medium border border-white/[0.12] text-white/65 hover:text-white hover:border-white/25 px-5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50">
                {icons.lock} {resetSending ? 'Sending…' : 'Send reset link'}
              </button>
              {resetMsg && <p className={`text-xs mt-3 ${resetMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{resetMsg.text}</p>}
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ───────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-3">
            {orders.length === 0 ? (
              <div className={CARD + ' p-12 flex flex-col items-center text-center gap-4'}>
                <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]/60">{icons.package}</div>
                <div>
                  <p className="text-white text-base font-semibold">No orders yet</p>
                  <p className="text-white/40 text-sm mt-1">Your order history will appear here.</p>
                </div>
                <Link href="/products" className="inline-flex items-center gap-2 bg-[#FF6523] hover:bg-[#E5561E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150">
                  Shop Now {icons.arrow}
                </Link>
              </div>
            ) : (
              orders.map(o => <OrderRow key={o.id} order={o} />)
            )}
          </div>
        )}

        {/* ── ADDRESSES TAB ────────────────────────────────────── */}
        {activeTab === 'addresses' && (
          <div className="flex flex-col gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className={CARD + ' p-5'}>
                {editAddrId === addr.id ? (
                  <AddressForm initial={addr}
                    onSave={data => saveAddress(data, addr.id)}
                    onCancel={() => setEditAddrId(null)} />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white text-sm font-semibold">{addr.label}</span>
                        {addr.is_default && (
                          <span className="text-[10px] font-semibold bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/25 px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-white/70 text-sm">{addr.full_name}</p>
                      {addr.phone && <p className="text-white/45 text-xs mt-0.5">{addr.phone}</p>}
                      <p className="text-white/55 text-sm mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                      <p className="text-white/55 text-sm">{addr.city}, {addr.state} – {addr.pincode}</p>
                      <p className="text-white/35 text-xs mt-0.5">{addr.country}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setEditAddrId(addr.id)}
                        className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors duration-150 cursor-pointer">
                        {icons.edit}
                      </button>
                      <button onClick={() => deleteAddress(addr.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-500/[0.08] rounded-lg transition-colors duration-150 cursor-pointer">
                        {icons.trash}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {addingAddr ? (
              <div className={CARD + ' p-5'}>
                <p className="text-white text-sm font-semibold mb-4">New Address</p>
                <AddressForm onSave={data => saveAddress(data)} onCancel={() => setAddingAddr(false)} />
              </div>
            ) : (
              <button onClick={() => setAddingAddr(true)}
                className="inline-flex items-center gap-2 text-sm font-medium border border-dashed border-white/[0.15] text-white/50 hover:text-white hover:border-white/25 px-5 py-3.5 rounded-2xl w-full justify-center transition-all duration-150 cursor-pointer">
                {icons.plus} Add address
              </button>
            )}
          </div>
        )}

        {/* ── SAVED TAB ────────────────────────────────────────── */}
        {activeTab === 'saved' && (
          <div className="flex flex-col gap-4">

            {/* Sub-tabs */}
            <div className="flex items-center gap-1 bg-[#0F0F0F] border border-white/[0.07] rounded-xl p-1 w-fit">
              {[{ id: 'posts', label: 'Saved Articles' }, { id: 'products', label: 'Favorites' }].map(st => (
                <button key={st.id} onClick={() => setSavedSubTab(st.id as 'posts' | 'products')}
                  className={[
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
                    savedSubTab === st.id ? 'bg-[#8B5CF6]/15 text-white border border-[#8B5CF6]/25' : 'text-white/45 hover:text-white/70',
                  ].join(' ')}>
                  {st.label}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {st.id === 'posts' ? savedPosts.length : favorites.length}
                  </span>
                </button>
              ))}
            </div>

            {savedSubTab === 'posts' && (
              savedPosts.length === 0 ? (
                <div className={CARD + ' p-10 flex flex-col items-center text-center gap-3'}>
                  <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]/50">{icons.bookmark}</div>
                  <p className="text-white/60 text-sm">No saved articles yet.</p>
                  <Link href="/blog" className="text-[#8B5CF6] text-sm hover:text-[#a78bfa] transition-colors duration-150">Browse articles</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedPosts.map(sp => {
                    const post = POSTS.find(p => p.slug === sp.post_slug)
                    return (
                      <div key={sp.post_slug} className={CARD + ' overflow-hidden flex flex-col'}>
                        {/* Cover image */}
                        <Link href={`/blog/${sp.post_slug}`} className="relative block h-40 overflow-hidden">
                          {post ? (
                            <Image src={post.image} alt={post.title} fill
                              className="object-cover transition-transform duration-500 hover:scale-[1.04]"
                              sizes="(max-width: 640px) 100vw, 50vw" />
                          ) : (
                            <div className="w-full h-full bg-white/[0.04] flex items-center justify-center text-white/20">{icons.bookmark}</div>
                          )}
                          {post && (
                            <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white/80 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {post.category}
                            </span>
                          )}
                        </Link>
                        {/* Body */}
                        <div className="p-4 flex flex-col gap-1.5 flex-1">
                          <Link href={`/blog/${sp.post_slug}`}
                            className="text-white text-sm font-semibold leading-snug hover:text-white/80 transition-colors duration-150 line-clamp-2">
                            {post?.title ?? sp.post_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Link>
                          {post && (
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-white/40 text-xs">{post.readTime}</span>
                              <span className="text-white/20 text-xs">·</span>
                              <span className="text-white/40 text-xs">{post.author.name}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
                            <p className="text-white/25 text-xs">Saved {formatDate(sp.saved_at)}</p>
                            <button onClick={() => removeSavedPost(sp.post_slug)}
                              className="w-7 h-7 flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-500/[0.08] rounded-lg transition-colors duration-150 cursor-pointer">
                              {icons.trash}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            )}

            {savedSubTab === 'products' && (
              favorites.length === 0 ? (
                <div className={CARD + ' p-10 flex flex-col items-center text-center gap-3'}>
                  <div className="w-12 h-12 rounded-xl bg-[#FF6523]/10 border border-[#FF6523]/20 flex items-center justify-center text-[#FF6523]/50"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
                  <p className="text-white/60 text-sm">No favorite products yet.</p>
                  <Link href="/products" className="text-[#8B5CF6] text-sm hover:text-[#a78bfa] transition-colors duration-150">Browse products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map(fav => {
                    const product = PRODUCTS.find(p => p.slug === fav.product_slug)
                    return (
                      <div key={fav.product_slug} className={CARD + ' overflow-hidden flex flex-col'}>
                        {/* Image */}
                        <Link href={`/products/${fav.product_slug}`} className="relative block h-40 overflow-hidden">
                          {product ? (
                            <Image src={product.image} alt={product.name} fill
                              className="object-cover transition-transform duration-500 hover:scale-[1.04]"
                              sizes="(max-width: 640px) 100vw, 50vw" />
                          ) : (
                            <div className="w-full h-full bg-white/[0.04]" />
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0F0F0F] to-transparent" />
                          {product && (
                            <span className="absolute top-3 left-3 inline-block bg-white/10 border border-white/20 text-white text-[10px] font-semibold tracking-[0.14em] uppercase px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                              {product.tag}
                            </span>
                          )}
                        </Link>
                        {/* Body */}
                        <div className="p-4 flex flex-col gap-1.5 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <Link href={`/products/${fav.product_slug}`}
                              className="text-white text-sm font-semibold leading-snug hover:text-white/80 transition-colors duration-150 line-clamp-1">
                              {product?.name ?? fav.product_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Link>
                            {product && (
                              <span className="text-[#FF6523] text-sm font-bold tabular-nums shrink-0">{product.price}</span>
                            )}
                          </div>
                          {product && (
                            <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{product.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
                            <p className="text-white/25 text-xs">Saved {formatDate(fav.saved_at)}</p>
                            <button onClick={() => removeFavorite(fav.product_slug)}
                              className="w-7 h-7 flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-500/[0.08] rounded-lg transition-colors duration-150 cursor-pointer">
                              {icons.trash}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ─────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className={CARD + ' p-10 flex flex-col items-center text-center gap-3'}>
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]/50">{icons.settings}</div>
            <p className="text-white text-base font-semibold">Coming soon</p>
            <p className="text-white/40 text-sm">Notification preferences and more will be here shortly.</p>
          </div>
        )}

      </div>
    </div>
  )
}
