'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { event as gaEvent } from '@/lib/gtag'

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
        {label}{required && <span className="text-[#FF6523] ml-0.5">*</span>}
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

  /* Address autocomplete */
  type NominatimResult = { display_name: string; address: Record<string, string> }
  const [addrSuggestions,     setAddrSuggestions]     = useState<NominatimResult[]>([])
  const [showAddrSuggestions, setShowAddrSuggestions] = useState(false)
  const addr1Ref = useRef<HTMLDivElement>(null)

  // Debounced Nominatim search
  useEffect(() => {
    if (addr1.length < 3) { setAddrSuggestions([]); return }
    const timer = setTimeout(async () => {
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addr1)}&format=json&addressdetails=1&limit=5&countrycodes=in`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data: NominatimResult[] = await res.json()
        setAddrSuggestions(data)
        if (data.length > 0) setShowAddrSuggestions(true)
      } catch {}
    }, 420)
    return () => clearTimeout(timer)
  }, [addr1])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (addr1Ref.current && !addr1Ref.current.contains(e.target as Node))
        setShowAddrSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectAddrSuggestion = (item: NominatimResult) => {
    const a = item.address ?? {}

    // addr1: house + road, fallback to first 3 parts of display_name
    const housePart  = a.house_number ?? a.house_name ?? ''
    const streetPart = a.road ?? a.street ?? a.footway ?? a.pedestrian ?? a.path ?? ''
    const line1 = [housePart, streetPart].filter(Boolean).join(', ')
      || item.display_name.split(',').slice(0, 3).join(',').trim()
    setAddr1(line1)

    // addr2: locality / suburb / neighbourhood
    const line2 = a.neighbourhood ?? a.suburb ?? a.quarter ?? a.locality ?? a.village ?? ''
    if (line2 && line2 !== (a.city ?? a.town ?? '')) setAddr2(line2)

    // city: try multiple keys used in Indian results
    const cityVal = a.city ?? a.town ?? a.county ?? a.district ?? a['city_district'] ?? ''
    if (cityVal) setCity(cityVal)

    // state
    if (a.state) setState(a.state)

    // pincode: strip spaces, keep first 6 digits
    if (a.postcode) setPincode(a.postcode.replace(/\D/g, '').slice(0, 6))

    setAddrSuggestions([])
    setShowAddrSuggestions(false)
  }

  /* Payment + order state */
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod')
  const [placing,      setPlacing]        = useState(false)
  const [orderError,   setOrderError]     = useState('')
  const [successOrder, setSuccessOrder]   = useState<string | null>(null)

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

      // Send confirmation email (fire-and-forget)
      fetch('/api/email/order-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber:   order.order_number,
          customerName:  name.trim(),
          customerEmail: email.trim(),
          items:         items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, lineTotal: i.price * i.quantity })),
          subtotal,
          discount,
          shipping,
          total: finalTotal,
          paymentMethod: 'cod',
          address: [addr1.trim(), addr2.trim(), city.trim(), state.trim(), pincode.trim(), 'India'].filter(Boolean).join(', '),
        }),
      }).catch(console.error)

      // GA4 purchase event
      gaEvent('purchase', {
        transaction_id: order.order_number,
        value: finalTotal,
        currency: 'INR',
        items: items.map(i => ({ item_id: i.slug, item_name: i.name, price: i.price, quantity: i.quantity })),
      })

      clearCart()
      setSuccessOrder(order.order_number)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to place order. Please try again.'
      setOrderError(msg)
    } finally {
      setPlacing(false)
    }
  }

  /* Razorpay payment */
  const handleRazorpayPayment = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !addr1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setOrderError('Please fill in all required fields.')
      return
    }
    setPlacing(true)
    setOrderError('')
    try {
      // 1. Create Razorpay order on server
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal, receipt: `mz_${Date.now()}` }),
      })
      const rzpOrder = await res.json()
      if (!res.ok) throw new Error(rzpOrder.error ?? 'Failed to initiate payment')

      // 2. Load Razorpay script if not already loaded
      if (!document.getElementById('razorpay-script')) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script')
          s.id  = 'razorpay-script'
          s.src = 'https://checkout.razorpay.com/v1/checkout.js'
          s.onload  = () => resolve()
          s.onerror = () => reject(new Error('Failed to load Razorpay'))
          document.head.appendChild(s)
        })
      }

      // 3. Open checkout modal
      type RazorpayInstance = { open: () => void }
      const RazorpayClass = (window as unknown as { Razorpay: new (opts: unknown) => RazorpayInstance }).Razorpay
      const rzp = new RazorpayClass({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      rzpOrder.amount,
        currency:    rzpOrder.currency,
        order_id:    rzpOrder.id,
        name:        'MycoZenith',
        description: 'Order Payment',
        prefill:     { name: name.trim(), email: email.trim(), contact: phone.trim() },
        theme:       { color: '#8B5CF6' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // 4. Verify + persist order on server
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              customerName:  name.trim(),
              customerEmail: email.trim(),
              customerPhone: phone.trim(),
              addr1: addr1.trim(), addr2: addr2.trim(),
              city: city.trim(), state: state.trim(), pincode: pincode.trim(),
              subtotal, discount, shipping, total: finalTotal,
              items,
              userId: user?.id,
            }),
          })
          const verifyData = await verifyRes.json()
          if (!verifyRes.ok) throw new Error(verifyData.error ?? 'Payment verification failed')

          gaEvent('purchase', {
            transaction_id: verifyData.orderNumber,
            value: finalTotal,
            currency: 'INR',
            payment_type: 'razorpay',
            items: items.map(i => ({ item_id: i.slug, item_name: i.name, price: i.price, quantity: i.quantity })),
          })

          clearCart()
          setSuccessOrder(verifyData.orderNumber)
          setPlacing(false)
        },
      })
      rzp.open()
      // Note: setPlacing(false) on success is inside handler; on modal close without payment it stays true briefly
      // Reset if user dismisses modal
      setTimeout(() => setPlacing(false), 500)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Payment failed. Please try again.'
      setOrderError(msg)
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
                <Field label="Address Line 1" required>
                  <div ref={addr1Ref} className="relative">
                    <input
                      type="text"
                      value={addr1}
                      onChange={(e) => { setAddr1(e.target.value); setShowAddrSuggestions(true) }}
                      onFocus={() => addrSuggestions.length > 0 && setShowAddrSuggestions(true)}
                      placeholder="Start typing your address…"
                      autoComplete="off"
                      className={INPUT}
                    />
                    {showAddrSuggestions && addrSuggestions.length > 0 && (
                      <ul className="absolute z-50 top-full mt-1 w-full bg-[#161616] border border-white/[0.1] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                        {addrSuggestions.map((item, i) => (
                          <li key={i}>
                            <button
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); selectAddrSuggestion(item) }}
                              className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors duration-150 flex items-start gap-2.5 cursor-pointer"
                            >
                              <svg className="shrink-0 mt-0.5 text-white/30" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                              </svg>
                              <span className="line-clamp-2 text-xs leading-relaxed">{item.display_name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
                {/* COD */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={['flex items-center gap-3 rounded-xl px-4 py-3.5 cursor-pointer transition-colors duration-150',
                    paymentMethod === 'cod'
                      ? 'bg-white/[0.03] border border-[#8B5CF6]/30'
                      : 'bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15]',
                  ].join(' ')}>
                  <div className={['w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    paymentMethod === 'cod' ? 'border-[#8B5CF6]' : 'border-white/25'].join(' ')}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-white/35 text-xs">Pay when your order arrives</p>
                  </div>
                </label>
                {/* Razorpay */}
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={['flex items-center gap-3 rounded-xl px-4 py-3.5 cursor-pointer transition-colors duration-150',
                    paymentMethod === 'razorpay'
                      ? 'bg-white/[0.03] border border-[#8B5CF6]/30'
                      : 'bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15]',
                  ].join(' ')}>
                  <div className={['w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    paymentMethod === 'razorpay' ? 'border-[#8B5CF6]' : 'border-white/25'].join(' ')}>
                    {paymentMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">Online Payment</p>
                    <p className="text-white/35 text-xs">UPI, Card, Netbanking via Razorpay</p>
                  </div>
                  <img src="https://razorpay.com/favicon.ico" alt="Razorpay" className="w-5 h-5 opacity-70" />
                </label>
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
              onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : placeOrder}
              disabled={placing || items.length === 0}
              className="lg:hidden w-full flex items-center justify-center gap-2 bg-[#FF6523] hover:bg-[#E5561E] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer tracking-wide"
            >
              {placing ? (
                <>
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  {paymentMethod === 'razorpay' ? 'Opening Payment…' : 'Placing Order…'}
                </>
              ) : (
                <>{paymentMethod === 'razorpay' ? 'PAY' : 'PLACE ORDER'} — ₹{finalTotal.toLocaleString('en-IN')} <ArrowRight /></>
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
                  <Link href="/cart"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/50 text-xs font-semibold transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Cart
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
                          className="px-3 py-2 border border-[#8B5CF6]/60 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6] text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap">
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
                    <span className="tabular-nums text-[#FF6523]">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Desktop CTA */}
              <button
                onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : placeOrder}
                disabled={placing || items.length === 0}
                className="hidden lg:flex w-full items-center justify-center gap-2 bg-[#FF6523] hover:bg-[#E5561E] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer tracking-wide"
              >
                {placing ? (
                  <>
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    {paymentMethod === 'razorpay' ? 'Opening Payment…' : 'Placing Order…'}
                  </>
                ) : (
                  <>{paymentMethod === 'razorpay' ? 'PAY' : 'PLACE ORDER'} — ₹{finalTotal.toLocaleString('en-IN')} <ArrowRight /></>
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
