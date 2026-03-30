'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart, FREE_SHIPPING_THRESHOLD } from '@/context/CartContext'
import { PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

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
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
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

/* ─── Promo codes ─────────────────────────────────────────────── */
const PROMO_CODES: Record<string, number> = { MYCO10: 0.10 }

/* ─── Qty Stepper ─────────────────────────────────────────────── */
function QtyStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center bg-white/[0.04] border border-white/[0.1] rounded-lg overflow-hidden">
      <button onClick={() => onChange(value - 1)} disabled={value <= 1}
        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-base font-light">
        −
      </button>
      <span className="w-8 text-center text-white text-sm font-semibold tabular-nums select-none">{value}</span>
      <button onClick={() => onChange(value + 1)} disabled={value >= 10}
        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.07] transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-base font-light">
        +
      </button>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function CartPage() {
  const {
    items, savedItems,
    removeItem, updateQty, saveForLater, moveToCart,
    subtotal, shipping, hydrated,
  } = useCart()
  const router = useRouter()

  /* Derived */
  const freeShippingPct  = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const freeShippingLeft = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
  const total            = subtotal + shipping

  /* "You might also like" */
  const suggestions = useMemo(() => {
    const inCart = new Set(items.map((i) => i.slug))
    return PRODUCTS.filter((p) => !inCart.has(p.slug)).slice(0, 3)
  }, [items])

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
        <Link href="/products"
          className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02]">
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
          <p className="text-[#8B5CF6] text-[11px] font-semibold tracking-[0.22em] uppercase mb-2">Shopping Cart</p>
          <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">
            Your Cart
            {items.length > 0 && (
              <span className="ml-3 text-white/30 text-xl font-normal">
                ({items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''})
              </span>
            )}
          </h1>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 xl:gap-14">

          {/* ── LEFT: Items ───────────────────────────────────── */}
          <div className="flex flex-col gap-3">

            {items.map((item) => (
              <div key={item.slug}
                className="flex gap-4 bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-4 sm:p-5">
                <Link href={`/products/${item.slug}`}
                  className="relative shrink-0 w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-xl overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="88px" />
                </Link>
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
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <QtyStepper value={item.quantity} onChange={(q) => updateQty(item.slug, q)} />
                      <span className="text-white/25 text-xs tabular-nums">
                        ₹{item.price.toLocaleString('en-IN')} each
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => saveForLater(item.slug)}
                        className="text-white/30 hover:text-[#8B5CF6] text-xs transition-colors duration-150 cursor-pointer">
                        Save for later
                      </button>
                      <button onClick={() => removeItem(item.slug)}
                        className="text-white/25 hover:text-red-400 transition-colors duration-150 cursor-pointer"
                        aria-label="Remove item">
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
                      <button onClick={() => moveToCart(item.slug)}
                        className="text-[#8B5CF6] text-xs font-semibold hover:text-[#a78bfa] transition-colors duration-150 cursor-pointer shrink-0">
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
                  {suggestions.map((p) => <ProductCard key={p.slug} {...p} />)}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order Summary ──────────────────────────── */}
          <div className="mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24 bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">

              <p className="text-white text-base font-semibold">Order Summary</p>

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
                        ? 'linear-gradient(90deg,#10b981,#34d399)'
                        : 'linear-gradient(90deg,#8B5CF6,#a78bfa)',
                    }}
                  />
                </div>
              </div>

              {/* Items mini-list */}
              <div className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <div key={item.slug} className="flex items-center gap-3">
                    <div className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-xs font-medium line-clamp-1">{item.name}</p>
                      <p className="text-white/30 text-[11px]">Qty {item.quantity}</p>
                    </div>
                    <p className="text-white/60 text-xs tabular-nums shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4">
                <div className="flex justify-between text-sm text-white/50">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-white/50">
                  <span>Shipping</span>
                  {shipping === 0
                    ? <span className="text-emerald-400 font-medium">Free</span>
                    : <span className="tabular-nums">₹{shipping}</span>}
                </div>
                <div className="flex justify-between font-semibold text-white pt-2 border-t border-white/[0.06]">
                  <span>Total</span>
                  <span className="tabular-nums text-[#F97316]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Promo code hint */}
              <p className="flex items-center gap-1.5 text-white/30 text-xs">
                <TagIcon /> Got a promo code? Apply it at checkout.
              </p>

              {/* CTA */}
              <button
                onClick={() => router.push('/checkout')}
                disabled={items.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer tracking-wide"
              >
                Proceed to Checkout <ArrowRight />
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
