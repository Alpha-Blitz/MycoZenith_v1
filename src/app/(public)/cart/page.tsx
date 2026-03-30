'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

/* ─── Promo codes ─────────────────────────────────────────────── */
const PROMO_CODES: Record<string, number> = { MYCO10: 0.10 }

/* ─── Icons ───────────────────────────────────────────────────── */
function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function TagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )
}

function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

/* ─── Qty Stepper ─────────────────────────────────────────────── */
function QtyStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center bg-white/[0.04] border border-white/[0.1] rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-base font-light"
      >−</button>
      <span className="w-8 text-center text-white text-sm font-semibold tabular-nums select-none">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        disabled={value >= 10}
        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-base font-light"
      >+</button>
    </div>
  )
}

/* ─── Form Field ──────────────────────────────────────────────── */
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/50 text-xs font-semibold tracking-[0.12em] uppercase">
        {label}{required && <span className="text-[#F97316] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const INPUT = 'w-full bg-[#111111] border border-white/[0.1] text-white text-sm placeholder-white/20 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200'

/* ─── Page ────────────────────────────────────────────────────── */
export default function CartPage() {
  const {
    items, savedItems,
    removeItem, updateQty, saveForLater, moveToCart, clearCart,
    subtotal, shipping, hydrated,
  } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  /* Promo code */
  const [promoInput,   setPromoInput]   = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError,   setPromoError]   = useState('')

  const discount    = appliedPromo ? Math.round(subtotal * PROMO_CODES[appliedPromo]) : 0
  const finalTotal  = subtotal - discount + shipping

  /* Checkout form */
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [addr1,   setAddr1]   = useState('')
  const [addr2,   setAddr2]   = useState('')
  const [city,    setCity]    = useState('')
  const [state,   setState]   = useState('')
  const [pincode, setPincode] = useState('')

  const [placing,      setPlacing]      = useState(false)
  const [orderError,   setOrderError]   = useState('')
  const [successOrder, setSuccessOrder] = useState<string | null>(null)

  /* Pre-fill from auth */
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name ?? '')
      setEmail(user.email ?? '')
    }
  }, [user])

  /* Free-shipping progress */
  const freeShippingPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const freeShippingLeft = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

  /* "You might also like" */
  const suggestions = useMemo(() => {
    const inCart = new Set(items.map((i) => i.slug))
    return PRODUCTS.filter((p) => !inCart.has(p.slug)).slice(0, 3)
  }, [items])

  /* Apply promo */
  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setAppliedPromo(code)
      setPromoError('')
      setPromoInput('')
    } else {
      setPromoError('Invalid promo code')
    }
  }

  /* Place order */
  const placeOrder = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !addr1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setOrderError('Please fill in all required fields.')
      return
    }
    setPlacing(true)
    setOrderError('')
    try {
      const supabase = createClient()
      const orderNumber = `MZ-${Date.now().toString(36).toUpperCase()}`

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number:   orderNumber,
          user_id:        user?.id ?? null,
          customer_name:  name.trim(),
          customer_email: email.trim(),
          customer_phone: phone.trim(),
          address_line1:  addr1.trim(),
          address_line2:  addr2.trim() || null,
          city:           city.trim(),
          state:          state.trim(),
          pincode:        pincode.trim(),
          country:        'India',
          subtotal,
          discount,
          shipping,
          total: finalTotal,
          currency:       'INR',
          payment_method: 'cod',
          status:         'pending',
        })
        .select('id, order_number')
        .single()

      if (orderErr) throw orderErr

      const orderItems = items.map((item) => ({
        order_id:      order.id,
        product_name:  item.name,
        product_slug:  item.slug,
        product_image: item.image,
        unit_price:    item.price,
        quantity:      item.quantity,
        line_total:    item.price * item.quantity,
      }))

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
      if (itemsErr) throw itemsErr

      clearCart()
      setSuccessOrder(order.order_number)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to place order. Please try again.'
      setOrderError(msg)
    } finally {
      setPlacing(false)
    }
  }

  /* ── Success state ──────────────────────────────────────────── */
  if (successOrder) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
              fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase mb-3">Order Confirmed</p>
          <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Thank you for your order!
          </h1>
          <p className="text-white/45 text-sm leading-relaxed mb-2">
            We&apos;ll confirm your order shortly via email.
          </p>
          <p className="text-white/30 text-xs mb-8">
            Order #{successOrder}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account?tab=orders"
              className="inline-flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            >
              Track Order <ArrowRight />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Empty cart ─────────────────────────────────────────────── */
  if (hydrated && items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center px-4 pt-20 text-center">
        <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6 text-white/20">
          <PackageIcon />
        </div>
        <p className="text-white/25 text-xs font-semibold tracking-[0.22em] uppercase mb-3">Empty Cart</p>
        <h1 className="text-white text-2xl font-semibold tracking-tight mb-2">Your cart is empty</h1>
        <p className="text-white/40 text-sm mb-8">Explore our premium mushroom extracts to get started.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02]"
        >
          Shop Now <ArrowRight />
        </Link>
      </div>
    )
  }

  /* ── Main cart layout ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-16 sm:pb-28">

        {/* Page heading */}
        <div className="mb-8 sm:mb-10">
          <p className="text-[#8B5CF6] text-[11px] font-semibold tracking-[0.22em] uppercase mb-2">Checkout</p>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">
            Your Cart
            {items.length > 0 && (
              <span className="ml-3 text-white/30 text-xl font-normal">
                ({items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''})
              </span>
            )}
          </h1>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_390px] lg:gap-10 xl:gap-14">

          {/* ── LEFT: Items ───────────────────────────────────── */}
          <div className="flex flex-col gap-3">

            {/* Cart items */}
            {items.map((item) => (
              <div key={item.slug}
                className="flex gap-4 bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-4 sm:p-5">

                {/* Image */}
                <Link href={`/products/${item.slug}`} className="relative shrink-0 w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-xl overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="88px" />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <Link href={`/products/${item.slug}`}
                        className="text-white text-sm sm:text-base font-semibold leading-snug hover:text-white/80 transition-colors duration-200 line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-white/35 text-xs mt-0.5">{item.tag}</p>
                    </div>
                    <p className="text-[#F97316] text-sm font-bold tabular-nums shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Controls row */}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <QtyStepper value={item.quantity} onChange={(q) => updateQty(item.slug, q)} />
                      <span className="text-white/25 text-xs tabular-nums">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => saveForLater(item.slug)}
                        className="text-white/30 hover:text-[#8B5CF6] text-xs transition-colors duration-150 cursor-pointer"
                      >
                        Save for later
                      </button>
                      <button
                        onClick={() => removeItem(item.slug)}
                        className="text-white/25 hover:text-red-400 transition-colors duration-150 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Saved for later */}
            {savedItems.length > 0 && (
              <div className="mt-4">
                <p className="text-white/30 text-xs font-semibold tracking-[0.16em] uppercase mb-3">
                  Saved for Later ({savedItems.length})
                </p>
                <div className="flex flex-col gap-2">
                  {savedItems.map((item) => (
                    <div key={item.slug}
                      className="flex items-center gap-4 bg-[#0A0A0A] border border-white/[0.06] rounded-xl px-4 py-3">
                      <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/70 text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-white/30 text-xs">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => moveToCart(item.slug)}
                        className="text-[#8B5CF6] text-xs font-semibold hover:text-[#a78bfa] transition-colors duration-150 cursor-pointer shrink-0"
                      >
                        Move to cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* You might also like */}
            {suggestions.length > 0 && (
              <div className="mt-10">
                <p className="text-white/30 text-xs font-semibold tracking-[0.18em] uppercase mb-5">
                  You Might Also Like
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {suggestions.map((p) => (
                    <ProductCard key={p.slug} {...p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Summary + Checkout ────────────────────── */}
          <div className="mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24 flex flex-col gap-5">

              {/* Order summary card */}
              <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">

                {/* Free shipping bar */}
                <div>
                  {freeShippingLeft > 0 ? (
                    <p className="text-white/50 text-xs mb-2">
                      Add <span className="text-white font-semibold">₹{freeShippingLeft.toLocaleString('en-IN')}</span> more for free shipping
                    </p>
                  ) : (
                    <p className="text-emerald-400 text-xs font-semibold mb-2 flex items-center gap-1.5">
                      <CheckIcon /> Free shipping unlocked!
                    </p>
                  )}
                  <div className="h-1.5 w-full bg-white/[0.07] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${freeShippingPct}%`,
                        background: freeShippingLeft === 0
                          ? 'linear-gradient(90deg, #10b981, #34d399)'
                          : 'linear-gradient(90deg, #8B5CF6, #a78bfa)',
                      }}
                    />
                  </div>
                </div>

                {/* Promo code */}
                <div>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-xl px-3.5 py-2.5">
                      <div className="flex items-center gap-2 text-[#8B5CF6]">
                        <TagIcon />
                        <span className="text-xs font-semibold">{appliedPromo} — 10% off applied</span>
                      </div>
                      <button
                        onClick={() => setAppliedPromo(null)}
                        className="text-white/30 hover:text-white/60 text-xs transition-colors duration-150 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                        onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                        placeholder="Promo code"
                        className="flex-1 bg-[#111111] border border-white/[0.1] text-white text-sm placeholder-white/20 px-3.5 py-2 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200"
                      />
                      <button
                        onClick={applyPromo}
                        className="px-4 py-2 bg-white/[0.06] border border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.1] text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && <p className="text-red-400 text-xs mt-1.5">{promoError}</p>}
                </div>

                {/* Price breakdown */}
                <div className="flex flex-col gap-2.5 border-t border-white/[0.06] pt-4">
                  <div className="flex justify-between text-sm text-white/50">
                    <span>Subtotal</span>
                    <span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-[#8B5CF6]">
                      <span>Discount ({appliedPromo})</span>
                      <span className="tabular-nums">−₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-white/50">
                    <span>Shipping</span>
                    {shipping === 0
                      ? <span className="text-emerald-400 font-medium">Free</span>
                      : <span className="tabular-nums">₹{shipping}</span>}
                  </div>
                  <div className="flex justify-between font-semibold text-white pt-2 border-t border-white/[0.06]">
                    <span>Total</span>
                    <span className="tabular-nums text-[#F97316]">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Checkout form */}
              <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
                <div>
                  <p className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.22em] uppercase mb-1">Delivery Details</p>
                  <h2 className="text-white text-base font-semibold">Where should we deliver?</h2>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Full Name" required>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Your name" className={INPUT} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Email" required>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com" className={INPUT} />
                    </Field>
                    <Field label="Phone" required>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210" className={INPUT} />
                    </Field>
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-3">
                  <Field label="Address Line 1" required>
                    <input type="text" value={addr1} onChange={(e) => setAddr1(e.target.value)}
                      placeholder="House / Flat / Building" className={INPUT} />
                  </Field>
                  <Field label="Address Line 2">
                    <input type="text" value={addr2} onChange={(e) => setAddr2(e.target.value)}
                      placeholder="Street / Area (optional)" className={INPUT} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Field label="City" required>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                        placeholder="City" className={INPUT} />
                    </Field>
                    <Field label="State" required>
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                        placeholder="State" className={INPUT} />
                    </Field>
                    <Field label="Pincode" required>
                      <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)}
                        placeholder="560001" className={INPUT} maxLength={6} />
                    </Field>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-white/40 text-xs font-semibold tracking-[0.14em] uppercase mb-3">Payment Method</p>
                  <div className="flex flex-col gap-2">
                    {/* COD */}
                    <label className="flex items-center gap-3 bg-white/[0.03] border border-[#8B5CF6]/30 rounded-xl px-4 py-3 cursor-pointer">
                      <div className="w-4 h-4 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Cash on Delivery</p>
                        <p className="text-white/35 text-xs">Pay when your order arrives</p>
                      </div>
                    </label>
                    {/* Razorpay — disabled */}
                    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 opacity-50 select-none">
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 shrink-0" />
                      <div className="flex-1">
                        <p className="text-white/50 text-sm font-medium">Online Payment</p>
                        <p className="text-white/25 text-xs">UPI, Card, Netbanking</p>
                      </div>
                      <span className="text-[10px] font-semibold bg-white/[0.07] border border-white/[0.1] text-white/40 px-2 py-0.5 rounded-full tracking-wide">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {orderError && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {orderError}
                  </p>
                )}

                {/* CTA */}
                <button
                  onClick={placeOrder}
                  disabled={placing || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer tracking-wide"
                >
                  {placing ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Placing Order…
                    </>
                  ) : (
                    <>
                      PLACE ORDER — ₹{finalTotal.toLocaleString('en-IN')}
                      <ArrowRight />
                    </>
                  )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-white/25 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Secure · Free returns · COD available
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
