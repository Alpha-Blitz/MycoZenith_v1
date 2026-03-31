'use client'

import { useState, useEffect, useRef } from 'react'
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

/* ─── Share Sheet ─────────────────────────────────────────────── */
function ShareSheet({ slug, onClose }: { slug: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/products/${slug}` : ''

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  const linkCls = "flex items-center gap-3 text-sm text-white/70 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors duration-100 cursor-pointer"

  return (
    <div ref={ref} className="absolute bottom-full mb-2 right-0 w-56 bg-[#0F0F0F] border border-white/[0.1] rounded-2xl p-2 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col">
      <button onClick={copyLink} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-white/[0.07] flex items-center justify-center text-base">🔗</span>
        {copied ? <span className="text-[#8B5CF6] font-medium">Copied!</span> : 'Copy Link'}
      </button>
      <a href={`instagram://share?url=${encodeURIComponent(url)}`} onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold">IG</span>
        Instagram
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-[#25D366] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.526 5.845L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.368l-.36-.214-3.722.868.936-3.613-.235-.371A9.818 9.818 0 1112 21.818z"/></svg>
        </span>
        WhatsApp
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-black border border-white/10 flex items-center justify-center text-white text-xs font-black">𝕏</span>
        Share on X
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white text-sm font-bold">f</span>
        Facebook
      </a>
      <a href={`https://mail.google.com/mail/?view=cm&su=Check%20this%20out&body=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" onClick={onClose} className={linkCls}>
        <span className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.548l8.073-6.055C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/></svg>
        </span>
        Gmail
      </a>
    </div>
  )
}

export default function ProductActions({ slug, name, image, price, tag }: Props) {
  const [qty,        setQty]        = useState(1)
  const [added,      setAdded]      = useState(false)
  const [shareOpen,  setShareOpen]  = useState(false)
  const [favorited,  setFavorited]  = useState(false)
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

  function handleShare() {
    setShareOpen(v => !v)
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
          <div className="relative">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-white/35 hover:text-white/70 text-xs transition-colors duration-150 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              Share
            </button>
            {shareOpen && <ShareSheet slug={slug} onClose={() => setShareOpen(false)} />}
          </div>
        </div>
      </div>
    </div>
  )
}
