'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function InlineProductCard({ slug }: { slug: string }) {
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) return null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex items-center gap-4 bg-[#0F0F0F] border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 rounded-2xl p-4 my-7 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(139,92,246,0.12)]"
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.06]"
          sizes="64px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[#8B5CF6] text-[10px] font-semibold tracking-[0.16em] uppercase">
          {product.tag}
        </span>
        <p className="text-white font-semibold text-sm truncate">{product.name}</p>
        <p className="text-[#FF6523] text-sm font-bold">{product.price}</p>
      </div>

      {/* CTA */}
      <span className="inline-flex items-center gap-1.5 bg-[#FF6523] hover:bg-[#E5561E] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors duration-150 shrink-0">
        Shop Now <ArrowRight />
      </span>
    </Link>
  )
}
