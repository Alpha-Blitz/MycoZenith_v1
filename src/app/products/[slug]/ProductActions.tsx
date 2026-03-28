'use client'

import { useState } from 'react'
import Link from 'next/link'

function ArrowLeft({ size = 13 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function CartPlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export default function ProductActions() {
  const [qty,   setQty]   = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="flex flex-col gap-5">
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

      {/* CTA buttons */}
      <div className="grid grid-cols-2 gap-3 max-w-sm">
        <button
          onClick={handleAddToCart}
          className={[
            'inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer',
            added
              ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#8B5CF6]'
              : 'bg-[#F97316] hover:bg-[#EA580C] border-transparent text-white hover:scale-[1.02]',
          ].join(' ')}
        >
          <CartPlusIcon />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
        <Link href="/products"
          className="inline-flex items-center justify-center gap-1.5 border border-white/[0.15] text-white/60 hover:text-white hover:border-white/30 text-sm font-medium px-5 py-3.5 rounded-xl transition-all duration-200">
          <ArrowLeft size={13} />
          Back to Shop
        </Link>
      </div>
    </div>
  )
}
