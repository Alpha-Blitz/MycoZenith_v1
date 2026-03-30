'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, parsePrice } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

type Props = {
  slug: string
  name: string
  image: string
  price: string
  tag: string
}

export default function ProductActions({ slug, name, image, price, tag }: Props) {
  const [qty,       setQty]       = useState(1)
  const [added,     setAdded]     = useState(false)
  const [copied,    setCopied]    = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  const { addItem } = useCart()
  const { user, openModal } = useAuth()
  const router = useRouter()

  /* Check if already favorited */
  useEffect(() => {
    if (!user) { setFavorited(false); return }
    const supabase = createClient()
    supabase
      .from('favorite_products')
      .select('product_slug')
      .eq('user_id', user.id)
      .eq('product_slug', slug)
      .maybeSingle()
      .then(({ data }) => setFavorited(!!data))
  }, [user, slug])

  const handleFavorite = async () => {
    if (!user) { openModal(); return }
    setFavLoading(true)
    const supabase = createClient()
    if (favorited) {
      await supabase
        .from('favorite_products')
        .delete()
        .eq('user_id', user.id)
        .eq('product_slug', slug)
      setFavorited(false)
    } else {
      await supabase
        .from('favorite_products')
        .insert({ user_id: user.id, product_slug: slug })
      setFavorited(true)
    }
    setFavLoading(false)
  }

  const handleAddToCart = () => {
    addItem({ slug, name, image, price: parsePrice(price), tag, quantity: qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleBuyNow = () => {
    addItem({ slug, name, image, price: parsePrice(price), tag, quantity: qty })
    router.push('/cart')
  }

  async function handleShare() {
    const url = `${window.location.origin}/products/${slug}`
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url }) } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex flex-col gap-2">
        <p className="text-white/40 text-xs font-semibold tracking-[0.14em] uppercase">Quantity</p>
        <div className="flex items-center gap-0 bg-white/[0.05] border border-white/[0.1] rounded-xl w-fit overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-150 cursor-pointer text-lg font-light"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-white font-semibold tabular-nums select-none">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-150 cursor-pointer text-lg font-light"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Row 1: primary Buy Now */}
      <button
        onClick={handleBuyNow}
        className="w-full flex items-center justify-center gap-2 bg-[#FF6523] hover:bg-[#E5561E] text-white text-sm font-bold px-6 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer tracking-wide"
      >
        BUY NOW <ArrowRight />
      </button>

      {/* Row 2: Add to Cart + Subscribe & Save */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          className={[
            'inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer',
            added
              ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#8B5CF6]'
              : 'bg-white/[0.05] border-white/[0.15] text-white/80 hover:bg-white/[0.1] hover:border-white/25 hover:text-white',
          ].join(' ')}
        >
          <CartIcon />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
        <button
          onClick={handleAddToCart}
          className="inline-flex items-center justify-center gap-1.5 border border-[#FF6523]/50 text-[#FF6523] hover:bg-[#FF6523]/10 text-sm font-semibold px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer">
          <RefreshIcon />
          Subscribe &amp; Save
        </button>
      </div>

      {/* Secure checkout note + Favorite + Share */}
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-1.5 text-white/30 text-xs">
          <LockIcon />
          Secure checkout · Free shipping above ₹999
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleFavorite}
            disabled={favLoading}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={[
              'transition-all duration-200 cursor-pointer disabled:opacity-50 hover:scale-110',
              favorited ? 'text-red-400' : 'text-white/35 hover:text-red-400',
            ].join(' ')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-white/35 hover:text-white/70 text-xs transition-colors duration-150 cursor-pointer"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Share
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
