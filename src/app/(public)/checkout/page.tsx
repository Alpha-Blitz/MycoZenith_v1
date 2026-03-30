'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

/* ─── Promo codes ─────────────────────────────────────────────── */
const PROMO_CODES: Record<string, number> = { MYCO10: 0.10 }

/* ─── Icons ───────────────────────────────────────────────────── */
function ArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
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

function TagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  )
}

function CheckIcon({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
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
export default function CheckoutPage() {
  const { items, subtotal, shipping, clearCart, hydrated } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  /* Redirect if cart is empty after hydration */
  useEffect(() => {
    if (hydrated && items.length === 0) router.replace('/cart')
  }, [hydrated, items.length, router])

  /* Promo */
  const [promoInput,   setPromoInput]   = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError,   setPromoError]   = useState('')

  const discount   = appliedPromo ? Math.round(subtotal * PROMO_CODES[appliedPromo]) : 0
  const finalTotal = subtotal - discount + shipping

  /* Form fields */
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [addr1,   setAddr1]   = useState('')
  const [addr2,   setAddr2]   = useState('')
  const [city,    setCity]    = useState('')
  const [state,   setState]   = useState('')
  const [pincode, setPincode] = useState('')

  /* Geolocation */
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')

  const useMyLocation = () => {
    if (!navigator.geolocation) { setLocError('Geolocation not supported by your browser.'); return }
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          const a    = data.address ?? {}
          // Address Line 1: house number + road
          const line1 = [a.house_number, a.road].filter(Boolean).join(' ')
          if (line1) setAddr1(line1)
          // Address Line 2: neighbourhood / suburb
          const line2 = a.neighbourhood ?? a.suburb ?? a.quarter ?? ''
          if (line2) setAddr2(line2)
          if (a.city ?? a.town ?? a.village) setCity(a.city ?? a.town ?? a.village)
          if (a.state) setState(a.state)
          if (a.postcode) setPincode(a.postcode.replace(/\s/g, '').slice(0, 6))
        } catch {
          setLocError('Could not fetch address. Please fill in manually.')
        } finally {
          setLocating(false)
        }
      },
      () => { setLocError('Location access denied. Please fill in manually.'); setLocating(false) },
      { timeout: 10000 }
    )
  }

  /* Order state */
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
            <CheckIcon size={36} />
          </div>
          <p className="text-[#8B5CF6] text-xs font-semibold tracking-[0.22em] uppercase mb-3">Order Confirmed</p>
          <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Thank you for your order!
          </h1>
          <p className="text-white/45 text-sm leading-relaxed mb-2">
            We&apos;ll confirm your order shortly via email.
          </p>
          <p className="text-white/30 text-xs mb-8">Order #{successOrder}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account?tab=orders"
              className="inline-flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200">
              Track Order <ArrowRight />
            </Link>
            <Link href="/products"
              className="inline-flex items-center justify-center gap-2 border border-white/[0.12] text-white/60 hover:text-white hover:border-white/25 text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── Checkout layout ────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-16 sm:pb-28">

        {/* Back link + heading */}
        <div className="mb-8 sm:mb-10">
          <Link href="/cart"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors duration-200 mb-5">
            <ArrowLeft /> Back to Cart
          </Link>
          <p className="text-[#8B5CF6] text-[11px] font-semibold tracking-[0.22em] uppercase mb-2">Checkout</p>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">Complete Your Order</h1>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-10 xl:gap-14">

          {/* ── LEFT: Form ────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Contact details */}
            <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">Step 1</p>
                <h2 className="text-white text-base font-semibold">Contact Information</h2>
              </div>
              <div className="flex flex-col gap-3">
                <Field label="Full Name" required>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name" className={INPUT} />
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
            </div>

            {/* Delivery address */}
            <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">Step 2</p>
                <h2 className="text-white text-base font-semibold">Delivery Address</h2>
              </div>
              <div className="flex flex-col gap-3">
                {/* Use my location */}
                <button
                  type="button"
                  onClick={useMyLocation}
                  disabled={locating}
                  className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#8B5CF6]/35 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-all duration-200 cursor-pointer"
                >
                  {locating ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="13" height="13"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Detecting location…
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/>
                        <line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/>
                        <line x1="18" y1="12" x2="22" y2="12"/>
                      </svg>
                      Use my location
                    </>
                  )}
                </button>
                {locError && <p className="text-red-400 text-xs -mt-1">{locError}</p>}

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
            </div>

            {/* Payment method */}
            <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">Step 3</p>
                <h2 className="text-white text-base font-semibold">Payment Method</h2>
              </div>
              <div className="flex flex-col gap-2">
                {/* COD — selected */}
                <label className="flex items-center gap-3 bg-white/[0.03] border border-[#8B5CF6]/30 rounded-xl px-4 py-3.5 cursor-pointer">
                  <div className="w-4 h-4 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-white/35 text-xs">Pay when your order arrives</p>
                  </div>
                </label>
                {/* Razorpay — coming soon */}
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3.5 opacity-50 select-none">
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

            {/* Mobile CTA */}
            <button
              onClick={placeOrder}
              disabled={placing || items.length === 0}
              className="lg:hidden w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer tracking-wide"
            >
              {placing ? (
                <>
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Placing Order…
                </>
              ) : (
                <>PLACE ORDER — ₹{finalTotal.toLocaleString('en-IN')} <ArrowRight /></>
              )}
            </button>
          </div>

          {/* ── RIGHT: Order Summary (sticky) ────────────────── */}
          <div className="mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">

              {/* Summary card */}
              <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-semibold">Order Summary</p>
                  <Link href="/cart" className="text-[#8B5CF6] text-xs hover:text-[#a78bfa] transition-colors duration-150">
                    Edit cart
                  </Link>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.slug} className="flex items-center gap-3">
                      <div className="relative shrink-0 w-11 h-11 rounded-lg overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="44px" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white/20 text-white text-[9px] font-bold flex items-center justify-center backdrop-blur-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/70 text-xs font-medium line-clamp-1">{item.name}</p>
                        <p className="text-white/30 text-[11px]">{item.tag}</p>
                      </div>
                      <p className="text-white/60 text-xs tabular-nums shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="border-t border-white/[0.06] pt-4">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2 text-[#8B5CF6]">
                        <TagIcon />
                        <span className="text-xs font-semibold">{appliedPromo} — 10% off</span>
                      </div>
                      <button onClick={() => setAppliedPromo(null)}
                        className="text-white/30 hover:text-white/60 text-xs transition-colors duration-150 cursor-pointer">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-2 overflow-hidden">
                        <input type="text" value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                          placeholder="Promo code"
                          className="min-w-0 flex-1 bg-[#111111] border border-white/[0.1] text-white text-sm placeholder-white/20 px-3 py-2 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors duration-200" />
                        <button onClick={applyPromo}
                          className="px-3 py-2 bg-white/[0.06] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.1] text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap">
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-red-400 text-xs">{promoError}</p>}
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                  <div className="flex justify-between text-sm text-white/50">
                    <span>Subtotal</span>
                    <span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-[#8B5CF6]">
                      <span>Discount</span>
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

              {/* Desktop CTA */}
              <button
                onClick={placeOrder}
                disabled={placing || items.length === 0}
                className="hidden lg:flex w-full items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer tracking-wide"
              >
                {placing ? (
                  <>
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Placing Order…
                  </>
                ) : (
                  <>PLACE ORDER — ₹{finalTotal.toLocaleString('en-IN')} <ArrowRight /></>
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
  )
}
